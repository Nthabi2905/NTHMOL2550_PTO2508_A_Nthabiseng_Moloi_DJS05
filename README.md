# DJS05: Show Detail Page with Routing and Navigation

## Overview

A React podcast browsing app with a searchable homepage and dynamic show detail pages. Users can filter and paginate podcasts on the listing page, open any show at a unique URL, browse seasons and episodes, and return to the homepage with their previous search and filter state preserved.

## Running Locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

To create a production build:

```bash
npm run build
npm run preview
```

## Main Features

- **Homepage listing** with live search, genre filters, sorting, and pagination
- **Dynamic routing** via `/show/:id` for individual podcast detail pages
- **Show detail view** with title, image, description, genre tags, and formatted last-updated date
- **Loading, error, and empty states** for both listing and detail data fetching
- **Season navigation** with expand/collapse panels, episode counts, and episode cards
- **State preservation** — search, filters, sort, and page are stored in URL query parameters so they persist when navigating back from a detail page
- **Responsive layout** for mobile, tablet, and desktop

## Known Limitations

- Genre tags on the detail page come from the show API response (string labels) rather than the local genre ID mapping used on the homepage
- Episode audio files are placeholders provided by the API and are not played in the UI
- Shows with many seasons require expanding each season manually; only one season is expanded at a time

## Technologies

- React 19
- React Router DOM
- Vite
- Fetch API

## Project Structure

```bash
src/
├── components/       # Reusable UI (cards, filters, season navigation)
├── context/          # Shared browse state with URL sync
├── data/             # Genre ID → title mapping
├── hooks/            # useShow data-fetching hook
├── pages/            # HomePage and ShowDetailPage routes
├── services/         # API helpers
└── utils/            # Filtering, formatting, truncation helpers
```

## API Endpoints

| URL | Returns |
| --- | --- |
| `https://podcast-api.netlify.app` | Array of podcast previews |
| `https://podcast-api.netlify.app/genre/<ID>` | Genre object |
| `https://podcast-api.netlify.app/id/<ID>` | Full show with seasons and episodes |

### Genre Titles

| ID | Title |
| --- | --- |
| 1 | Personal Growth |
| 2 | Investigative Journalism |
| 3 | History |
| 4 | Comedy |
| 5 | Entertainment |
| 6 | Business |
| 7 | Fiction |
| 8 | News |
| 9 | Kids and Family |

---

## Assignment Brief

This project builds a podcast show detail page as part of a larger podcast browsing app. When users select a show from the homepage, they are taken to a dedicated page that displays all details about that show with dynamic routing so each show has its own unique URL.

Core objectives include dynamic routing, data fetching by show ID, loading/error/empty states, comprehensive show details, filter state preservation, season navigation, episode display, JSDoc documentation, and responsive design.

![Show page reference](<Show Page Podcast.png>)
