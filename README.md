# 🧭 Vista Voyager
### Voyager Intelligence System for Travel Assistance

Vista Voyager is a full-stack, AI-assisted travel planning platform focused on Indian tourist destinations. It combines a destination explorer, personalized recommendations, an AI day-wise itinerary generator, a budget planner, live weather, interactive maps, reviews/ratings, and a full admin dashboard — built end-to-end with the MERN-style stack (MongoDB, Express, React, Node.js).

---

## ✨ Features

| Category | Features |
|---|---|
| **Discovery** | Destination explorer, full-text search, category/state/budget/rating filters, sorting, pagination |
| **Personalization** | Preference-based recommendation engine, similar-destination suggestions, wishlist |
| **AI Tools** | Rule-based AI chatbot ("Voya"), AI day-wise itinerary generator, budget/expense estimator |
| **Trip Management** | Trip creation, status tracking, budget breakdown, itinerary linking |
| **Community** | Reviews & star ratings per destination, auto-recalculated aggregate ratings |
| **Live Data** | Real-time weather + 7-day forecast (Open-Meteo, no API key needed), interactive Leaflet maps |
| **Accounts** | JWT authentication, bcrypt password hashing, profile management, travel-style preferences |
| **Admin** | Destination CRUD, user management (roles/activation), analytics dashboard with charts |
| **UX** | Dark/light mode, Framer Motion animations, skeleton loaders, toast notifications, fully responsive |
| **Security** | Helmet, CORS, rate limiting, Mongo sanitization, XSS cleaning, input validation |

---

## 🏗️ Tech Stack

**Frontend:** React 18, React Router 6, Tailwind CSS, Framer Motion, Axios, React Leaflet, Recharts, React Hot Toast, React Icons, Vite

**Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT, bcryptjs, express-validator, Helmet, express-rate-limit

**AI / Intelligence layer (no paid API key required):**
- `recommendationService.js` — rule-based scoring engine for personalized picks
- `itineraryService.js` — day-wise itinerary generator
- `budgetService.js` — category-wise expense estimator
- `aiChatService.js` — intent-detection chatbot ("Voya")
- `weatherService.js` — live weather via the free Open-Meteo API

> These services are structured so you can later swap in a real LLM (OpenAI, Anthropic, etc.) by editing `aiChatService.js` / `recommendationService.js` — the rest of the app (routes, controllers, frontend) doesn't need to change.

---

## 📁 Project Structure

```
VISTA-VOYAGER/
├── client/                      # React frontend (Vite)
│   ├── src/
│   │   ├── components/          # Navbar, Footer, Chatbot, DestinationCard, MapView, etc.
│   │   ├── pages/                # Landing, Explore, DestinationDetail, Dashboard, TripPlanner...
│   │   │   └── admin/             # Admin panel pages
│   │   ├── context/              # AuthContext, ThemeContext
│   │   ├── services/              # Axios API modules (one per resource)
│   │   ├── hooks/                 # useDebounce
│   │   └── utils/                 # formatters
│   └── package.json
│
├── server/                      # Express backend
│   ├── controllers/              # Route handler logic
│   ├── models/                   # Mongoose schemas
│   ├── routes/                   # Express routers
│   ├── middleware/               # auth, error handling, validation, rate limiting
│   ├── services/                 # AI / recommendation / itinerary / budget / weather engines
│   ├── config/                   # DB connection
│   ├── seed/                     # Seed data + seed script (14 Indian destinations + admin user)
│   └── server.js
│
├── README.md
└── SETUP_GUIDE.md
```

---

## 🔑 Default Accounts (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@vistavoyager.com` | `` |
| User | *(create your own via Sign Up)* | — |

---

## 📡 API Overview

All endpoints are prefixed with `/api`.

| Resource | Routes |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Users | `PUT /users/profile`, `GET /users/dashboard` |
| Destinations | `GET /destinations`, `GET /destinations/:slug`, `GET /destinations/featured/top`, `GET /destinations/meta/filters`, `GET /destinations/recommendations/for-you`, `POST/PUT/DELETE /destinations` (admin) |
| Wishlist | `GET /wishlist`, `POST /wishlist/:destinationId`, `DELETE /wishlist/:destinationId` |
| Reviews | `GET /reviews/destination/:id`, `POST /reviews/destination/:id`, `PUT/DELETE /reviews/:id` |
| Itineraries | `POST /itineraries/generate`, `GET /itineraries`, `GET/PUT/DELETE /itineraries/:id` |
| Trips | `POST /trips`, `GET /trips`, `GET/PUT/DELETE /trips/:id`, `POST /trips/estimate-budget` |
| Chatbot | `POST /chatbot/message` |
| Weather | `GET /weather/:slug` |
| Admin | `GET /admin/analytics`, `GET /admin/users`, `PUT/DELETE /admin/users/:id`, `GET /admin/destinations` |

See `SETUP_GUIDE.md` for how to run and test all of this locally.

---

## 🚀 Quick Start

```bash
# 1. Backend
cd server
npm install
cp .env.example .env      # then edit .env with your MongoDB URI + JWT secret
npm run seed               # seeds 14 Indian destinations + admin account
npm run dev                 # runs on http://localhost:5000

# 2. Frontend (in a new terminal)
cd client
npm install
cp .env.example .env
npm run dev                 # runs on http://localhost:5173
```

Full details, troubleshooting, and deployment instructions are in **SETUP_GUIDE.md**.

---

## 📌 Notes for Evaluators / Final-Year Submission

- The "AI" features are fully functional, deterministic, rule-based engines — they run entirely offline with **no external paid API key required**, so the project works out-of-the-box for a demo or viva. The code is structured so a real LLM call could be dropped in later without touching the rest of the app.
- Weather uses the free, keyless **Open-Meteo** API.
- Maps use **Leaflet + OpenStreetMap** tiles (no Google Maps key needed).
- All 30 requested features are implemented (see the feature table above).

---

## 🖼️ Screenshots

Add your screenshots in `docs/screenshots/` and reference them here, for example:

```
![Landing](docs/screenshots/landing.png)
```

## 🛠️ Handy Root Scripts

```bash
npm run install:all   # installs server + client dependencies
npm run seed          # seeds destinations + admin user
npm run dev:server    # starts backend on :5000
npm run dev:client    # starts frontend on :5173
```

## 👤 Author

**Ayush Chaurasiya** — B.Tech (AI & Data Science), AKS University, Satna

## 📄 License

Released under the [MIT License](LICENSE).
