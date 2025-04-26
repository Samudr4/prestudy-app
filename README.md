# PreStudy App

A mobile application for students to prepare for various competitive exams and courses.

## Features

- User authentication with phone number and OTP
- Browse exam and course categories
- Take quizzes and track progress
- View leaderboards and rankings
- Profile management
- Payment integration for premium content

## Tech Stack

- **Frontend**: React Native with Expo, TypeScript
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: Firebase (for production)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Expo CLI
- MongoDB (installed locally or MongoDB Atlas account)
- Postman (for API testing)

### Frontend Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure the backend API URL:
   Edit `app/config.js` to update the IP address to your local machine's IP if testing on physical device.

3. Start the development server:
   ```
   npm start
   ```

4. Test on devices:
   - Scan the QR code with Expo Go app on your phone
   - Press 'a' for Android emulator
   - Press 'i' for iOS simulator
   - Press 'w' for web browser

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd ../prestudy-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment:
   ```
   npm run setup
   ```

4. Clean the database (to remove any test data):
   ```
   npm run clean-db
   ```

5. Start the server:
   ```
   npm run dev
   ```

## Production Setup

For a clean production-ready setup:

1. Backend:
   ```
   cd prestudy-backend
   npm run reset-to-production
   ```

2. Frontend:
   ```
   cd app_v1.2
   npm start
   ```

3. Set `isProduction` to `true` in `app/config.js` when deploying to production, and update the `PRODUCTION_API_URL` to your actual API URL.

## Adding Real Data

After cleaning the database, you'll need to add real data using Postman:

1. Login via the app to get an authentication token

2. Create categories:
   ```
   POST http://localhost:3000/api/category
   Headers: 
   - Authorization: Bearer YOUR_TOKEN
   - Content-Type: application/json
   
   Body:
   {
     "name": "Category Name",
     "type": "exam", // or "course"
     "description": "Category description",
     "image": "https://example.com/image.jpg",
     "order": 1
   }
   ```

3. Create quizzes:
   ```
   POST http://localhost:3000/api/category/CATEGORY_ID/quizzes
   Headers:
   - Authorization: Bearer YOUR_TOKEN
   - Content-Type: application/json
   
   Body:
   {
     "name": "Quiz Name",
     "description": "Quiz description",
     "duration": 30,
     "totalQuestions": 10,
     "questions": [
       {
         "text": "Question text",
         "options": [
           {"id": "A", "text": "Option A"},
           {"id": "B", "text": "Option B"},
           {"id": "C", "text": "Option C"},
           {"id": "D", "text": "Option D"}
         ],
         "correctOptionId": "A",
         "explanation": "Explanation text"
       }
       // Add more questions...
     ],
     "price": 0, // or any price value
     "isLocked": false // or true for premium content
   }
   ```

## Folder Structure

- `/app`: React Native application screens and components
- `/app/(tabs)`: Bottom tab navigation screens
- `/assets`: Images, icons, and other static assets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

This project is licensed under the ISC License.
