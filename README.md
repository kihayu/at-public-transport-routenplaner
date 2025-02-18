# 🚌 Öffi-Routenplaner

A Vue 3 application for planning public transport routes in Austria. Calculate transit times between multiple addresses using Google Maps APIs.

## ✨ Features

- 🔍 Address autocomplete with Google Places API
- 🗺️ Public transport time calculation between multiple points
- 🎯 Optimized for Vienna's public transport system

## 🚀 Getting Started

### Prerequisites

- Bun package manager
- Google Maps API key

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd multipoint-navigation-planner
```

2. Install dependencies

```bash
bun install --frozen-lockfile
```

3. Create a `.env` file in the root directory and add your Google Maps API key:

```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

4. Start the development server

```bash
bun run start
```

The application will be available at `http://localhost:5173`

## 🛠️ Built With

- [Vue 3](https://vuejs.org/) - The Progressive JavaScript Framework
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Google Maps Platform](https://developers.google.com/maps) - Places API & Distance Matrix API

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
