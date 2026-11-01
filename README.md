# Taskflow Dashboard

A responsive task-management dashboard built with React and Parcel. It includes a workspace overview, task summaries, task filters and search, due-date sorting, and a form for adding tasks.

## Requirements

- Node.js
- npm

## Getting started

From the project directory, install dependencies and start the development server:

```bash
npm install
npm start
```

Parcel prints the local URL in the terminal. Open that URL in your browser.

## Build

Create a production build in `dist/`:

```bash
npm run build
```

## Project structure

- `index.html` — HTML entry point
- `src/main.jsx` — React entry point
- `src/App.jsx` — dashboard layout and task state
- `src/components/` — dashboard UI components
- `src/utils/dates.js` — date formatting and date helpers
- `src/styles.css` — application styles

Tasks are sample data stored in the browser app's in-memory state. Changes made during a session are not saved to a backend or retained after reloading the page.
