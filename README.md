# WhatsAround 🧭📍

**WhatsAround** is a location-aware mobile application designed to help travellers discover and understand the places, landmarks, and natural features around them in real time.

Instead of simply showing users **where they are**, WhatsAround aims to answer a more interesting question:

> **"What am I looking at?"**

Whether you're travelling by road, exploring a new city, or looking out of an aeroplane window, WhatsAround uses your location and geographic data to surface nearby points of interest and provide useful context about what you're seeing.

---

## 🌍 Why This Project Exists

While travelling, it is easy to encounter incredible landscapes, lakes, mountains, escarpments, historic sites, and other landmarks without knowing what they are or where you are in relation to them.

This happened to me while travelling from **Luanda to Nairobi by air**. I could see different lakes, landscapes, and geological features from the aircraft, but I had no way of knowing what I was looking at. A similar problem occurred during road travel, where I passed numerous natural and cultural landmarks without knowing their names or significance.

WhatsAround was created to explore a simple idea:

> **What if your phone could tell you what you're seeing as you travel?**

The long-term vision is to turn ordinary journeys into interactive geographical experiences by helping users discover the world around them as they move through it.

---

## ✨ Key Features

* **📍 Location Awareness**
  Detects the user's current geographic location and updates as they move.

* **🗺️ Nearby Landmark Discovery**
  Finds points of interest near the user's current location using OpenStreetMap geographic data.

* **🔎 Smart Search Radius**
  Dynamically adjusts the search radius depending on whether the user is stationary or travelling.

* **🏔️ Category Filtering**
  Explore different types of places, including:

  * All
  * Tourism & Lodging
  * Historic
  * Natural Features

* **🧭 Direction & Distance**
  Provides approximate distance and compass direction to nearby features.

* **📖 Detailed Place Information**
  Allows users to explore information and OpenStreetMap tags associated with discovered locations.

* **🌍 Area Context**
  Provides broader information about the area the user is currently exploring.

---

## 🏗️ How It Works

At its core, WhatsAround follows a simple location-to-information pipeline:

```text
User Location
      ↓
GPS / Location Services
      ↓
Determine Search Area
      ↓
Query Geographic Data
      ↓
Find Nearby Features
      ↓
Calculate Distance & Direction
      ↓
Display Places to the User
```

The application currently uses **OpenStreetMap data** through the Overpass and Nominatim APIs.

The long-term system will expand this pipeline to incorporate additional geographic and contextual information.

---

## 🧭 Planned Experience

The MVP focuses on discovering places around the user.

The longer-term goal is to make the experience more proactive.

For example:

> ### 👀 LOOK LEFT
>
> **Lake Nakuru**
>
> 12 km away
> Direction: Southwest
>
> A major lake in Kenya's Great Rift Valley, known for its surrounding landscapes and wildlife.

Or while travelling by road:

> ### 🏔️ COMING UP
>
> **Menengai Crater**
>
> Approximately 10 minutes away.
>
> **Look ahead.**

Eventually, the project will explore a dedicated **Flight Mode** that could help passengers identify geographic features visible from an aircraft.

---

## 🛠️ Tech Stack

| Category                | Technology    |
| ----------------------- | ------------- |
| Framework               | React Native  |
| Development Platform    | Expo          |
| Language                | TypeScript    |
| Navigation              | Expo Router   |
| Location Services       | Expo Location |
| Geographic Data         | OpenStreetMap |
| Geospatial Queries      | Overpass API  |
| Reverse Geocoding       | Nominatim API |
| UI                      | React Native  |
| Development Environment | VS Code       |

### APIs

* **[OpenStreetMap](https://www.openstreetmap.org/)** — Geographic and points-of-interest data.
* **[Overpass API](https://overpass-api.de/)** — Queries OpenStreetMap geographic features.
* **[Nominatim](https://nominatim.openstreetmap.org/)** — Reverse geocoding and geographic context.

---

## 🧠 Technical Goals

One of the main purposes of WhatsAround is to explore the technical challenges involved in building a **location-aware geographic application**.

The project explores:

* GPS-based application development
* Geospatial data
* Spatial queries
* Distance calculations
* Direction/bearing calculations
* Real-time location updates
* Mobile sensor data
* Geographic information systems
* API integration
* Location-aware UI/UX
* Offline geographic data
* Context-aware recommendations

---

## 🚧 Project Status

**Currently in Development**

WhatsAround is currently being developed as an MVP.

### Completed

* ✅ Initial project concept
* ✅ Project setup
* ✅ React Native / Expo foundation
* ✅ TypeScript configuration
* ✅ Location services integration
* ✅ OpenStreetMap API research
* ✅ Nearby place discovery
* ✅ Category filtering
* ✅ Distance calculations
* ✅ Direction calculations
* ✅ Landmark detail views

### In Progress

* 🚧 Mobile UI/UX refinement
* 🚧 Map-based exploration
* 🚧 Improved location updates
* 🚧 Geographic data quality
* 🚧 Search-radius optimisation

### Planned

* ⬜ Interactive map
* ⬜ "Coming Up" landmarks
* ⬜ Compass-based viewing direction
* ⬜ Improved natural-feature detection
* ⬜ Offline support
* ⬜ Route-aware discovery
* ⬜ Audio descriptions
* ⬜ Camera-based landmark identification
* ⬜ Flight Mode
* ⬜ Terrain/elevation visibility calculations
* ⬜ AI-assisted explanations

---

## 📂 Project Structure

```text
WhatsAround/
│
├── app/
│   ├── landmark/
│   ├── ├── _layout.tsx
│   ├── ├── explore.tsx
│   │   └── index.tsx
│   ├── modal.tsx   
│   └── _layout.tsx
└── utils/
    ├── geo.ts
    └── overpass.ts

```

> **Note:** The project structure may evolve as development progresses.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/) — LTS version recommended
* npm
* [Expo Go](https://expo.dev/go) on an Android or iOS device
* VS Code or another preferred code editor

### Clone the Repository

```bash
git clone https://github.com/your-username/WhatsAround.git

cd WhatsAround
```

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npx expo start
```

You can then open the application using Expo Go or an Android/iOS emulator.

---

## 🗺️ Geographic Data

WhatsAround currently relies on open geographic data provided by **OpenStreetMap**.

The application uses:

* **Overpass API** for querying nearby geographic features and points of interest.
* **Nominatim** for reverse geocoding and geographic context.

Because OpenStreetMap is community-maintained, geographic coverage and the amount of information available can vary between locations.

---

## 🔮 Future Improvements

### Travel Discovery

* Route-aware landmark discovery
* "Coming Up" notifications
* Landmark visibility estimates
* Travel history
* Journey replay

### Navigation & Sensors

* Compass integration
* Device heading
* Improved bearing calculations
* Terrain and elevation analysis

### AI & Computer Vision

* Camera-based landmark identification
* Natural-language landmark explanations
* Image-assisted geographic identification
* Context-aware travel descriptions

### Flight Mode ✈️

* Flight route integration
* Aircraft position tracking
* Window-side awareness
* Geographic features visible from the aircraft
* "Look left / look right" prompts
* Estimated visibility based on terrain and altitude

### Offline Experience

* Offline maps
* Cached geographic data
* Downloadable regional exploration packs

---

## 🎯 Learning Objectives

This project is being developed to strengthen my understanding of:

* React Native development
* Expo
* TypeScript
* Mobile application architecture
* Geospatial programming
* Geographic information systems
* REST APIs
* GPS and mobile sensors
* Location-aware application design
* Map-based interfaces
* API data processing
* Software architecture
* Product development

It is also an opportunity to explore the intersection between **software development, geospatial technology, AI, and travel**.

---

## 📸 Screenshots

> Screenshots coming soon.

---

## 🛣️ Roadmap

```text
[✓] Project Concept
     ↓
[✓] Project Setup
     ↓
[✓] Location Services
     ↓
[✓] Nearby Landmark Discovery
     ↓
[✓] Distance & Direction
     ↓
[ ] Interactive Map
     ↓
[ ] "Coming Up" Experience
     ↓
[ ] Compass Integration
     ↓
[ ] Route-Aware Discovery
     ↓
[ ] Camera Identification
     ↓
[ ] Flight Mode ✈️
     ↓
[ ] AI-Assisted Geographic Guide
```

---

## 📄 License

This project is currently intended as a personal learning and portfolio project.

Geographic data is provided through OpenStreetMap and its associated services and is subject to their respective licensing and usage requirements.
