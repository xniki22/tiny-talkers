# Tiny Talkers

Tiny Talkers is a full-stack speech and language learning web application designed to help young children practice familiar words, actions, short phrases, simple sentences, and everyday spoken language.

The application provides a simple, visual, and encouraging learning experience where children can listen to words or phrases, repeat them aloud, and progress through increasingly advanced learning levels.

Parents can create an account, create multiple child profiles, and maintain independently saved learning progress for each child.

Tiny Talkers also includes an AI-powered **Create Custom Level** feature that allows parents to generate personalized language-practice content based on a topic they choose. AI-generated content is presented to the parent for review and editing before it can be saved for the child.

> **Project Status:** Tiny Talkers is currently under development and has not yet been deployed to production.

---

## Features

### Parent Accounts

- Parent registration and login
- Secure password hashing with Argon2
- Session-based authentication
- Session restoration after page refresh
- Multiple child profiles per parent account
- Emoji-based avatar selection
- Ability to switch between child profiles
- Separate learning progress for each child
- Parent-to-child ownership protection

### Child Learning Experience

- 6 structured core learning levels
- 30 core learning items
- Child-friendly generated illustrations
- Browser speech synthesis for audio playback
- Listen, repeat, and continue learning flow
- Back and next navigation
- Visual progress tracking
- Resume unfinished levels
- Sequential level unlocking
- Level completion celebrations
- Star rewards for completed core levels
- Independent progress for each child

Tiny Talkers intentionally does not grade pronunciation in the current version. The focus is on listening, repetition, familiarity, and encouraging children to practice speaking.

---

## AI-Powered Custom Levels

Tiny Talkers includes an AI-powered **Create Custom Level** feature for parents.

A parent can enter a topic or type of vocabulary they would like their child to practice. The application sends the request to the backend, where the OpenAI API generates a custom level containing five age-appropriate words, phrases, or short sentences.

The parent can then:

- Review the generated content
- Edit individual learning items
- Remove unwanted items
- Add their own items
- Review the custom level title
- Save the approved level for the selected child
- Delete previously saved custom levels

AI-generated learning content is **not automatically presented to the child**. A parent reviews and approves the content before it becomes part of the child's personalized practice.

Saved custom levels use the same general listen-and-repeat lesson experience as the core learning levels.

Custom levels currently use text and browser speech synthesis rather than generated learning-item images.

---

## Star Rewards

Children earn a star when they complete one of the six core learning levels.

After completing a level, the child sees a celebration screen showing the newly earned star and their total number of stars.

The child's total stars are also displayed on the learning home page.

Stars are derived from completed core levels, so completing the same level again does not create duplicate rewards.

Custom AI-generated levels do not currently award stars.

---

## Core Learning Levels

Tiny Talkers contains six progressively structured core learning levels.

### Level 1 — Things Around Me

Apple, Ball, Cup, Book, Shoe

### Level 2 — Animal Friends

Cat, Dog, Bird, Fish, Frog

### Level 3 — Action Words

Eat, Run, Sit, Jump, Sleep

### Level 4 — Little Phrases

Red ball, Big dog, Blue cup, Small cat, Yellow bird

### Level 5 — Simple Sentences

- I see a cat.
- I want water.
- I like apples.
- The dog runs.
- The bird flies.

### Level 6 — Everyday Talking

- Good morning!
- Help me, please.
- Thank you!
- I want to play.
- The dog is running.

---

## Learning Flow

The core learning experience is intentionally kept simple for young children:

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
Earn Star
        |
        v
Return to Learning Path
```

Core levels unlock sequentially as the child completes them.

Progress is stored at both the item and level level, allowing children to return later and resume their learning.

---

## Custom Level Flow

```text
Parent selects Create Custom Level
        |
        v
Enter a learning topic
        |
        v
Generate with AI
        |
        v
AI creates 5 practice items
        |
        v
Parent reviews and edits
        |
        v
Parent approves and saves
        |
        v
Custom Level appears for child
        |
        v
Listen -> Repeat -> Continue
```

This parent-review step is an important part of the design because generated content is not automatically delivered to the child.

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS
- Browser Speech Synthesis

### Backend

- Node.js
- Express
- TypeScript

### Database

- SQLite

### AI

- OpenAI API
- OpenAI Responses API

### Authentication

- Argon2 password hashing
- SQLite-backed sessions
- Bearer-token authentication

### Development Tools

- Git
- GitHub
- npm

---

## Architecture

Tiny Talkers uses a client-server architecture.

```text
React Frontend
      |
      | REST API
      v
Node.js / Express Backend
      |
      |---- OpenAI API
      |
      v
SQLite Database
```

The frontend communicates with the Express API to authenticate parents, manage child profiles, save and retrieve learning progress, manage custom levels, and request AI-generated learning content.

The SQLite database currently stores data for:

```text
users
sessions
children
child_progress
child_item_progress
custom_levels
custom_level_items
```

---

## Project Structure

```text
tiny-talkers/
|
├── client/
|   ├── public/
|   |   └── images/
|   |
|   └── src/
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
|   ├── .env.example
|   |
|   └── src/
|       ├── auth/
|       ├── children/
|       ├── customLevels/
|       ├── database/
|       ├── progress/
|       └── index.ts
|
├── .gitignore
└── README.md
```

---

## Security and Privacy

Because Tiny Talkers is designed around children, security and privacy are important considerations in the application's architecture.

Currently implemented measures include:

- Passwords are hashed using Argon2
- Authentication sessions are stored in SQLite
- Protected child and progress routes require authentication
- Child profiles are associated with their parent account
- Backend ownership checks prevent parents from accessing another parent's child profiles
- Custom-level routes verify ownership of the selected child
- Progress ownership checks protect each child's learning data
- Local database files are excluded from Git
- Environment files containing secrets are excluded from Git
- Child voice recordings are not stored or uploaded
- Audio prompts use browser speech synthesis
- AI-generated learning content is presented to the parent for review before being saved for the child

The current development version stores the session ID in browser `localStorage` and sends it to authenticated backend routes as a Bearer token.

For a future production release, authentication and security can be strengthened with HttpOnly secure cookies, HTTPS, rate limiting, additional environment-based configuration, centralized authentication middleware, and additional automated security testing.

---

## Running the Project Locally

### Prerequisites

Install:

- Node.js
- npm
- Git

An OpenAI API key is also required to use AI custom-level generation.

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

### Configure Environment Variables

Inside the `server` directory, create a `.env` file based on:

```text
server/.env.example
```

Add your own OpenAI API key to the `.env` file.

Do not commit the `.env` file or your API key to GitHub.

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

---

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

---

## Hackathon Development

Tiny Talkers existed as a learning application before the AI hackathon work began. During the hackathon development period, the project was substantially expanded with personalized AI-powered learning functionality and additional child engagement features.

Major additions during this development period include:

- AI-powered custom-level generation
- OpenAI API integration
- Parent topic input for personalized practice
- Generation of five age-appropriate practice items
- Parent review and editing of generated content
- Parent approval before generated content is saved for a child
- Persistent custom-level storage in SQLite
- Custom-level backend APIs
- Custom-level lesson integration
- Star rewards for completed core levels
- Level-completion celebration improvements
- Replacement of previous learning images with newly generated child-friendly illustrations

The six structured core learning levels remain available independently of the AI feature.

---

## Current Status

The core Tiny Talkers learning experience and AI custom-level workflow are functional.

Currently working:

- Parent registration
- Parent login and logout
- Session restoration
- Multiple child profiles
- Child avatar selection
- Parent-child ownership protection
- Six structured core learning levels
- Thirty core learning items
- Browser speech synthesis
- Item-level progress tracking
- Level-level progress tracking
- Resume unfinished lessons
- Sequential level unlocking
- Level completion
- Star rewards
- Separate progress for each child
- Protected backend routes
- AI-generated custom levels
- Parent review and editing of AI-generated content
- Custom-level saving
- Custom-level deletion
- Custom-level practice through the lesson experience

---

## AI and Third-Party Disclosure

Tiny Talkers uses the OpenAI API to generate personalized language-practice content. AI-generated content is presented to a parent for review and approval before it is saved for a child.

Generative AI tools were also used during development to assist with brainstorming, architecture guidance, debugging, code review, and the creation of child-friendly learning illustrations. The developer directed, reviewed, tested, and integrated the resulting work into the application.

Tiny Talkers uses open-source JavaScript and TypeScript packages as part of its React, Vite, Node.js, Express, SQLite, and OpenAI integration stack. Client and server dependencies were reviewed for their associated open-source licenses as part of hackathon submission preparation.

The application does not store or upload child voice recordings. Speech prompts are produced using browser speech synthesis.

---

## Future Improvements

Potential future improvements include:

- Persistent progress tracking for custom levels
- Additional parent controls
- Parent progress dashboard
- Editing and deleting child profiles
- Account settings
- Password reset
- Accessibility improvements
- Additional automated content-safety checks
- More automated backend and frontend tests
- CI/CD
- Production cookie authentication
- Production deployment
- Additional child-friendly rewards
- More personalization options
- Database migration tooling
- Potential PostgreSQL migration as the application grows

Pronunciation scoring and child voice recording are not currently part of the application.

---

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

---

## Author

**Nikitha Cano**

Computer Science student and developer of Tiny Talkers.

GitHub: `@xniki22`