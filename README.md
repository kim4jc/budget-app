# budget-app

This repository contains three parts:
- `client/`: React app (Vite)
- `desktop/`: Electron wrapper
- `server/`: Node.js + Express backend

## Getting Started

### 1. Install dependencies for all parts:

```bash
cd client
npm install

cd ../server
npm install

cd ../desktop
npm install


### Server
# We are using sqlite for our server
Install the sqlite and sqlite viewer extentions to view the tables
The actual server is: database.sqlite
Tables are defined under models, ex. User table is user.js
To start and sync the models with the database, run: node server.jsx