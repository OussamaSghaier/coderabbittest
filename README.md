# Oussama Sghaier — Research Portfolio

This repository contains a lightweight, configuration-driven personal website tailored for research profiles. All content is defined in JSON files so updates can be made without touching the layout or styles.

## Structure

```
├── index.html          # Base HTML shell
├── assets/
│   ├── styles.css      # Global styling
│   └── avatar.svg      # Placeholder avatar (replace with your own)
├── config/
│   └── site.json       # Central content configuration
└── scripts/
    └── main.js         # Populates the page from the configuration
```

## Editing Your Content

1. Update **`config/site.json`** with your information:
   - `profile`: name, tagline, contact details, affiliations, and bio text.
   - `socialLinks`: external profiles (Google Scholar, GitHub, etc.).
   - `researchFocus`, `projects`, `publications`, `teaching`, and `timeline`: arrays describing each section.
   - `spotlight` and `news`: highlight current achievements and announcements.
2. Optionally replace **`assets/avatar.svg`** with a personal photo and update the `profile.avatar` path.

Changes to `site.json` are reflected immediately when you reload the page—no build step required.

## Running Locally

You can preview the site using any static file server. For example, with Python installed:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000> in your browser.

## Deployment

Because everything is static, you can deploy this site with GitHub Pages or any static hosting service. Copy the repository contents to your `gh-pages` branch or configure GitHub Pages to serve from the main branch's root.
