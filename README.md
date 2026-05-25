# SkillSync

SkillSync is a full-stack skill exchange platform built for students and professionals who want to learn by trading skills instead of paying for courses. Users can discover people by the skills they offer, connect with them, chat in real time, and schedule learning sessions.

This repository is organized with separate frontend and backend folders so the project is easier to run, explain, and deploy.

Live Demo: https://skillswap-4tg3.vercel.app/

## Key Features

- Demo login with predefined users
- Protected dashboard pages
- Skill discovery with search and filters
- User profile and network management screens
- Real-time messaging using Socket.io
- Swap and message request flow
- Meeting/session scheduling
- Dark and light theme support
- Responsive React UI

## Tech Stack

**Frontend**

- React
- React Router
- Lucide React
- CSS and inline component styling
- Socket.io Client

**Backend**

- Node.js
- Express
- Socket.io
- CORS
- JSON file storage for demo persistence

## Folder Structure

```txt
Skill_Sync-main/
  backend/
    server.js
    package.json
    package-lock.json
    .env.example

  frontend/
    public/
    src/
      components/
      context/
      data/
      pages/
      utils/
      config.js
    package.json
    package-lock.json
    .env.example

  .gitignore
  LICENSE
  README.md
  package.json
```

## Demo Credentials

Use any of these accounts for local demo login:

```txt
bhumika@ncuindia.edu / bhumika123
nikhil@ncuindia.edu / nikhil123
priya@ncuindia.edu / priya123
simran@ncuindia.edu / simran123
aryan@ncuindia.edu / aryan123
```

## How To Run Locally

Make sure Node.js and npm are installed.

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Start Backend

```bash
npm start
```

Backend runs at:

```txt
http://localhost:3002
```

### 3. Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### 4. Start Frontend

```bash
npm start
```

Frontend runs at:

```txt
http://localhost:3000
```

Open `http://localhost:3000` in the browser for the app UI.

## Optional Root Commands

From the project root, you can also run:

```bash
npm run backend
npm run frontend
npm run build
```

You still need to install dependencies inside `backend/` and `frontend/` first.

## Environment Variables

Frontend example: `frontend/.env.example`

```env
REACT_APP_API_URL=http://localhost:3002
REACT_APP_SOCKET_URL=http://localhost:3002
```

Backend example: `backend/.env.example`

```env
PORT=3002
CLIENT_ORIGIN=http://localhost:3000,http://localhost:3001
```

## Data Storage

This project does not use a database. The backend saves local demo data in:

```txt
backend/data.json
```

This file is created automatically when users sign up, send messages, create meetings, or update connections. It is ignored by Git because it contains local demo data.

Stored locally:

- New signup users
- Messages
- Meetings
- Connections
- Pending/accepted requests

## Build Frontend

```bash
cd frontend
npm run build
```

The production build will be generated inside:

```txt
frontend/build/
```

## Evaluation Demo Flow

Recommended flow to show during evaluation:

1. Start backend on `http://localhost:3002`.
2. Start frontend on `http://localhost:3000`.
3. Login using one demo account.
4. Show dashboard and profile.
5. Open Discover and filter users by skill.
6. Open Network to show connected users.
7. Open Messages and demonstrate chat UI.
8. Schedule a meeting/session from the messages page.

## Current Limitations

- Data is stored in a local JSON file instead of a real database.
- Authentication is demo-based, not production-grade.
- The backend must be running locally for real-time messaging and meetings.
- Some actions are prototype-level and intended for demonstration.

## GitHub Notes

Do not push generated files such as:

```txt
node_modules/
frontend/build/
backend/data.json
.env
```

These are already covered in `.gitignore`.

## License

This project is licensed under the MIT License.
