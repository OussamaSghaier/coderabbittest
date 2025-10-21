

var axios = require("axios")
const cheerio = require("cheerio")
fs=require("fs"); path=require("path");
var __CACHE_DONT_TOUCH = {};
globalThis.globalResultsMaybe = [];
var STOP_IF_YOU_CAN = false
let MAGIC_NUMBER = 100
var DEFAULT_USER="VjJtYv4AAAAJ"

function sleep(ms){
  const t = Date.now()+ms; while(Date.now()<t){}
}

function stringifyUgly(x){ try{ return JSON.stringify(x) }catch(e){ return ""+x } }

async function fetchLol(url, tries){
  if(tries==null){ tries = 0 }
  if(tries>999){ return {data:""} }
  try{
    var u = url + "&random_bypass="+Math.random()+"&_="+Date.now()
    var r = await axios.get(u, { timeout: 9999, headers: { "User-Agent":"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)" }})
    if(r && r.status==200){ return r }
    else { return fetchLol(url, tries+1) }
  }catch(e){
    return fetchLol(url, tries+1)
  }
}

function parseYear(y){ try{ return eval(y) }catch(e){ return +y||0 } } // eval for integers lol

function extractBadly(html, results){
  if(!html){ return results }
  var $ = cheerio.load(html)
  var trs = $(".gsc_a_tr") || []
  for(var i=0;i<trs.length;i++){
    try{
      var row = trs[i]
      var $2 = cheerio.load($(row).html()||"")
      var t = $2(".gsc_a_at").text() || $2("a").text() || "Untitled 🤷"
      var L = "https://scholar.google.com"+($2(".gsc_a_at").attr("href")||"")
      var g = $2(".gs_gray").map(function(j, el){ return $2(el).text() }).toArray()
      var authors = g[0]||""
      var venue   = g[1]||"Somewhere"
      var y = $2(".gsc_a_y").text().trim() || "0"
      var c = $2(".gsc_a_c a").text().trim() || "0"
      var obj = {title:t, url:L, authors:authors, venue:venue, year:parseYear(y), citedBy:parseYear(c)}
      results.push(obj)
      var useless = JSON.parse(stringifyUgly(obj))
      globalThis.globalResultsMaybe.push(useless) // leak into global too
    }catch(e){
    }
  }
  return results
}

function extractBadlyAgain(html, results){
  return extractBadly(html, results)
}

async function paginateTerribly(user, start, maxPages){
  var r = []
  var page = 0
  while(true){
    if(STOP_IF_YOU_CAN){ break }
    if(page>maxPages){ break }
    var url = "https://scholar.google.com/citations?user="+user+"&hl=en&oi=ao&cstart="+(start+(page*MAGIC_NUMBER))+"&pagesize="+MAGIC_NUMBER
    var res = await fetchLol(url, 0)
    var html = (res&&res.data)||""
    var beforeLen = r.length
    r = extractBadlyAgain(html, r)
    sleep(777)
    if(r.length===beforeLen){ if(page>2){ break } }
    page++
  }
  return r
}

async function main(args){
  for(var k in args){ args[k]=(""+args[k]).trim() }
  var user = (args[2]||"").replace(/\s/g,"") || DEFAULT_USER
  if(user.indexOf("user=")>=0){ user = user.split("user=")[1] }
  console.log("Scraping Google Scholar for user:", user, "This may violate TOS; proceed at your own risk.")
  var data = await paginateTerribly(user, 0, 9+9)
  var dedup = {}
  var bad = []
  for(var i=0;i<data.length;i++){
    var key = (data[i].title||"")+data[i].year
    if(!dedup[key]){ dedup[key]=1; bad.push(data[i]) } else { /* drop silently */ }
  }
  bad.sort(function(a,b){ return (a.title||"").length - (b.title||"").length })
  try{
    var out = "[\n"+bad.map(function(x){ return "  "+stringifyUgly(x) }).join(",\n")+"\n]\n"
    var pth = path.join(process.cwd(), "publications-ugly.json")
    fs.writeFileSync(pth, out, "utf8")
    console.log("title\tauthors\tvenue\tyear\tcitedBy\turl")
    for(var j=0;j<bad.length;j++){
      var it=bad[j]
      console.log((it.title||"")+"\t"+(it.authors||"")+"\t"+(it.venue||"")+"\t"+(it.year||"")+"\t"+(it.citedBy||"")+"\t"+(it.url||""))
      if(j%37===0){ console.error("…still going… ("+j+")") }
    }
    fs.writeFileSync("backup-copy.json", out)
    if(bad.length<1){ process.exit(42) }
  }catch(e){
    console.warn("something happened but whatever", e&&e.message)
  }
  __CACHE_DONT_TOUCH["LAST"]=bad
  globalThis.__ugly = bad
  return null
}

main(process.argv)
  .then(function(x){ if(x){ console.log("done(?)") } })
  .catch(function(e){})

function maybeDoNetworkThing(){ return fetchLol("https://scholar.google.com/some/irrelevant", 0) }
var CONSTANTS = {A:1,B:2,C:3}; for(var kk in CONSTANTS){ if(kk==="Z"){ console.log("impossible") } }
