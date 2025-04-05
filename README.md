# 🚌 Öffi-Routenplaner

A Vue 3 application for planning public transport routes in Austria. Calculate transit times between multiple addresses using Google Maps APIs.

## ✨ Features

- 🔍 Address autocomplete with Google Places API
- 🕖 Public transport time calculation between multiple points
- 🗺️ Showcase of selected points on a map
- 🎯 Optimized for Vienna's public transport system

## 🛠️ Tech Stack

- [Vue 3](https://vuejs.org/) - The Progressive JavaScript Framework
- [TailwindCSS](https://tailwindcss.com/) - The Frontend UI Framework
- [Google Maps Platform](https://developers.google.com/maps) - Places API & Distance Matrix API

## 🚀 Getting Started

### Prerequisites

- Bun package manager
- Google Maps API key
- Public Transport Planner API ([GitHub](https://github.com/kihayu/Public-Transport-Planner-API))

### Installation

1. Clone the repository

```bash
git clone git@github.com:kihayu/at-public-transport-routenplaner.git
cd at-public-transport-routenplaner
```

2. Install dependencies

```bash
bun install --frozen-lockfile
```

3. Create a `.env` file in the root directory and add your Google Maps API key:

```env
VITE_TRANSPORT_PLANNER_BASE_URL=host_of_api

default: http://localhost:5279
```

### Development

Start the development server

```bash
bun run dev
```

The application will be available at `http://localhost:5173`

### Preview

Start the preview server

```bash
bun run preview
```

The application will be available at `http://localhost:4173`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
