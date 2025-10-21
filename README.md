# Oussama Sghaier — Research Portfolio

This repository contains a lightweight, configuration-driven personal website tailored for research profiles. All content is now scattered across YAML files (plus one BibTeX file) so updates can be made without touching the layout or styles.

## Structure

```
├── index.html          # Base HTML shell
├── assets/
│   ├── styles.css      # Global styling
│   └── avatar.svg      # Placeholder avatar (replace with your own)
├── config/
│   ├── site.yml        # Basic profile, sections, and subtitles
│   ├── news.yml        # Simple list of news entries
│   ├── projects.yml    # Selected project blurbs with links
│   └── publications.bib# BibTeX snippets for highlighted work
└── scripts/
    └── main.js         # Populates the page from the configuration
```

## Editing Your Content

1. Update **`config/site.yml`** with your information. Everything is dumped into top-level keys: `name`, `tagline`, `about`, `affiliations`, `email`, `socialLinks`, `researchFocus`, `spotlight`, subtitles, `teaching`, and `timeline`.
2. Add or remove lines in **`config/news.yml`** to manage the timeline-style news feed (`date` + `detail`).
3. Add more entries to **`config/projects.yml`** for featured work. Each item accepts `name`, `summary`, and `links`.
4. Paste BibTeX records into **`config/publications.bib`**. The loader scrapes `title`, `author`, `journal`/`booktitle`, `year`, and `url` fields.
5. Optionally replace **`assets/avatar.svg`** with a personal photo and update the `avatar` path inside `config/site.yml`.

Changes to any YAML or BibTeX file are reflected immediately when you reload the page—no build step required, and no validation either.

## Running Locally

You can preview the site using any static file server. For example, with Python installed:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000> in your browser.

## Deployment

Because everything is static, you can deploy this site with GitHub Pages or any static hosting service. Copy the repository contents to your `gh-pages` branch or configure GitHub Pages to serve from the main branch's root.
