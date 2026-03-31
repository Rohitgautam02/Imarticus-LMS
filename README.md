# Imarticus LMS - Learning Management System

A full-stack Learning Management System built with Node.js, Express, and MongoDB.

## Features

- User authentication (register, login, JWT)
- Course browsing with video player
- Curriculum with expandable modules and lessons
- Document upload and AI-powered summarisation (Google Gemini)
- Razorpay payment integration (test mode)

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **AI**: Google Gemini API (gemini-1.5-flash)
- **Payment**: Razorpay Checkout

## Setup

1. Clone the repository
2. Navigate to the backend folder:
   ```
   cd part1-lms/backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Copy `.env.example` to `.env` and fill in your values:
   - `MONGO_URI` - MongoDB Atlas connection string
   - `JWT_SECRET` - Any random string for JWT signing
   - `GEMINI_API_KEY` - Google AI Studio API key
   - `RAZORPAY_KEY_ID` - Razorpay test mode key
   - `RAZORPAY_KEY_SECRET` - Razorpay test mode secret

5. Seed the database with sample data:
   ```
   npm run seed
   ```

6. Start the server:
   ```
   npm start
   ```

7. Open http://localhost:5000 in your browser

## Project Structure

```
part1-lms/
  backend/
    config/       - Database connection
    middleware/   - JWT auth middleware
    models/       - Mongoose schemas
    routes/       - API routes
    uploads/      - Uploaded documents
    server.js     - Express app entry point
    seed.js       - Database seed script
  frontend/
    css/          - Stylesheets
    js/           - Client-side JavaScript
    *.html        - HTML pages

part3-landing/    - ISFB course page clone (static)
```

## API Endpoints

### Auth
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

### Courses
- GET `/api/courses` - List all courses
- GET `/api/courses/:id` - Get course details
- POST `/api/courses` - Create course (admin only)

### Documents
- POST `/api/documents/upload` - Upload document
- POST `/api/documents/:id/summarise` - AI summarise
- GET `/api/documents` - List user documents

### Payment
- POST `/api/payment/create-order` - Create Razorpay order
- POST `/api/payment/verify` - Verify payment
- GET `/api/payment/status` - Check payment status

## Default Admin Credentials
- Email: admin@imarticus.com
- Password: admin123
