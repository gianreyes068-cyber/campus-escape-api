Campus Escape API

Backend API for Campus Escape, a tournament game for the SorSU Bulan Campus library.
CS 313 Software Engineering 1, A.Y. 2026-2027.

- Developer: Gian Fortes Reyes (gianreyes068-cyber), BSCS 3-2
- Group and game concept: Team 6

This is my own build of my group's game concept. Every commit in this repository was made by me, with Git, on my own computer or in my own Codespace.

## Tech stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 22 LTS or newer |
| Web framework | Express 5 |
| Database | PostgreSQL 16 or newer |
| ORM and migrations | Sequelize 6 with sequelize-cli |

## Setup

```
git clone [repository-url]
cd [folder-name]
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD`.

```
npm run db:create     (first time only)
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

## Environment variables

| Key | Example | Purpose |
|---|---|---|
| NODE_ENV | development | Which config block to use |
| PORT | 3001 | Port the API listens on (the library assigns the final port at deployment) |
| DB_HOST | 127.0.0.1 | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | your_game_slug | Database name: your game slug, with underscores |
| DB_USER | postgres | Database user |
| DB_PASSWORD | (your own) | Database password. Never commit this. |
| HUB_API_KEY | dev-hub-key | Key the Library Game Hub sends to read results. The library gives the real one at deployment. |

## Endpoints (Hub Contract v1.2)

Base URL: `http://localhost:3001/api/v1`

| Method | Path | Purpose | Success |
|---|---|---|---|
| GET | /health | Is the API up and can it reach the database? | 200 (503 when the database is down) |
| GET | /game-info | Slug, name, group, developer, description, player limits, version | 200 |
| GET | /results | Finished games, every player, and the top 3. Needs the `X-Hub-Key` header. Optional `?since=` | 200 (401 without the key) |

# Module 1 - Question Sets

| Method | Endpoint | Who May Call |
|----------|----------|----------|
| GET | /api/v1/question-sets | HOST, ADMIN |
| POST | /api/v1/question-sets | HOST, ADMIN |
| GET | /api/v1/question-sets/:id | HOST, ADMIN |
| PATCH | /api/v1/question-sets/:id | HOST, ADMIN |
| DELETE | /api/v1/question-sets/:id | HOST, ADMIN |

# Module 2 — Sessions and Joining

| Method | Endpoint | Who May Call |
|----------|----------|----------|
| POST | /api/v1/sessions | HOST, ADMIN |
| GET | /api/v1/sessions/:code | Any authenticated account |
| PATCH | /api/v1/sessions/:code | Session host, ADMIN |
| POST | /api/v1/sessions/:code/players | Any authenticated account |
| GET | /api/v1/sessions/:code/players | Any authenticated account |


## What "completed" means in my game

A player completed Campus Escape by reaching the gate stage before the session ended. A player who stopped at an earlier stage did not complete the game.

## Database Tables

users, question_sets, questions, question_choices, sessions, session_players, answers, reward_claims

## Database scripts

| Command | Description |
|----------|----------|
| npm run db:create | Create the database |
| npm run db:migrate | Run pending migrations |
| npm run db:migrate:status | Show migration status |
| npm run db:seed | Load seed data |
| npm run db:check | Verify table row counts |
| npm run db:reset | Rebuild and reseed database |
| npm run check | Run automated project checks |

# Testing

The Week 11 Postman collection is located in:

```text
postman/Campus Escape API - Week 11.postman_collection.json
```

The collection covers the required test cases for:

### Module 1 - Question Sets

- Create a question set (201)
- Validation failure (400)
- Invalid JSON (400)
- Missing user header (401)
- Wrong role (403)
- Read question sets (200)
- Read one question set (200)
- Question set not found (404)
- Invalid id format (400)
- Update question set (200)
- Update by non-owner (403)
- Empty update request (400)
- Delete question set (204)

### Module 2 - Sessions and Joining

- Host starts a session (201)
- Player attempts to start a session (403)
- Read a session (200)
- Invalid session code format (400)
- Session code not found (404)
- Player joins a session (201)
- Same player rejoins a session (200)
- Duplicate nickname (409)
- Nickname validation failure (400)
- Host starts the game (200)
- New player joins too late (409)
- Invalid status transition (409)

## Running the Tests

Start from a clean database:

```bash
npm run db:reset
npm run dev
```

Import the Postman collection and run the full collection.

Expected result:

```text
Requests: Passed
Failed: 0
Errors: 0
```

# Developer Notes

This project follows the layered architecture required in CS 313:

- Routes
- Validators
- Controllers
- Services
- Repositories
- Models

Business rules are implemented in services.

Database access is isolated in repositories.

Validation is handled through express-validator.

Error responses follow the format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

