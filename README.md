# Skyline Weather

A lightweight weather dashboard built with Vite, TypeScript, and vanilla HTML/CSS. Search for a city to view current conditions, the next 24 hours, and a seven-day forecast.

## Features

- City search with loading and empty states
- Current temperature, humidity, feels-like temperature, wind, and day/night status
- Hourly forecast for the next 24 hours
- Seven-day forecast with temperature and precipitation details
- Responsive layout for desktop and mobile screens
- Weather data provided by [Open-Meteo](https://open-meteo.com/)

## Requirements

- Node.js 22 or newer
- npm

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## Available Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |

## API Integration

The application uses two Open-Meteo endpoints:

1. The geocoding API finds a city's coordinates and timezone.
2. The forecast API uses those values to retrieve current, hourly, and daily weather data.

API request and response validation is kept in [`src/api/openMeteo.ts`](src/api/openMeteo.ts), separate from the UI logic.

## GitHub Pages Deployment

The project is configured for the repository deployment path `/weather-forecast-p/` in [`vite.config.ts`](vite.config.ts).

Deployment is handled by [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) whenever changes are pushed to `main`. It can also be started manually from the **Actions** tab.

To enable the deployment in GitHub:

1. Open the repository's **Settings**.
2. Go to **Pages**.
3. Set the source to **GitHub Actions**.

The deployed application is available at:

<https://rodrigogendo.github.io/weather-forecast-p/>

## Project Structure

```text
src/
  api/openMeteo.ts  Open-Meteo requests and data validation
  main.ts           Application markup, state, and rendering
  style.css         Responsive visual styles
  types.ts          Shared TypeScript types
```
