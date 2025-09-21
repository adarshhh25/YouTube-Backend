# YouTube-Like Backend API

This repository contains the backend for a YouTube-like application, built with Node.js, Express, and MongoDB. It provides RESTful APIs for user management, video uploads, comments, likes, and more.

## Features

- **User Authentication:** Register, login, and manage user profiles securely.
- **Video Management:** Upload, update, delete, and fetch videos.
- **Comments & Likes:** Add comments and likes to videos.
- **Subscriptions:** Subscribe/unsubscribe to channels.
- **Search & Filtering:** Search videos and filter by categories.
- **Robust Error Handling:** Consistent and informative error responses.

## Technologies Used

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT for authentication
- Multer for file uploads

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/youtube-backend.git
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file and add your configuration:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the server:
   ```
   npm start
   ```

## API Endpoints

| Method | Endpoint                | Description                |
|--------|------------------------|----------------------------|
| POST   | `/api/auth/register`   | Register a new user        |
| POST   | `/api/auth/login`      | Login and get JWT token    |
| GET    | `/api/videos`          | Get all videos             |
| POST   | `/api/videos`          | Upload a new video         |
| PUT    | `/api/videos/:id`      | Update a video             |
| DELETE | `/api/videos/:id`      | Delete a video             |
| POST   | `/api/comments/:id`    | Add comment to a video     |
| POST   | `/api/likes/:id`       | Like a video               |
| POST   | `/api/subscribe/:id`   | Subscribe to a channel     |

## Folder Structure

```
src/
  controllers/
  models/
  routes/
  middleware/
  utils/
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.

---

**Note:** This backend is designed to be used with a separate frontend client.