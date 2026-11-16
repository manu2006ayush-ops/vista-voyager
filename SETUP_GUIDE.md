# 🛠️ Vista Voyager — Setup Guide

This guide walks through installing, configuring, running, and deploying the full project from scratch.

---

## 1. Prerequisites

Install these before you start:

| Tool | Version | Check with |
|---|---|---|
| Node.js | 18.x or higher | `node -v` |
| npm | 9.x or higher | `npm -v` |
| MongoDB | Local install OR a free MongoDB Atlas cluster | `mongod --version` (if local) |
| Git (optional) | any | `git --version` |

You do **not** need any paid API keys. Weather and the AI features work out of the box.

---

## 2. Get MongoDB Running

**Option A — Local MongoDB**
```bash
# macOS (Homebrew)
brew tap mongodb/brew && brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install -y mongodb
sudo systemctl start mongodb

# Windows
# Download & install from https://www.mongodb.com/try/download/community
# then start the "MongoDB" service from Services.msc
```
Your local connection string will be: `mongodb://127.0.0.1:27017/vista_voyager`

**Option B — MongoDB Atlas (free cloud tier, recommended for deployment)**
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user (username/password)
3. Whitelist your IP (or `0.0.0.0/0` for development)
4. Copy the connection string — it looks like:
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/vista_voyager`

---

## 3. Backend Setup (`server/`)

```bash
cd server
npm install
```

Copy the example environment file and fill it in:
```bash
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/vista_voyager
JWT_SECRET=replace_with_a_long_random_string_at_least_32_chars
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
AI_PROVIDER_API_KEY=
```

> Generate a strong `JWT_SECRET` quickly with:
> `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

**Seed the database** (14 real Indian destinations + a default admin account):
```bash
npm run seed
```
You should see:
```
Seeded 14 destinations.
Created default admin user: admin@vistavoyager.com / Admin@123
```

**Run the backend:**
```bash
npm run dev      # nodemon, auto-restarts on file changes
# or
npm start        # plain node, for production
```

The API will be live at **http://localhost:5000/api**. Verify with:
```bash
curl http://localhost:5000/api/health
```

---

## 4. Frontend Setup (`client/`)

Open a **new terminal** (keep the backend running):

```bash
cd client
npm install
cp .env.example .env
```

Edit `client/.env` if your backend runs on a different host/port:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**Run the frontend:**
```bash
npm run dev
```

The app will be live at **http://localhost:5173**. Vite is already configured (`vite.config.js`) to proxy `/api` requests to `http://localhost:5000` during development, so the app works even if you don't set `VITE_API_BASE_URL`.

---

## 5. First-Time Walkthrough

1. Open http://localhost:5173 — you should see the Vista Voyager landing page with trending destinations.
2. Click **Sign up** and create a regular user account, OR log in as admin:
   - Email: `admin@vistavoyager.com`
   - Password: `Admin@123`
3. Go to **Explore** to search/filter the 14 seeded destinations.
4. Open any destination to see live weather, an interactive map, reviews, and similar destinations.
5. Go to **AI Trip Planner**, pick a destination, set duration/budget/trip type, and click **Generate AI Itinerary**.
6. Click the floating chat bubble (bottom-right) to talk to **Voya**, the AI assistant.
7. If logged in as admin, open **Admin Panel** from the profile menu to manage destinations/users and view analytics charts.

---

## 6. Common Issues & Fixes

| Problem | Fix |
|---|---|
| `MongoServerError: connect ECONNREFUSED` | MongoDB isn't running — start it locally or check your Atlas connection string/IP whitelist |
| `401 Unauthorized` on every request after login | Your `JWT_SECRET` may have changed after tokens were issued — log out and log in again |
| CORS errors in browser console | Make sure `CLIENT_URL` in `server/.env` exactly matches the URL the frontend runs on |
| Weather widget shows "unavailable" | Open-Meteo may be rate-limited or you have no internet access in your dev environment — this doesn't require a key, just outbound internet |
| Map doesn't render | Leaflet needs its CSS imported — this is already wired in `src/index.css`; if you still see issues, hard-refresh the browser |
| `npm install` fails on `xss-clean` / older packages | Use Node 18+; run `npm install --legacy-peer-deps` as a fallback |

---

## 7. Building for Production

**Frontend:**
```bash
cd client
npm run build        # outputs static files to client/dist
npm run preview       # preview the production build locally
```

**Backend:**
```bash
cd server
NODE_ENV=production npm start
```

---

## 8. Deployment Options

### Option A — Split deployment (recommended)
- **Frontend** → Vercel or Netlify
  1. Import the `client/` folder as the project root
  2. Build command: `npm run build`, output directory: `dist`
  3. Add environment variable `VITE_API_BASE_URL` pointing to your deployed backend, e.g. `https://your-api.onrender.com/api`
- **Backend** → Render, Railway, or Cyclic
  1. Import the `server/` folder as the project root
  2. Build command: `npm install`, start command: `npm start`
  3. Add all variables from `.env.example` in the host's environment settings
  4. Set `CLIENT_URL` to your deployed frontend URL for CORS to work
- **Database** → MongoDB Atlas (see step 2, Option B)

### Option B — Single VPS (DigitalOcean, EC2, etc.)
1. Install Node.js, MongoDB (or use Atlas), and `pm2` on the server
2. Clone/upload the project
3. `cd server && npm install && npm run seed && pm2 start server.js --name vista-voyager-api`
4. `cd client && npm install && npm run build`
5. Serve `client/dist` with Nginx, and reverse-proxy `/api` to `localhost:5000`
6. Set up SSL with Certbot for HTTPS

---

## 9. Extending the AI Layer (Optional)

To plug in a real LLM instead of the built-in rule-based chatbot:
1. Open `server/services/aiChatService.js`
2. Add a call to your provider (OpenAI/Anthropic/etc.) using the `AI_PROVIDER_API_KEY` from `.env`
3. Keep the function signature `getChatResponse(message, user)` the same — nothing else in the app needs to change

---

You're all set — happy travels with Vista Voyager! 🧳✈️
