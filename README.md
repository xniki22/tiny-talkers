# Tiny Talkers

Tiny Talkers is a full-stack speech-learning web application designed to help young children ages 1–5 practice familiar words, actions, short phrases, simple sentences, and everyday spoken language.

The application provides a simple, visual, and encouraging learning experience where children can listen to words or phrases, repeat them aloud, and progress through increasingly advanced learning levels.

Parents can create an account, create multiple child profiles, and each child has independently saved learning progress.

> **Project Status:** Tiny Talkers is currently under development and has not yet been deployed to production.

## Features

### Parent Accounts

* Parent registration and login
* Secure password hashing with Argon2
* Session-based authentication
* Session restoration after page refresh
* Multiple child profiles per parent account
* Animal-style avatar selection
* Ability to switch between child profiles
* Separate learning progress for each child
* Parent-to-child ownership protection

### Child Learning Experience

* 6 learning levels
* 30 total learning items
* Images for every learning item
* Browser speech synthesis for audio playback
* Listen, repeat, and continue learning flow
* Back and next navigation
* Visual progress tracking
* Resume unfinished levels
* Sequential level unlocking
* Level completion screens
* Independent progress for each child

Tiny Talkers intentionally does not grade pronunciation in the current version. The focus is on listening, repetition, familiarity, and encouraging children to practice speaking.

## Learning Levels

Tiny Talkers currently contains six progressively structured learning levels.

### Level 1 — Things Around Me

Apple, Ball, Cup, Book, Shoe

### Level 2 — Animal Friends

Cat, Dog, Bird, Fish, Frog

### Level 3 — Action Words

Eat, Run, Sit, Jump, Sleep

### Level 4 — Little Phrases

Red ball, Big dog, Blue cup, Small cat, Yellow bird

### Level 5 — Simple Sentences

* I see a cat.
* I want water.
* I like apples.
* The dog runs.
* The bird flies.

### Level 6 — Everyday Talking

* Good morning!
* Help me, please.
* Thank you!
* I want to play.
* The dog is running.

## Learning Flow

The learning experience is intentionally kept simple for young children:

```text
Parent Login / Register
        |
        v
Select Child Profile
        |
        v
Child Learning Home
        |
        v
Select Unlocked Level
        |
        v
Lesson
        |
        v
Listen -> Repeat -> Continue
        |
        v
Level Complete
        |
        v
Return to Levels
```

Levels unlock sequentially as the child completes them. Progress is stored at both the item and level level, allowing children to return later and resume their learning.

## Screenshots

Screenshots of the application will be added as the user interface continues to be polished.

### Parent Login

<!-- Add screenshot here -->

### Child Profile Selection

<!-- Add screenshot here -->

### Learning Levels

<!-- Add screenshot here -->

### Lesson

<!-- Add screenshot here -->

### Level Complete

<!-- Add screenshot here -->

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* CSS
* Browser Speech Synthesis

### Backend

* Node.js
* Express
* TypeScript

### Database

* SQLite

### Authentication

* Argon2 password hashing
* SQLite-backed sessions
* Bearer-token authentication

### Development Tools

* Git
* GitHub
* npm

## Architecture

Tiny Talkers uses a client-server architecture.

```text
React Frontend
     |
     | REST API
     v
Node.js / Express Backend
     |
     v
SQLite Database
```

The frontend communicates with the Express API to authenticate parents, manage child profiles, and save or retrieve learning progress.

The SQLite database currently stores:

```text
users
sessions
children
child_progress
child_item_progress
```

## Project Structure

```text
tiny-talkers/
|
├── client/
|   ├── public/
|   |   └── images/
|   |
|   └── src/
|       ├── assets/
|       ├── components/
|       ├── data/
|       ├── interfaces/
|       ├── pages/
|       ├── services/
|       ├── styles/
|       ├── App.tsx
|       └── main.tsx
|
├── server/
|   └── src/
|       ├── auth/
|       ├── children/
|       ├── database/
|       ├── progress/
|       └── index.ts
|
├── .gitignore
└── README.md
```

## Security and Privacy

Because Tiny Talkers is designed around children, security and privacy are important considerations in the application's architecture.

Currently implemented security measures include:

* Passwords are hashed using Argon2
* Authentication sessions are stored in SQLite
* Protected child and progress routes require authentication
* Child profiles are associated with their parent account
* Backend ownership checks prevent parents from accessing another parent's child profiles
* Progress ownership checks protect each child's learning data
* Local database files are excluded from Git
* Child voice recordings are not stored or uploaded
* Audio prompts use browser speech synthesis

The current development version stores the session ID in browser `localStorage` and sends it to authenticated backend routes as a Bearer token.

For a future production release, authentication and security will be strengthened with HttpOnly secure cookies, HTTPS, rate limiting, environment-based configuration, centralized authentication middleware, and additional automated security testing.

## Running the Project Locally

### Prerequisites

Install:

* Node.js
* npm
* Git

### Clone the Repository

```bash
git clone https://github.com/xniki22/tiny-talkers.git
cd tiny-talkers
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

From the project root:

```bash
cd server
npm install
```

### Start the Backend

From the `server` directory:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:3000
```

### Start the Frontend

From the `client` directory:

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## Build

To build the frontend:

```bash
cd client
npm run build
```

To build the backend:

```bash
cd server
npm run build
```

Both frontend and backend builds have been successfully tested during development.

## Current Status

The core Tiny Talkers learning experience is functional.

Currently working:

* Parent registration
* Parent login and logout
* Session restoration
* Multiple child profiles
* Child avatar selection
* Parent-child ownership protection
* Six learning levels
* Thirty learning items
* Browser speech synthesis
* Item-level progress tracking
* Level-level progress tracking
* Resume unfinished lessons
* Sequential level unlocking
* Level completion
* Separate progress for each child
* Protected backend routes

## Future Improvements

Potential future improvements include:

* UI/UX polish
* Improved mobile responsiveness
* Parent progress dashboard
* Editing and deleting child profiles
* Account settings
* Password reset
* Email service
* Custom learning content
* Accessibility improvements
* Automated backend tests
* CI/CD
* Environment-based API configuration
* Production cookie authentication
* Production deployment
* Database migration system
* Potential PostgreSQL migration as the application grows

Pronunciation scoring, speech recognition, and child voice recordings are not currently part of the application.

## Repository Notes

The local SQLite database is intentionally excluded from GitHub because it may contain user accounts, password hashes, authentication sessions, child profiles, and learning progress.

Files containing private data, generated dependencies, or secrets should not be committed, including:

```text
.env
*.db
*.sqlite
*.sqlite3
node_modules/
client/dist/
server/dist/
```

Passwords, API keys, tokens, and production credentials should never be committed to the repository.

## Author

**Nikitha Cano**

Computer Science student and developer of Tiny Talkers.

GitHub: @xniki22
