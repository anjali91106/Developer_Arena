# BlogSpace - Full-Stack Blogging Platform

A modern, production-ready full-stack blogging platform built with React, Node.js, Express, and MongoDB. Features user authentication, CRUD operations for blog posts, nested comments, and a beautiful responsive UI with Tailwind CSS.

## Features

### Authentication
- User registration and login
- JWT-based authentication with access & refresh tokens
- Protected routes and middleware
- Automatic token refresh
- Secure password hashing with bcrypt

### Blog Features
- Create, read, update, and delete posts
- Rich text content support
- Tag system for categorization
- Like/unlike posts
- Search functionality with pagination
- User profiles and post management

### Comments System
- Add comments to posts
- Nested replies (threaded comments)
- Edit and delete own comments
- Real-time comment updates

### User Interface
- Modern, responsive design with Tailwind CSS
- Soft, girly theme with pink and purple gradients
- Toast notifications for user feedback
- Loading states and skeleton UI
- Mobile-friendly navigation
- Search functionality

## Tech Stack

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Utility-first CSS framework
- **Create React App** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **cookie-parser** - Cookie handling
- **CORS** - Cross-origin resource sharing

## Project Structure

```
blog-platform/
|-- backend/
|   |-- controllers/
|   |   |-- authController.js
|   |   |-- postController.js
|   |   |-- commentController.js
|   |   |-- userController.js
|   |-- models/
|   |   |-- User.js
|   |   |-- Post.js
|   |   |-- Comment.js
|   |-- routes/
|   |   |-- auth.js
|   |   |-- posts.js
|   |   |-- comments.js
|   |   |-- users.js
|   |-- middlewares/
|   |   |-- auth.js
|   |-- utils/
|   |   |-- generateTokens.js
|   |-- config/
|   |-- .env
|   |-- index.js
|   |-- package.json
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |   |-- Navbar.jsx
|   |   |   |-- Footer.jsx
|   |   |   |-- PostCard.jsx
|   |   |   |-- Comment.jsx
|   |   |   |-- ProtectedRoute.jsx
|   |   |   |-- Toast.jsx
|   |   |-- pages/
|   |   |   |-- Home.jsx
|   |   |   |-- Login.jsx
|   |   |   |-- Register.jsx
|   |   |   |-- Dashboard.jsx
|   |   |   |-- CreatePost.jsx
|   |   |   |-- EditPost.jsx
|   |   |   |-- PostDetail.jsx
|   |   |   |-- Profile.jsx
|   |   |   |-- Settings.jsx
|   |   |-- redux/
|   |   |   |-- store.js
|   |   |   |-- slices/
|   |   |   |   |-- authSlice.js
|   |   |   |   |-- postsSlice.js
|   |   |   |   |-- commentsSlice.js
|   |   |   |   |-- uiSlice.js
|   |   |-- services/
|   |   |   |-- api.js
|   |   |   |-- authService.js
|   |   |   |-- postService.js
|   |   |   |-- commentService.js
|   |   |-- hooks/
|   |   |   |-- useAuth.js
|   |   |-- App.tsx
|   |   |-- index.css
|   |-- package.json
|   |-- tailwind.config.js
|   |-- postcss.config.js
|
|-- README.md
```

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd blog-platform
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd backend
```

#### Install dependencies
```bash
npm install
```

#### Set up environment variables
Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog-platform
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
NODE_ENV=development
```

#### Start the backend server
```bash
npm run dev
```

The backend will be running on `http://localhost:5000`

### 3. Frontend Setup

#### Navigate to frontend directory
```bash
cd ../frontend
```

#### Install dependencies
```bash
npm install
```

#### Start the frontend development server
```bash
npm start
```

The frontend will be running on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Posts
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/search` - Search posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (protected)
- `PUT /api/posts/:id` - Update post (protected, author only)
- `DELETE /api/posts/:id` - Delete post (protected, author only)
- `POST /api/posts/:id/like` - Toggle like on post (protected)

### Comments
- `GET /api/comments/post/:postId` - Get comments for a post
- `POST /api/comments/post/:postId` - Add comment to post (protected)
- `PUT /api/comments/:commentId` - Update comment (protected, author only)
- `DELETE /api/comments/:commentId` - Delete comment (protected, author only)

### Users
- `GET /api/users/:userId` - Get user profile
- `GET /api/users/:userId/posts` - Get user's posts
- `GET /api/users/profile/current` - Get current user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

## Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  bio: String (optional),
  avatar: String (optional),
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Post Model
```javascript
{
  title: String (required),
  content: String (required),
  author: ObjectId (ref: 'User', required),
  tags: [String],
  likes: [ObjectId (ref: 'User')],
  likeCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model
```javascript
{
  content: String (required),
  author: ObjectId (ref: 'User', required),
  post: ObjectId (ref: 'Post', required),
  parentComment: ObjectId (ref: 'Comment', nullable),
  replies: [ObjectId (ref: 'Comment')],
  createdAt: Date,
  updatedAt: Date
}
```

## Usage

### 1. User Registration
- Navigate to `/register`
- Fill in username, email, and password
- Click "Create Account"

### 2. Login
- Navigate to `/login`
- Enter your credentials
- Click "Sign In"

### 3. Create a Post
- After login, click "Write Post" in navigation
- Fill in title, content, and optional tags
- Click "Publish Post"

### 4. Interact with Posts
- Like posts by clicking the heart icon
- Add comments to engage with authors
- Reply to comments for threaded discussions

### 5. Manage Your Content
- Visit `/dashboard` to see your posts
- Edit or delete your own posts
- Update your profile in `/settings`

## Deployment

### Backend Deployment (Render/Heroku)
1. Set environment variables in your hosting platform
2. Update MongoDB URI to production database
3. Set `NODE_ENV=production`
4. Deploy the backend application

### Frontend Deployment (Netlify/Vercel)
1. Set API base URL to your deployed backend
2. Build the application: `npm run build`
3. Deploy the build folder

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/blog-platform
JWT_SECRET=production-jwt-secret-key
JWT_REFRESH_SECRET=production-refresh-secret-key
FRONTEND_URL=https://yourdomain.com
```

## Security Features

- Password hashing with bcrypt
- JWT tokens with expiration
- HTTP-only cookies for refresh tokens
- CORS protection
- Input validation and sanitization
- Protected routes with middleware
- Rate limiting (recommended for production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **CORS Errors**
   - Ensure frontend URL is in CORS whitelist
   - Check API base URL configuration

3. **Authentication Issues**
   - Clear browser cookies and localStorage
   - Check JWT secrets are the same in frontend/backend
   - Verify token expiration times

4. **Build Errors**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again
   - Check Node.js version compatibility

## Future Enhancements

- Image upload for posts and avatars
- Email notifications
- Social media sharing
- Advanced search with filters
- User roles and permissions
- Analytics dashboard
- Dark mode toggle
- Rich text editor
- Post scheduling
- Bookmark/favorites feature

## Support

For support and questions, please open an issue on the GitHub repository or contact the development team.
