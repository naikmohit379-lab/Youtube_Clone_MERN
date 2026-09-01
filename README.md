# YouTube Clone

A full-stack **YouTube Clone application** built using the **MERN stack**.

The application allows users to register and log in, create channels, create and manage videos, watch videos, search videos, filter videos by category, like/dislike videos, and manage comments.

---

## Tech Stack

### Frontend

* React
* React Router
* Axios
* Vite
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

---

## Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Protected routes
* Logout functionality

### Channels

* Create a channel
* View channel information
* View channel videos
* Create videos for your own channel

### Videos

* Create videos
* View videos
* Edit videos
* Delete videos
* Play videos
* View counter
* Like videos
* Dislike videos

### Search and Categories

Users can search videos by title and filter videos by category.

Available categories:

* All
* Music
* Gaming
* Programming
* News
* Sports
* Education

Search and category filters can be used together.

### Comments

* Add comments
* View comments
* Edit your own comments
* Delete your own comments

### User Interface

* Responsive design
* Desktop support
* Tablet support
* Mobile support
* YouTube-inspired interface
* Hover effects
* Button transitions
* Page animations
* Video card animations

---

## Project Structure

```text
youtube-clone/
│
├── backend/
│   │
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   │
│   ├── mongodb-dump/
│   │   └── youtube_clone/
│   │       ├── channels.bson
│   │       ├── channels.metadata.json
│   │       ├── comments.bson
│   │       ├── comments.metadata.json
│   │       ├── users.bson
│   │       ├── users.metadata.json
│   │       ├── videos.bson
│   │       └── videos.metadata.json
│   │
│   ├── .env
│   ├── index.js
│   └── package.json
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Installation

### 1. Clone the Repository

Clone the project repository:

```bash
git clone https://github.com/naikmohit379-lab/Youtube_Clone_MERN.git
```

Move into the project directory:

```bash
cd Youtube_Clone_MERN
```

---

## Backend Setup

Move into the backend directory:

```bash
cd backend
```

Install the required dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory.

Add the following environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Replace the values with your own MongoDB connection string and JWT secret.

Start the backend server:

```bash
npm start
```

The backend server will run on:

```text
http://localhost:5000
```

---

## Frontend Setup

Open another terminal.

Move into the frontend directory:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

Open the URL displayed by Vite in your browser.

---

# MongoDB Database

The project uses **MongoDB** as the database.

The database name used during development is:

```text
youtube_clone
```

The database contains the following collections:

```text
channels
comments
users
videos
```

## MongoDB Database Backup

A MongoDB database dump is included with the backend project:

```text
backend/mongodb-dump/youtube_clone/
```

The dump contains the project's MongoDB collections in BSON format.

### Restoring the Database

Make sure MongoDB Community Server is running.

From the project directory, run:

```bash
mongorestore --uri="mongodb://127.0.0.1:27017" ./backend/mongodb-dump
```

This will restore the `youtube_clone` database and its collections.

After restoring the database, configure the backend `.env` file with the appropriate MongoDB connection string.

For example:

```env
MONGO_URI=mongodb://127.0.0.1:27017/youtube_clone
```

---

# API Endpoints

The application uses REST APIs for communication between the frontend and backend.

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

## Channels

```text
POST /api/channels
GET  /api/channels/:id
```

## Videos

```text
POST   /api/videos
GET    /api/videos
GET    /api/videos/:id
PUT    /api/videos/:id
DELETE /api/videos/:id
PUT    /api/videos/:id/like
PUT    /api/videos/:id/dislike
PUT    /api/videos/:id/view
```

## Comments

```text
POST   /api/comments
GET    /api/comments/:videoId
PUT    /api/comments/:id
DELETE /api/comments/:id
```

---

# Authentication

The application uses **JWT authentication** to secure protected operations.

Users can:

* Register an account
* Log in
* Log out
* Access protected features

Protected operations include:

* Creating channels
* Creating videos
* Editing videos
* Deleting videos
* Liking videos
* Disliking videos
* Adding comments
* Editing comments
* Deleting comments

---

# Video Management

Authenticated users can create videos for their own channels.

Users can:

* Add a video title
* Add a thumbnail URL
* Add a video URL
* Add a description
* Select a category
* Edit video information
* Delete their own videos

The video URL should point to an actual playable video file.

Example:

```text
https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4
```

---

# Search and Filtering

The home page provides video search and category filtering.

Users can search videos by title.

Example search:

```text
JavaScript
```

The application also provides category filters:

* All
* Music
* Gaming
* Programming
* News
* Sports
* Education

Search and category filters can be used together.

---

# Video Player

The video player page provides:

* Video playback
* Video title
* View count
* Like button
* Dislike button
* Channel information
* Video description
* Comments

Users can interact with the video through the available controls.

---

# Comments

Authenticated users can add comments to videos.

Users can:

* Add comments
* View comments
* Edit their own comments
* Delete their own comments

Comments display the username of the user who created them.

---

# Channels

Users can create their own channel.

A channel contains:

* Channel name
* Channel description
* Subscriber count
* Channel videos

Users can create videos only for their own channel.

---

# Pages

The application contains the following major pages:

```text
/
├── Home
│
├── /login
│   └── Login
│
├── /register
│   └── Register
│
├── /video/:id
│   └── Video Player
│
├── /channel/:id
│   └── Channel
│
├── /channel/:id/create-video
│   └── Create Video
│
├── /video/:id/edit
│   └── Edit Video
│
└── /create-channel
    └── Create Channel
```

---

# Running the Complete Application

The backend and frontend should be running at the same time.

### Terminal 1 — Backend

```bash
cd backend
npm install
npm start
```

Backend:

```text
http://localhost:5000
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# Responsive Design

The application is designed to work across different screen sizes.

### Desktop

The video grid displays multiple videos in a row.

### Tablet

The video grid adjusts to fewer columns.

### Mobile

The video grid changes to a single-column layout and the header/search area adjusts for smaller screens.

---

# UI Design

The application uses a YouTube-inspired design with:

* Clean white interface
* Rounded buttons
* Search bar
* Category filter buttons
* Video cards
* Responsive layouts
* Hover effects
* Smooth transitions
* Page animations

---

# Git Version Control

Git is used to manage the project's source code and development history.

### Check Git Status

```bash
git status
```

### View Commit History

```bash
git log --oneline
```

### Count Commits

```bash
git rev-list --count HEAD
```

### Create a Commit

```bash
git add .
git commit -m "Your commit message"
```

### Push Changes

```bash
git push
```

---

# Future Improvements

Possible future improvements include:

* Real video file upload
* User profile pages
* Subscribe/unsubscribe functionality
* Recommended videos
* Video playlists
* Video watch history
* Advanced search
* Pagination
* Dark mode
* Notifications
* Improved video player controls

---

# GitHub Repository

**Repository:**

https://github.com/naikmohit379-lab/Youtube_Clone_MERN

---

# Author

**Mohith Naik**

Full Stack Development Project
