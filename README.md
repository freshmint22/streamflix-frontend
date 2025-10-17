# StreamFlix Backend

This repository contains the StreamFlix backend implemented with Node.js, TypeScript and Express. It includes Sprint 1 features:

- User registration, login and logout (JWT + in-memory blacklist)
- Password recovery (forgot/reset)
- User profile: get, update, delete
- Movies API: list, get, create, update, delete

## Deploying to Render (quick steps)

1. Create a new Web Service on Render using the repository.
2. Set the Build Command to:

   npm run build

3. Set the Start Command to:

   npm run start

4. Environment variables required:

- MONGO_URI (or MONGODB_URI) - MongoDB connection string
- JWT_SECRET - JWT signing secret
- EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS - SMTP credentials for password reset emails (optional for testing)
- PORT - (optional) port to run the server

5. Health check (Render): set the Health Check path to `/health`.

6. After deployment, Render will run `npm run build` and `npm run start`.

## Local development

- Install dependencies: `npm install`
- Start in dev mode: `npm run dev`

## Notes

- Rotate any credentials used in `.env` before sharing the repository.
- For production JWT revocation use a persistent store (Redis) instead of the in-memory blacklist.
- Tests are not included; consider adding Jest + Supertest + mongodb-memory-server for CI.
