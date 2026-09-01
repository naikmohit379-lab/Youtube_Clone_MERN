# YouTube Clone

A full-stack YouTube Clone application built using the MERN stack.

The application allows users to register and log in, create channels, create and manage videos, watch videos, search videos, filter videos by category, like/dislike videos, and manage comments.

---

## Tech Stack

### Frontend

- React
- React Router
- Axios
- Vite
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

## Features

### Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes
- Logout functionality

### Channels

- Create a channel
- View channel information
- View channel videos
- Create videos for your own channel

### Videos

- Create videos
- View videos
- Edit videos
- Delete videos
- Play videos
- View counter
- Like videos
- Dislike videos

### Search and Categories

- Search videos by title
- Filter videos by category
- Multiple category filters

Available categories:

- All
- Music
- Gaming
- Programming
- News
- Sports
- Education

### Comments

- Add comments
- View comments
- Edit your own comments
- Delete your own comments

### User Interface

- Responsive design
- Desktop support
- Tablet support
- Mobile support
- YouTube-inspired interface
- Hover effects
- Button transitions
- Page animations
- Video card animations

---

## Project Structure

```text
youtube-clone/
│
├── backend/
│   │
│   ├── config/
│   │
│   ├── controllers/
│   │
│   ├── middleware/
│   │
│   ├── models/
│   │
│   ├── routes/
│   │
│   ├── .env
│   ├── index.js
│   └── package.json
│
├── frontend/
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │
│   │   ├── context/
│   │   │
│   │   ├── pages/
│   │   │
│   │   ├── services/
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md

Installation

1. Clone the Repository

Clone the project repository:

git clone <your-github-repository-url>

Move into the project directory:

cd youtube-clone

Backend Setup

Move into the backend directory:

cd backend

Install the required dependencies:

npm install

Create a .env file inside the backend directory.

Add the following environment variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Replace the values with your own MongoDB connection string and JWT secret.

Start the backend server:

npm start

The backend server will run on:

http://localhost:5000

Frontend Setup

Open another terminal.

Move into the frontend directory:

cd frontend

Install the frontend dependencies:

npm install

Start the frontend development server:

npm run dev

The frontend will normally run on:

http://localhost:5173

Open the URL displayed by Vite in your browser.

API Endpoints

The application uses REST APIs for communication between the frontend and backend.

Authentication

POST /api/auth/register
POST /api/auth/login

Channels

POST /api/channels
GET  /api/channels/:id

Videos

POST   /api/videos
GET    /api/videos
GET    /api/videos/:id
PUT    /api/videos/:id
DELETE /api/videos/:id
PUT    /api/videos/:id/like
PUT    /api/videos/:id/dislike
PUT    /api/videos/:id/view

Comments

POST   /api/comments
GET    /api/comments/:videoId
PUT    /api/comments/:id
DELETE /api/comments/:id

Authentication

The application uses JWT authentication.

Users can:

Register an account

Log in

Log out

Access protected features

Protected operations include:

Creating channels

Creating videos

Editing videos

Deleting videos

Liking videos

Disliking videos

Adding comments

Editing comments

Deleting comments

Video Management

Authenticated users can create videos for their own channels.

Users can:

Add a video title

Add a thumbnail URL

Add a video URL

Add a description

Select a category

Edit video information

Delete their own videos

The video URL should point to an actual playable video file.

Example:

https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4

Search and Filtering

The home page provides video search and category filtering.

Users can search videos by title.

Example:

JavaScript

The application also provides category filters:

All
Music
Gaming
Programming
News
Sports
Education

Search and category filters can be used together.

Video Player

The video player page provides:

Video playback

Video title

View count

Like button

Dislike button

Channel information

Video description

Comments

Users can interact with the video through the available controls.

Comments

Authenticated users can add comments to videos.

Users can:

Add comments

View comments

Edit their own comments

Delete their own comments

Comments display the username of the user who created them.

Channels

Users can create their own channel.

A channel contains:

Channel name

Channel description

Subscriber count

Channel videos

Users can create videos only for their own channel.

Pages

The application contains the following major pages:

/
├── Home
├── /login
│   └── Login
├── /register
│   └── Register
├── /video/:id
│   └── Video Player
├── /channel/:id
│   └── Channel
├── /channel/:id/create-video
│   └── Create Video
├── /video/:id/edit
│   └── Edit Video
└── /create-channel
    └── Create Channel

Running the Complete Application

The backend and frontend should be running at the same time.

Terminal 1 - Backend

cd backend
npm install
npm start

Backend:

http://localhost:5000

Terminal 2 - Frontend

cd frontend
npm install
npm run dev

Frontend:

http://localhost:5173

Responsive Design

The application is designed to work across different screen sizes.

Desktop

The video grid displays multiple videos in a row.

Tablet

The video grid adjusts to fewer columns.

Mobile

The video grid changes to a single-column layout and the header/search area adjusts for smaller screens.

UI Design

The application uses a YouTube-inspired design with:

Clean white interface

Rounded buttons

Search bar

Category filter buttons

Video cards

Responsive layouts

Hover effects

Smooth transitions

Page animations

Git Version Control

Git is used to manage the project source code and development history.

Check the current Git status:

git status

View the commit history:

git log --oneline

Count the total number of commits:

git rev-list --count HEAD

Create a commit:

git add .
git commit -m "Your commit message"

Future Improvements

Possible future improvements include:

Real video file upload

User profile pages

Subscribe/unsubscribe functionality

Recommended videos

Video playlists

Video watch history

Advanced search

Pagination

Dark mode

Notifications

Improved video player controls

Author

Mohith Naik

Full Stack Development Project