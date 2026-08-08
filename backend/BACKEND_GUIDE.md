# Backend Creation Guide

## Project Goal

Build a production-style e-commerce backend with Node.js, Express, TypeScript, MongoDB, and Mongoose.

This backend should demonstrate the skills expected from a Junior Full Stack Developer:

- creating a clean Express server
- using TypeScript correctly
- connecting to MongoDB
- organizing routes, controllers, services, models, middleware, utilities, and types
- validating user input
- handling authentication with JWT and bcrypt
- returning consistent API responses
- handling errors globally
- preparing the project for deployment

---

# 1. Project Initialization

## Goal

Create the backend project, install all required libraries, and prepare TypeScript.

## Theory

A backend project should start with a predictable foundation:

- `package.json` describes scripts and dependencies.
- `pnpm-lock.yaml` locks exact package versions.
- `tsconfig.json` tells TypeScript how to compile the code.
- `.env` stores secrets and environment-specific values.
- `.gitignore` prevents dependencies, build output, and secrets from being committed.

## Libraries

Runtime dependencies:

- `express` - creates the HTTP server and routes.
- `mongoose` - connects Node.js to MongoDB and defines schemas/models.
- `jsonwebtoken` - creates and verifies JWT access tokens.
- `bcrypt` - hashes passwords before saving them.
- `dotenv` - loads environment variables from `.env`.
- `express-validator` - validates incoming request data.
- `helmet` - adds security-related HTTP headers.
- `cors` - allows the frontend to call the backend.
- `morgan` - logs HTTP requests during development.
- `cookie-parser` - reads cookies from incoming requests.

Development dependencies:

- `typescript` - adds static typing.
- `tsx` - runs TypeScript files directly during development.
- `nodemon` - restarts the server when files change, optional when using `tsx watch`.
- `eslint` - checks code quality.
- `typescript-eslint` - connects ESLint with TypeScript.
- `@types/*` packages - add TypeScript types for JavaScript libraries.

## Step-by-step Implementation

1. Initialize the package:

```bash
pnpm init
```

2. Install runtime dependencies:

```bash
pnpm add express mongoose jsonwebtoken bcrypt dotenv express-validator helmet cors morgan cookie-parser
```

3. Install development dependencies:

```bash
pnpm add -D typescript tsx nodemon eslint typescript-eslint @eslint/js globals @types/node @types/express @types/jsonwebtoken @types/bcrypt @types/cors @types/morgan @types/cookie-parser
```

4. Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": ".",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

5. Add scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/src/server.js",
    "typecheck": "tsc --noEmit",
    "lint": "eslint \"**/*.ts\""
  }
}
```

## Expected Result

The project can install dependencies, run TypeScript, build JavaScript output, and execute lint checks.

## Verification

Run:

```bash
pnpm typecheck
pnpm lint
```

Both commands should finish without errors.

## Common Mistakes

- Installing `express` but forgetting `@types/express`.
- Using `require()` in `.ts` files instead of `import`.
- Forgetting `"type": "module"` when using ES module imports.
- Using a TypeScript version that is too new for `typescript-eslint`.
- Committing `.env` or `node_modules`.

## Next Step

Create the backend folder structure.

---

# 2. Folder Structure

## Goal

Organize the backend so every file has a clear responsibility.

## Theory

A backend grows quickly. If all logic stays in one file, the project becomes hard to maintain. Separating files by responsibility makes the app easier to test, debug, and extend.

## Current Structure

```text
backend/
  src/
    config/
    controller/
    middleware/
    models/
    routes/
    services/
    types/
    utils/
    app.ts
    server.ts
  .env.example
  .gitignore
  eslint.config.js
  package.json
  pnpm-lock.yaml
  tsconfig.json
```

## Folder Purpose

`src/config/`

Stores configuration files such as environment variables and database connection.

`src/controller/`

Handles HTTP request and response logic. Controllers should not contain heavy business logic.

`src/middleware/`

Stores Express middleware such as authentication, error handling, validation handling, and role protection.

`src/models/`

Stores Mongoose schemas and models.

`src/routes/`

Defines API endpoints and connects them to controllers.

`src/services/`

Stores business logic, such as creating orders, calculating totals, or handling auth workflows.

`src/types/`

Stores custom TypeScript types and Express request extensions.

`src/utils/`

Stores reusable helpers such as token creation, async wrappers, API errors, and response helpers.

`src/app.ts`

Creates and configures the Express app.

`src/server.ts`

Connects to the database and starts listening on a port.

## Step-by-step Implementation

Create folders:

```bash
mkdir src
mkdir src/config src/controller src/middleware src/models src/routes src/services src/types src/utils
```

Create main files:

```bash
touch src/app.ts
touch src/server.ts
touch src/config/env.ts
touch src/config/db.ts
touch src/middleware/errorMiddleware.ts
```

On Windows PowerShell, use:

```powershell
New-Item -ItemType Directory -Path src, src/config, src/controller, src/middleware, src/models, src/routes, src/services, src/types, src/utils
New-Item -ItemType File -Path src/app.ts, src/server.ts, src/config/env.ts, src/config/db.ts, src/middleware/errorMiddleware.ts
```

## Expected Result

The backend has a scalable structure ready for authentication, products, categories, carts, orders, reviews, and admin features.

## Verification

Run:

```bash
Get-ChildItem -Recurse src
```

You should see all folders and starter files.

## Common Mistakes

- Naming `controllers` one way and importing `controller` somewhere else.
- Putting route logic directly inside `server.ts`.
- Mixing database connection code with Express middleware setup.

## Next Step

Configure environment variables.

---

# 3. Environment Configuration

## Goal

Load environment variables safely and consistently.

## Theory

Environment variables keep sensitive and environment-specific values outside the source code.

Examples:

- database URL
- JWT secret
- server port
- frontend URL
- production/development mode

Never commit a real `.env` file.

## Files

Create `.env.example`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_with_a_strong_secret
```

Create `src/config/env.ts`:

```ts
import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5000),
  mongoUri: process.env.MONGO_URI ?? '',
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET ?? '',
};
```

## Step-by-step Implementation

1. Create `.env.example`.
2. Copy `.env.example` to `.env`.
3. Replace placeholder values in `.env`.
4. Import `env` wherever configuration values are needed.

## Expected Result

The app reads configuration from `.env` without hardcoding secrets.

## Verification

Temporarily log one safe value:

```ts
console.log(env.nodeEnv);
```

Do not log secrets like `JWT_SECRET`.

## Common Mistakes

- Forgetting to call `dotenv.config()`.
- Using `process.env.PORT` directly everywhere.
- Committing `.env`.
- Using an empty `JWT_SECRET` in production.

## Next Step

Connect MongoDB.

---

# 4. MongoDB and Mongoose

## Goal

Connect the backend to MongoDB using Mongoose.

## Theory

MongoDB stores documents in collections. Mongoose adds schemas, validation, model methods, and a cleaner API for querying MongoDB from Node.js.

In this e-commerce project, expected collections include:

- users
- products
- categories
- orders
- carts
- wishlists
- reviews

## File

Create `src/config/db.ts`:

```ts
import mongoose from 'mongoose';

import { env } from './env.js';

export const connectDB = async (): Promise<void> => {
  if (!env.mongoUri) {
    throw new Error('MONGO_URI is required');
  }

  await mongoose.connect(env.mongoUri);
  console.log('MongoDB connected');
};
```

## Step-by-step Implementation

1. Import `mongoose`.
2. Import `env`.
3. Check that `MONGO_URI` exists.
4. Call `mongoose.connect(env.mongoUri)`.
5. Call `connectDB()` before starting the server.

## Expected Result

The server starts only after MongoDB connects successfully.

## Verification

Run:

```bash
pnpm dev
```

Expected terminal output:

```text
MongoDB connected
Server is running on port 5000
```

## Common Mistakes

- Running the server without MongoDB running locally.
- Using the wrong database URL.
- Forgetting to whitelist your IP address in MongoDB Atlas.
- Starting `app.listen()` before connecting to the database.

## Next Step

Initialize Express middleware.

---

# 5. Express App Initialization

## Goal

Create the Express app and initialize the common middleware libraries.

## Theory

Middleware runs between the incoming request and the final route handler.

Common middleware:

- `helmet()` improves security headers.
- `cors()` allows frontend requests.
- `morgan()` logs requests.
- `express.json()` parses JSON request bodies.
- `express.urlencoded()` parses form-like request bodies.
- `cookieParser()` parses cookies.

## File

Create `src/app.ts`:

```ts
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

app.use(notFoundHandler);
app.use(errorHandler);
```

## Step-by-step Implementation

1. Import the installed middleware.
2. Create `app` with `express()`.
3. Register global middleware before routes.
4. Add a health-check route.
5. Register 404 and error middleware after routes.

## Expected Result

The backend has a working Express app with security, CORS, logging, request body parsing, cookies, and health check.

## Verification

Start the server and open:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is running"
}
```

## Common Mistakes

- Writing `app.use(cors)` instead of `app.use(cors())`.
- Placing the error handler before routes.
- Forgetting `credentials: true` if cookies will be used.
- Allowing every origin in production without thinking about security.

## Next Step

Create the server entry file.

---

# 6. Server Entry File

## Goal

Start the backend in one place.

## Theory

`app.ts` should configure Express. `server.ts` should start the application.

This separation is useful because later you can test `app` without starting a real server.

## File

Create `src/server.ts`:

```ts
import { app } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(`Server is running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

void startServer();
```

## Step-by-step Implementation

1. Import `app`.
2. Import `connectDB`.
3. Import `env`.
4. Create an async `startServer` function.
5. Connect to MongoDB.
6. Start listening on the configured port.
7. Exit the process if startup fails.

## Expected Result

The server startup flow is clear and easy to debug.

## Verification

Run:

```bash
pnpm dev
```

## Common Mistakes

- Starting the server before the database connection.
- Ignoring startup errors.
- Hardcoding the port in multiple files.

## Next Step

Create global error handling.

---

# 7. Error Handling

## Goal

Return consistent error responses from the API.

## Theory

Without global error handling, every controller must manually handle errors. A global error handler makes the API more predictable.

Express error middleware has four parameters:

```ts
(err, req, res, next)
```

Even if `next` is unused, it is required so Express recognizes the function as error middleware.

## File

Create `src/middleware/errorMiddleware.ts`:

```ts
import type { ErrorRequestHandler, RequestHandler } from 'express';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  next(error);
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err instanceof Error ? err.message : 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
  });
};
```

## Step-by-step Implementation

1. Create a `notFoundHandler`.
2. Create an `errorHandler`.
3. Add both at the bottom of `src/app.ts`.
4. Make sure routes are registered before these handlers.

## Expected Result

Unknown routes and thrown errors return JSON responses.

## Verification

Visit:

```text
http://localhost:5000/not-existing-route
```

Expected response:

```json
{
  "success": false,
  "message": "Route not found: GET /not-existing-route"
}
```

## Common Mistakes

- Putting the error handler above routes.
- Forgetting the fourth `_next` parameter.
- Returning HTML errors instead of JSON.

## Next Step

Create models for the e-commerce domain.

---

# 8. Database Models

## Goal

Define the MongoDB collections for the e-commerce app.

## Theory

Each Mongoose model usually represents one MongoDB collection. A schema defines the shape and validation rules for documents.

## Main Collections

### Users

Purpose:

Store customer and admin accounts.

Important fields:

- `name`
- `email`
- `password`
- `role`
- `avatar`
- `addresses`
- `createdAt`
- `updatedAt`

Relationships:

- user can own orders
- user can own cart
- user can own wishlist
- user can write reviews

### Products

Purpose:

Store items available for purchase.

Important fields:

- `title`
- `description`
- `price`
- `discountPrice`
- `stock`
- `images`
- `category`
- `brand`
- `rating`
- `numReviews`

Relationships:

- product belongs to category
- product can have many reviews
- product can appear in carts and orders

### Categories

Purpose:

Group products.

Important fields:

- `name`
- `slug`
- `description`
- `image`

Relationships:

- category has many products

### Orders

Purpose:

Store purchase history.

Important fields:

- `user`
- `items`
- `shippingAddress`
- `paymentMethod`
- `itemsPrice`
- `shippingPrice`
- `taxPrice`
- `totalPrice`
- `status`
- `paidAt`
- `deliveredAt`

Relationships:

- order belongs to user
- order contains products

### Cart

Purpose:

Store products the user plans to buy.

Important fields:

- `user`
- `items`
- `product`
- `quantity`

Relationships:

- cart belongs to user
- cart contains products

### Wishlist

Purpose:

Store products the user wants to save.

Important fields:

- `user`
- `products`

Relationships:

- wishlist belongs to user
- wishlist contains products

### Reviews

Purpose:

Store product ratings and comments.

Important fields:

- `user`
- `product`
- `rating`
- `comment`

Relationships:

- review belongs to user
- review belongs to product

## Step-by-step Implementation

Recommended order:

1. Create `User` model.
2. Create `Category` model.
3. Create `Product` model.
4. Create `Review` model.
5. Create `Cart` model.
6. Create `Order` model.
7. Create `Wishlist` model.

## Expected Result

The backend has typed Mongoose models that represent the e-commerce database.

## Verification

Run:

```bash
pnpm typecheck
```

## Common Mistakes

- Storing plain product data in orders without also storing enough historical price information.
- Forgetting indexes for fields like `email` and `slug`.
- Saving passwords without hashing.
- Using `String` values for references instead of `Schema.Types.ObjectId`.

## Next Step

Implement authentication.

---

# 9. Authentication

## Goal

Allow users to register, log in, and access protected routes.

## Theory

Authentication answers: "Who is this user?"

Authorization answers: "What is this user allowed to do?"

This project should use:

- `bcrypt` to hash passwords
- `jsonwebtoken` to create JWTs
- auth middleware to protect routes
- role middleware for admin-only features

## Main Endpoints

### Register

```text
POST /api/auth/register
```

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

Response:

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

### Login

```text
POST /api/auth/login
```

Request:

```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

Response:

```json
{
  "success": true,
  "token": "jwt_token_here"
}
```

### Profile

```text
GET /api/auth/me
```

Protected:

Yes.

Response:

```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

## Step-by-step Implementation

1. Create `User` model.
2. Create password hashing before saving.
3. Create a password comparison method.
4. Create JWT utility.
5. Create auth controller.
6. Create auth routes.
7. Create protect middleware.
8. Create role middleware.
9. Register auth routes in `src/app.ts`.

## Expected Result

Users can create accounts, log in, and access protected endpoints.

## Verification

Use Postman, Thunder Client, Insomnia, or curl.

Register:

```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"Password123!\"}"
```

## Common Mistakes

- Returning the hashed password in API responses.
- Using a weak JWT secret.
- Not checking whether an email already exists.
- Saving plain text passwords.
- Forgetting to handle invalid tokens.

## Next Step

Implement product and category endpoints.

---

# 10. REST API Plan

## Goal

Define the API endpoints before implementing all controllers.

## Theory

Good API planning prevents inconsistent route names and response formats.

Use this pattern:

```text
/api/resource
/api/resource/:id
```

## Auth Routes

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout
```

## User Routes

```text
GET    /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

Admin-only except profile-related actions.

## Category Routes

```text
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

Create, update, and delete should be admin-only.

## Product Routes

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id
```

Create, update, and delete should be admin-only.

## Cart Routes

```text
GET    /api/cart
POST   /api/cart/items
PATCH  /api/cart/items/:productId
DELETE /api/cart/items/:productId
DELETE /api/cart
```

Protected routes.

## Wishlist Routes

```text
GET    /api/wishlist
POST   /api/wishlist/:productId
DELETE /api/wishlist/:productId
```

Protected routes.

## Review Routes

```text
POST   /api/products/:productId/reviews
PATCH  /api/reviews/:id
DELETE /api/reviews/:id
```

Protected routes.

## Order Routes

```text
POST   /api/orders
GET    /api/orders/my
GET    /api/orders/:id
PATCH  /api/orders/:id/pay
PATCH  /api/orders/:id/deliver
PATCH  /api/orders/:id/status
```

Some routes are user-only, some are admin-only.

## Expected Result

The API has a clear map before implementation begins.

## Verification

Create a checklist and mark each endpoint after it works in Postman or Thunder Client.

## Common Mistakes

- Mixing plural and singular route names.
- Returning different response shapes from different controllers.
- Not protecting user-specific routes.
- Allowing non-admin users to create products or categories.

## Next Step

Add validation.

---

# 11. Validation

## Goal

Validate all incoming request data before it reaches controllers.

## Theory

Validation protects the API from bad or unsafe input.

Examples:

- email must be valid
- password must be strong enough
- price must be positive
- quantity must be an integer
- MongoDB IDs must be valid

## Library

Use `express-validator`.

## Step-by-step Implementation

1. Create validation arrays for each route.
2. Create validation result middleware.
3. Add validators before controllers.

Example:

```ts
import { body, validationResult } from 'express-validator';
import type { RequestHandler } from 'express';

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

export const validate: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }

  next();
};
```

## Expected Result

Invalid requests return clear `400 Bad Request` responses.

## Verification

Send a register request without email. The server should reject it.

## Common Mistakes

- Validating in controllers instead of middleware.
- Returning only a generic "Invalid input" message.
- Forgetting to validate route params like `:id`.

## Next Step

Implement controllers and services.

---

# 12. Controllers and Services

## Goal

Separate HTTP logic from business logic.

## Theory

Controllers should handle:

- request data
- response status codes
- response JSON

Services should handle:

- database operations
- business decisions
- reusable workflows

## Example Flow

Route:

```ts
router.post('/register', registerValidator, validate, registerUser);
```

Controller:

```ts
export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
```

Service:

```ts
export const authService = {
  async register(input: RegisterInput) {
    // check existing email
    // hash password
    // create user
    // return safe user data
  },
};
```

## Expected Result

The backend is easier to test and maintain.

## Verification

Controllers should stay small. If a controller becomes very long, move logic into a service.

## Common Mistakes

- Putting all logic inside route files.
- Querying the database directly from every controller.
- Returning Mongoose documents with sensitive fields.

## Next Step

Add deployment preparation.

---

# 13. Deployment Preparation

## Goal

Prepare the backend for hosting on Render, Railway, or another Node.js hosting service.

## Theory

Production hosting requires:

- environment variables configured in the host dashboard
- MongoDB Atlas connection string
- build command
- start command
- correct port handling
- no local-only secrets

## Build and Start

Build command:

```bash
pnpm build
```

Start command:

```bash
pnpm start
```

## Required Environment Variables

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://...
CLIENT_URL=https://your-frontend-domain.com
JWT_SECRET=your_strong_production_secret
```

## Step-by-step Deployment

1. Create a MongoDB Atlas database.
2. Create a database user.
3. Whitelist the deployment provider IPs or allow access from anywhere if appropriate for a learning project.
4. Copy the MongoDB connection string.
5. Create a backend service on Render or Railway.
6. Set the build command to `pnpm build`.
7. Set the start command to `pnpm start`.
8. Add environment variables.
9. Deploy.
10. Test `/api/health`.

## Expected Result

The backend runs online and can connect to MongoDB Atlas.

## Verification

Open:

```text
https://your-backend-domain.com/api/health
```

## Common Mistakes

- Forgetting production environment variables.
- Using localhost MongoDB in production.
- Not setting `CLIENT_URL` to the deployed frontend URL.
- Forgetting to run `pnpm build` before `pnpm start`.

## Next Step

Start implementing authentication models, routes, controllers, services, and middleware.

---

# Backend Progress Checklist

- [x] Install backend dependencies
- [x] Install TypeScript and ESLint tooling
- [x] Create `.gitignore`
- [x] Create `.env.example`
- [x] Create `tsconfig.json`
- [x] Create `eslint.config.js`
- [x] Add development/build/typecheck/lint scripts
- [x] Create backend folder structure
- [x] Create Express app
- [x] Initialize middleware
- [x] Connect MongoDB setup file
- [x] Create server entry file
- [x] Add global error middleware
- [x] Create User model
- [ ] Create Auth routes
- [ ] Create Auth controller
- [ ] Create Auth service
- [ ] Create JWT utility
- [ ] Create auth middleware
- [x] Create Category model
- [ ] Create Category routes
- [x] Create Product model
- [ ] Create Product routes
- [x] Create Cart model
- [ ] Create Cart routes
- [x] Create Order model
- [ ] Create Order routes
- [x] Create Review model
- [ ] Create Review routes
- [x] Create Wishlist model
- [ ] Create Wishlist routes
- [ ] Add deployment configuration
