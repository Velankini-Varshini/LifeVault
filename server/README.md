# LifeVault AI Backend Service

This is the backend service for LifeVault AI, built with Node.js, Express, and TypeScript.

## Folder Structure

```
server/
├── src/
│   ├── config/          # Configuration files and environment variables
│   ├── controllers/     # Route handlers for processing requests
│   ├── middleware/      # Express middlewares (error handling, logging, etc.)
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic and external API integrations
│   ├── repositories/    # Database interaction logic
│   ├── validators/      # Request validation schemas (e.g., Zod)
│   ├── utils/           # Utility classes and helper functions
│   ├── types/           # TypeScript type definitions
│   ├── interfaces/      # TypeScript interfaces
│   ├── constants/       # Global constants and enums
│   ├── app.ts           # Express app configuration
│   └── server.ts        # Server entry point
├── prisma/              # Prisma ORM schema and migrations
├── uploads/             # Directory for file uploads
├── logs/                # Directory for application logs
├── tests/               # Unit and integration tests
├── .env                 # Environment variables (do not commit)
├── .env.example         # Example environment variables
└── package.json         # Project dependencies and scripts
```

## How to Install

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

## Available Scripts

- `npm run dev`: Starts the server in development mode with hot-reloading (using `ts-node-dev`).
- `npm run build`: Compiles the TypeScript code to JavaScript in the `dist/` directory.
- `npm run start`: Starts the compiled application in production mode.
- `npm run lint`: Runs type checking without emitting files.
- `npm run prisma:generate`: Generates Prisma client.
- `npm run prisma:migrate`: Runs Prisma database migrations in development.

## How to Start the Server

To start the server for local development, run:

```bash
npm run dev
```

The server will start on the port specified in your `.env` file (default is `5000`).

## API Endpoints

The API is versioned and base URL is `/api/v1`.

### Health Check

- **URL:** `/api/v1/health`
- **Method:** `GET`
- **Description:** Checks if the server is running and healthy.

### Server Status

- **URL:** `/api/v1/status`
- **Method:** `GET`
- **Description:** Returns the current environment and server details.
