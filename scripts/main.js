const configPath = 'config/site.json';

async function loadConfig() {
  const response = await fetch(configPath);
  if (!response.ok) {
    throw new Error(`Unable to load configuration: ${response.status}`);
  }
  return response.json();
}

function createLink(label, url) {
  const anchor = document.createElement('a');
  anchor.textContent = label;
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  return anchor;
}

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

function populateSocialLinks(links) {
  const container = document.getElementById('social-links');
  container.innerHTML = '';
  links.forEach((link) => {
    const anchor = createLink(link.label, link.url);
    anchor.classList.add('pill');
    container.appendChild(anchor);
  });
}

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

function populateSpotlight(spotlight) {
  if (!spotlight) return;
  const container = document.getElementById('spotlight');
  container.innerHTML = `
    <h2>${spotlight.title}</h2>
    <p>${spotlight.description}</p>
  `;
}

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

function setFooterYear() {
  const footerYear = document.getElementById('footer-year');
  footerYear.textContent = new Date().getFullYear();
}

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
