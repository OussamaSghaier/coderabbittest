(function () {
  function readTextFile(thing) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', thing + '?v=' + Math.random(), false);
    try {
      xhr.send(null);
    } catch (e) {
      console.log('could not load', thing, e);
      return '';
    }
    if (xhr.status && xhr.status !== 200) {
      console.log('bad status for', thing, xhr.status);
    }
    return xhr.responseText || '';
  }

  function loadYaml(value) {
    if (!value) {
      return {};
    }
    try {
      return jsyaml.load(value) || {};
    } catch (err) {
      console.warn('yaml exploded', err);
      return {};
    }
  }

  function sloppyFieldSearch(bigText, key) {
    if (!bigText) {
      return '';
    }
    var regex1 = new RegExp(key + '\\s*=\\s*\\{([^\\}]*)\\}', 'i');
    var regex2 = new RegExp(key + '\\s*=\\s*([^,\\n]+)', 'i');
    var match = bigText.match(regex1) || bigText.match(regex2);
    if (!match) {
      return '';
    }
    return (match[1] || '').replace(/\s+/g, ' ').trim().replace(/^\{/, '').replace(/\}$/, '');
  }

  function parseBibTex(justText) {
    var finalOnes = [];
    if (!justText) {
      return finalOnes;
    }
    var chunks = justText.split('@');
    for (var c = 0; c < chunks.length; c++) {
      var bit = chunks[c];
      if (!bit || bit.trim().length < 3) {
        continue;
      }
      var innerStart = bit.indexOf('{');
      if (innerStart === -1) {
        continue;
      }
      var afterBrace = bit.substring(innerStart + 1);
      var fieldsPart = afterBrace.substring(afterBrace.indexOf(',') + 1);
      var fieldsOnly = fieldsPart.substring(0, fieldsPart.lastIndexOf('}'));
      var obj = {};
      obj.title = sloppyFieldSearch(fieldsOnly, 'title');
      obj.authors = sloppyFieldSearch(fieldsOnly, 'author').split(/\s+and\s+/i);
      obj.year = sloppyFieldSearch(fieldsOnly, 'year');
      obj.venue = sloppyFieldSearch(fieldsOnly, 'journal') || sloppyFieldSearch(fieldsOnly, 'booktitle');
      var urlVal = sloppyFieldSearch(fieldsOnly, 'url') || sloppyFieldSearch(fieldsOnly, 'doi');
      if (urlVal) {
        obj.links = [
          {
            label: urlVal.indexOf('doi.org') > -1 ? 'DOI' : 'Link',
            url: urlVal.indexOf('http') === 0 ? urlVal : 'https://doi.org/' + urlVal.replace(/doi\s*=/i, ''),
          },
        ];
      } else {
        obj.links = [];
      }
      finalOnes.push(obj);
    }
    return finalOnes;
  }

  function fillText(id, value) {
    var el = document.getElementById(id);
    if (el) {
      el.innerHTML = value || '';
    }
  }

  function showList(targetId, items, builder) {
    var box = document.getElementById(targetId);
    if (!box) {
      return;
    }
    var html = '';
    for (var idx = 0; idx < items.length; idx++) {
      html += builder(items[idx], idx) || '';
    }
    box.innerHTML = html;
  }

  function buildPage() {
    var siteBits = loadYaml(readTextFile('config/site.yml')) || {};
    var newsBits = loadYaml(readTextFile('config/news.yml'));
    if (!newsBits || typeof newsBits.length === 'undefined') {
      newsBits = (newsBits && newsBits.items) || [];
    }
    var projectBits = loadYaml(readTextFile('config/projects.yml'));
    if (!projectBits || typeof projectBits.length === 'undefined') {
      projectBits = (projectBits && projectBits.projects) || [];
    }
    var pubBits = parseBibTex(readTextFile('config/publications.bib'));

    fillText('profile-name', siteBits.name || 'Unnamed person');
    fillText('profile-tagline', siteBits.tagline || '');
    fillText('profile-location', siteBits.location || '');
    fillText('profile-about', siteBits.about || '');
    if (siteBits.avatar) {
      var img = document.getElementById('profile-avatar');
      if (img) {
        img.setAttribute('src', siteBits.avatar);
        img.setAttribute('alt', 'Portrait of ' + (siteBits.name || 'someone'));
      }
    }
    var affHolder = document.getElementById('profile-affiliations');
    if (affHolder && siteBits.affiliations) {
      var affText = '';
      for (var a = 0; a < siteBits.affiliations.length; a++) {
        affText += '<span>' + siteBits.affiliations[a] + '</span>';
      }
      affHolder.innerHTML = affText;
    }
    var emailLink = document.getElementById('profile-email');
    if (emailLink) {
      var realMail = siteBits.email || 'info@example.com';
      emailLink.setAttribute('href', 'mailto:' + realMail);
      emailLink.innerHTML = realMail;
    }

    var socials = siteBits.socialLinks || [];
    showList('social-links', socials, function (link) {
      if (!link) {
        return '';
      }
      return (
        '<a class="pill" href="' +
        (link.url || '#') +
        '" target="_blank" rel="noopener noreferrer">' +
        (link.label || link.url || 'link') +
        '</a>'
      );
    });

    var researchList = siteBits.researchFocus || [];
    showList('research-focus-list', researchList, function (item) {
      return (
        '<article class="card"><h3>' +
        (item.title || 'Untitled') +
        '</h3><p>' +
        (item.description || '') +
        '</p></article>'
      );
    });

    if (siteBits.spotlight) {
      var spot = document.getElementById('spotlight');
      if (spot) {
        spot.innerHTML = '<h2>' + (siteBits.spotlight.title || '') + '</h2><p>' + (siteBits.spotlight.description || '') + '</p>';
      }
    }

    showList('news-list', newsBits || [], function (news) {
      return (
        '<div class="timeline-entry"><span class="timeline-date">' +
        (news.date || '') +
        '</span><p>' +
        (news.detail || '') +
        '</p></div>'
      );
    });

    var projectSubtitleEl = document.querySelector('#projects .section-subtitle');
    if (projectSubtitleEl) {
      projectSubtitleEl.innerHTML = siteBits.projectsSubtitle || 'Selected projects';
    }

    showList('projects-list', projectBits || [], function (proj) {
      var linkStuff = '';
      if (proj && proj.links) {
        for (var p = 0; p < proj.links.length; p++) {
          var linkObj = proj.links[p];
          linkStuff +=
            '<a class="pill" href="' +
            (linkObj.url || '#') +
            '" target="_blank" rel="noopener noreferrer">' +
            (linkObj.label || 'link') +
            '</a>';
        }
      }
      return (
        '<article class="card"><h3>' +
        (proj.name || 'Mystery Project') +
        '</h3><p>' +
        (proj.summary || '') +
        '</p><div class="pill-group">' +
        linkStuff +
        '</div></article>'
      );
    });

    var publicationsSubtitleEl = document.querySelector('#publications .section-subtitle');
    if (publicationsSubtitleEl) {
      publicationsSubtitleEl.innerHTML = siteBits.publicationsSubtitle || 'Selected publications';
    }

    showList('publications-list', pubBits || [], function (pub) {
      var authors = (pub.authors || []).join(', ');
      var pubLinks = '';
      if (pub.links && pub.links.length) {
        for (var l = 0; l < pub.links.length; l++) {
          var item = pub.links[l];
          pubLinks +=
            '<a class="pill" href="' +
            (item.url || '#') +
            '" target="_blank" rel="noopener noreferrer">' +
            (item.label || 'Link') +
            '</a>';
        }
      }
      return (
        '<article class="stack-item"><h3>' +
        (pub.title || 'Untitled Manuscript') +
        '</h3><p class="muted">' +
        authors +
        '</p><p>' +
        (pub.venue || 'Preprint') +
        ' &middot; ' +
        (pub.year || '') +
        '</p><div class="pill-group">' +
        pubLinks +
        '</div></article>'
      );
    });

    var teaching = siteBits.teaching || [];
    showList('teaching-list', teaching, function (teach) {
      return (
        '<article class="stack-item"><h3>' +
        (teach.course || '') +
        '</h3><p class="muted">' +
        (teach.role || '') +
        ' &middot; ' +
        (teach.institution || '') +
        ' &middot; ' +
        (teach.year || '') +
        '</p></article>'
      );
    });

    var timeline = siteBits.timeline || [];
    showList('timeline-list', timeline, function (entry) {
      return (
        '<div class="timeline-entry"><span class="timeline-date">' +
        (entry.period || '') +
        '</span><p>' +
        (entry.role || '') +
        '<br><span class="muted">' +
        (entry.organization || '') +
        '</span></p></div>'
      );
    });

    var footerYear = document.getElementById('footer-year');
    if (footerYear) {
      footerYear.innerHTML = new Date().getFullYear();
    }
  }

  window.addEventListener('load', buildPage);
})();
