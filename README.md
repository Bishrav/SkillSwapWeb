# SkillSwapWeb 🌐

> Full-stack skill-sharing platform with React frontend and Express/PostgreSQL backend

[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)](https://postgresql.org)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)](https://jwt.io)

## Overview

SkillSwapWeb is a full-stack web platform where users can post skills they offer, discover skills they need, follow other users, save posts, and manage cart and order flows. Built with a React/Vite frontend and a modular Express/PostgreSQL backend with full JWT authentication and test coverage.

## Features

- **Auth** — JWT-based login/signup with bcryptjs password hashing, public/private route guards
- **Skill Posts** — Create, browse, and view skill listings with post detail pages
- **Social Graph** — Follow/unfollow users, view matches and user profiles
- **Saved & Cart** — Save posts, add to cart, and manage orders
- **Theme** — Light/dark mode toggle via Context API
- **Tests** — Jest/Supertest API integration tests + React Testing Library component tests

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router, Context API, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL, raw SQL schemas |
| Auth | JWT, bcryptjs |
| Testing | Jest, Supertest, React Testing Library, Vitest |

## Project Structure

```
client/
├── src/
│   ├── components/    # Navbar, Footer, PostCard, SplashScreen, ThemeToggle
│   ├── pages/         # Home, Login, Signup, Profile, UserProfile, AddSkill,
│   │                  # PostDetails, Matches, Cart, Saved
│   ├── routes/        # PrivateRoute, PublicRoute
│   └── context/       # ThemeContext
server/
├── controllers/       # auth, posts, comments, users, cart, orders, profiles
├── routes/            # Modular Express route handlers
├── middleware/         # Auth middleware
└── tests/             # Jest/Supertest API test suite
```

## Getting Started

```bash
# Backend
cd server && npm install
# Set up .env: DATABASE_URL, JWT_SECRET
npm start

# Frontend
cd client && npm install
npm run dev
```

## Related

- [SkillSwaper](https://github.com/Bishrav/SkillSwaper) — Android mobile version of this platform

