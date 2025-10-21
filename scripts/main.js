const configPath = 'config/site.json';

/**
 * Load and return the site configuration JSON from the configured path.
 *
 * @returns {Object} The parsed configuration object.
 * @throws {Error} If the HTTP response is not OK; error message includes the response status.
 */
async function loadConfig() {
  const response = await fetch(configPath);
  if (!response.ok) {
    throw new Error(`Unable to load configuration: ${response.status}`);
  }
  return response.json();
}

/**
 * Create an anchor element configured to open an external link in a new tab.
 * @param {string} label - Text content for the link.
 * @param {string} url - Destination URL for the link.
 * @returns {HTMLAnchorElement} An `<a>` element with its text set to `label`, `href` set to `url`, `target="_blank"`, and `rel="noopener noreferrer"`.
 */
function createLink(label, url) {
  const anchor = document.createElement('a');
  anchor.textContent = label;
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  return anchor;
}

/**
 * Populate the profile section of the page using the provided profile data.
 *
 * Updates DOM elements with IDs: `profile-avatar`, `profile-name`, `profile-tagline`,
 * `profile-location`, `profile-about`, `profile-affiliations`, and `profile-email`.
 * If `profile.avatar` is not provided, the avatar element is removed.
 *
 * @param {Object} profile - Profile data to render.
 * @param {string} [profile.avatar] - URL of the avatar image; if absent the avatar element is removed.
 * @param {string} profile.name - Display name.
 * @param {string} profile.tagline - Short tagline or subtitle.
 * @param {string} profile.location - Location text.
 * @param {string} profile.about - About/biography text.
 * @param {string[]} profile.affiliations - Array of affiliation strings to render as items.
 * @param {string} profile.email - Email address used for the mailto link and link text.
 */
function populateProfile(profile) {
  const avatar = document.getElementById('profile-avatar');
  if (profile.avatar) {
    avatar.src = profile.avatar;
  } else {
    avatar.remove();
  }
  document.getElementById('profile-name').textContent = profile.name;
  document.getElementById('profile-tagline').textContent = profile.tagline;
  document.getElementById('profile-location').textContent = profile.location;
  document.getElementById('profile-about').textContent = profile.about;
  const affiliationsContainer = document.getElementById('profile-affiliations');
  affiliationsContainer.innerHTML = '';
  profile.affiliations.forEach((affiliation) => {
    const item = document.createElement('span');
    item.textContent = affiliation;
    affiliationsContainer.appendChild(item);
  });
  const emailLink = document.getElementById('profile-email');
  emailLink.href = `mailto:${profile.email}`;
  emailLink.textContent = profile.email;
}

/**
 * Populate the social-links container with anchor elements for each provided link.
 *
 * Clears the container with id "social-links" then appends a pill-styled anchor for each link.
 * @param {Array<{label: string, url: string}>} links - Array of objects where `label` is the link text and `url` is the destination URL.
 */
function populateSocialLinks(links) {
  const container = document.getElementById('social-links');
  container.innerHTML = '';
  links.forEach((link) => {
    const anchor = createLink(link.label, link.url);
    anchor.classList.add('pill');
    container.appendChild(anchor);
  });
}

/**
 * Render research focus areas into the #research-focus-list container as cards.
 * 
 * Clears any existing content in the container and appends one card per focus area,
 * each containing a title and description.
 * 
 * @param {Array<{title: string, description: string}>} focusAreas - Array of focus area objects; each object must have a `title` and a `description` string.
 */
function populateResearchFocus(focusAreas) {
  const container = document.getElementById('research-focus-list');
  container.innerHTML = '';
  focusAreas.forEach((area) => {
    const card = document.createElement('article');
    card.classList.add('card');
    card.innerHTML = `
      <h3>${area.title}</h3>
      <p>${area.description}</p>
    `;
    container.appendChild(card);
  });
}

/**
 * Populate the spotlight section of the page with a title and description.
 *
 * If `spotlight` is falsy, the function leaves the spotlight section unchanged.
 *
 * @param {{title: string, description: string}|null|undefined} spotlight - Object containing `title` and `description` to render in the spotlight area.
 */
function populateSpotlight(spotlight) {
  if (!spotlight) return;
  const container = document.getElementById('spotlight');
  container.innerHTML = `
    <h2>${spotlight.title}</h2>
    <p>${spotlight.description}</p>
  `;
}

/**
 * Render a list of news items into the page's news list container.
 * @param {Array<{date: string, detail: string}>} news - Array of news objects; each object should have a `date` string and a `detail` string to display.
 */
function populateNews(news) {
  const container = document.getElementById('news-list');
  container.innerHTML = '';
  news.forEach((item) => {
    const entry = document.createElement('div');
    entry.classList.add('timeline-entry');
    entry.innerHTML = `
      <span class="timeline-date">${item.date}</span>
      <p>${item.detail}</p>
    `;
    container.appendChild(entry);
  });
}

/**
 * Populate the #projects-list element with project cards containing title, summary, and link pills.
 * @param {Array<{name: string, summary: string, links: Array<{label: string, url: string}>}>} projects - Array of project objects to render. Each project must include a `name`, `summary`, and a `links` array of `{label, url}` entries.
 */
function populateProjects(projects) {
  const container = document.getElementById('projects-list');
  container.innerHTML = '';
  projects.forEach((project) => {
    const card = document.createElement('article');
    card.classList.add('card');
    const links = project.links
      .map((link) => `<a class="pill" href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`)
      .join('');
    card.innerHTML = `
      <h3>${project.name}</h3>
      <p>${project.summary}</p>
      <div class="pill-group">${links}</div>
    `;
    container.appendChild(card);
  });
}

/**
 * Populate the publications list in the DOM from an array of publication objects.
 *
 * Replaces the contents of the element with id "publications-list" with article entries for each publication.
 * Each publication object should include title, authors, venue, year, and links; links are rendered as pill anchors.
 *
 * @param {Array<Object>} publications - Array of publication objects.
 * @param {string} publications[].title - Publication title.
 * @param {string[]} publications[].authors - Array of author names.
 * @param {string} publications[].venue - Venue or journal name.
 * @param {number|string} publications[].year - Publication year.
 * @param {Array<Object>} publications[].links - Array of link objects for the publication.
 * @param {string} publications[].links[].label - Link label text.
 * @param {string} publications[].links[].url - Link URL.
 */
function populatePublications(publications) {
  const container = document.getElementById('publications-list');
  container.innerHTML = '';
  publications.forEach((publication) => {
    const item = document.createElement('article');
    item.classList.add('stack-item');
    const authors = publication.authors.join(', ');
    const links = publication.links
      .map((link) => `<a class="pill" href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`)
      .join('');
    item.innerHTML = `
      <h3>${publication.title}</h3>
      <p class="muted">${authors}</p>
      <p>${publication.venue} &middot; ${publication.year}</p>
      <div class="pill-group">${links}</div>
    `;
    container.appendChild(item);
  });
}

/**
 * Populate the teaching list section with entries for each teaching record.
 * 
 * @param {Array<Object>} teaching - Array of teaching records to render. Each record should include:
 *   - course: The course name or title.
 *   - role: The role held (e.g., "Instructor", "TA").
 *   - institution: The institution where the course was taught.
 *   - year: The year (or year range) the course was taught.
 */
function populateTeaching(teaching) {
  const container = document.getElementById('teaching-list');
  container.innerHTML = '';
  teaching.forEach((item) => {
    const entry = document.createElement('article');
    entry.classList.add('stack-item');
    entry.innerHTML = `
      <h3>${item.course}</h3>
      <p class="muted">${item.role} &middot; ${item.institution} &middot; ${item.year}</p>
    `;
    container.appendChild(entry);
  });
}

/**
 * Render a list of timeline entries into the element with id "timeline-list".
 *
 * Clears any existing content in the timeline list and appends a DOM entry for each item.
 *
 * @param {Array<Object>} entries - Array of timeline entry objects.
 *   Each object should have:
 *     - {string} period - The date or period to display.
 *     - {string} role - The role or title to display.
 *     - {string} organization - The organization name to display (rendered muted).
 */
function populateTimeline(entries) {
  const container = document.getElementById('timeline-list');
  container.innerHTML = '';
  entries.forEach((entry) => {
    const item = document.createElement('div');
    item.classList.add('timeline-entry');
    item.innerHTML = `
      <span class="timeline-date">${entry.period}</span>
      <p>${entry.role}<br /><span class="muted">${entry.organization}</span></p>
    `;
    container.appendChild(item);
  });
}

/**
 * Update the element with id "footer-year" to show the current calendar year.
 *
 * Locates the DOM element with id "footer-year" and sets its text content to the current year.
 */
function setFooterYear() {
  const footerYear = document.getElementById('footer-year');
  footerYear.textContent = new Date().getFullYear();
}

/**
 * Initialize the page by loading site configuration and populating all UI sections.
 *
 * Loads the site configuration and invokes the various population helpers (profile, social links,
 * research focus, spotlight, news, projects, publications, teaching, timeline) and sets the footer year.
 * On failure to load configuration, logs the error and replaces the main content with a generic error message.
 */
async function bootstrap() {
  try {
    const config = await loadConfig();
    populateProfile(config.profile);
    populateSocialLinks(config.socialLinks || []);
    populateResearchFocus(config.researchFocus || []);
    populateSpotlight(config.spotlight);
    populateNews(config.news || []);
    populateProjects(config.projects || []);
    populatePublications(config.publications || []);
    populateTeaching(config.teaching || []);
    populateTimeline(config.timeline || []);
    setFooterYear();
  } catch (error) {
    console.error(error);
    const main = document.querySelector('main');
    main.innerHTML = '<p class="error">Unable to load site content. Please try again later.</p>';
  }
}

document.addEventListener('DOMContentLoaded', bootstrap);