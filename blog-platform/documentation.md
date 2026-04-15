# BlogSpace - Technical Documentation

## 📋 Table of Contents

1. [Full Stack Architecture](#full-stack-architecture)
2. [Authentication Flow](#authentication-flow)
3. [Frontend-Backend Communication](#frontend-backend-communication)
4. [State Management](#state-management)
5. [Deployment Strategy](#deployment-strategy)

---

## 🏗️ Full Stack Architecture

### Technology Stack Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    BLOGSPACE ARCHITECTURE              │
├─────────────────────────────────────────────────────────────┤
│                                                     │
│  FRONTEND (React)           │  BACKEND (Node.js)   │
│  ┌─────────────────┐        │  ┌─────────────────┐   │
│  │ React 18      │        │  │ Express.js     │   │
│  │ Redux Toolkit   │◄─────►│  │ MongoDB        │   │
│  │ Tailwind CSS   │        │  │ JWT Auth       │   │
│  │ Axios          │        │  │ REST API       │   │
│  └─────────────────┘        │  └─────────────────┘   │
│                              │                        │
│  DEPLOYMENT                   │  DEPLOYMENT            │
│  ┌─────────────────┐        │  ┌─────────────────┐   │
│  │ Vercel         │        │  │ Render          │   │
│  │ Static Build   │        │  │ Serverless     │   │
│  │ CDN Distribution│        │  │ Auto-scaling   │   │
│  └─────────────────┘        │  └─────────────────┘   │
│                              │                        │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture

**Core Technologies:**
- **React 18**: Component-based UI library with hooks and concurrent features
- **Redux Toolkit**: State management with immutable updates and middleware
- **React Router v6**: Client-side routing with protected routes
- **Axios**: HTTP client with interceptors for authentication
- **Tailwind CSS**: Utility-first CSS framework with responsive design

**Component Structure:**
```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx       # Navigation with auth state
│   ├── Footer.jsx       # Site footer
│   ├── PostCard.jsx     # Post preview card
│   ├── Comment.jsx      # Nested comment component
│   ├── BackButton.jsx    # Navigation helper
│   ├── ProtectedRoute.jsx # Route guard
│   └── Toast.jsx        # Notification system
├── pages/              # Route components
│   ├── Home.jsx         # Public post feed
│   ├── Login.jsx        # Authentication
│   ├── Register.jsx     # User registration
│   ├── Dashboard.jsx    # User post management
│   ├── CreatePost.jsx   # Content creation
│   ├── EditPost.jsx     # Content editing
│   ├── PostDetail.jsx   # Single post view
│   ├── Profile.jsx       # User profiles
│   ├── Settings.jsx     # User preferences
│   └── About.jsx        # Platform info
├── redux/              # State management
│   ├── store.js         # Redux store configuration
│   └── slices/          # Redux Toolkit slices
│       ├── authSlice.js   # Authentication state
│       ├── postsSlice.js  # Posts and pagination
│       ├── commentsSlice.js # Comments and replies
│       └── uiSlice.js     # UI state (loading, etc.)
└── services/           # API communication
    ├── api.js          # Axios configuration
    ├── authService.js   # Auth API calls
    ├── postService.js   # Post API calls
    └── commentService.js # Comment API calls
```

### Backend Architecture

**Core Technologies:**
- **Node.js**: JavaScript runtime with ES6+ support
- **Express.js**: Web framework with middleware support
- **MongoDB**: NoSQL document database
- **Mongoose**: Object Data Modeling (ODM) for MongoDB
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing and comparison

**Server Structure:**
```
backend/
├── controllers/         # Business logic handlers
│   ├── authController.js    # User authentication
│   ├── postController.js    # Post CRUD operations
│   ├── commentController.js # Comment management
│   └── userController.js   # User profile management
├── models/             # Database schemas
│   ├── User.js           # User data model
│   ├── Post.js           # Post data model
│   └── Comment.js        # Comment data model
├── routes/             # API endpoints
│   ├── auth.js           # Authentication routes
│   ├── posts.js          # Post CRUD routes
│   ├── comments.js       # Comment routes
│   └── users.js          # User profile routes
├── middlewares/        # Custom middleware
│   └── auth.js           # JWT verification
├── utils/              # Helper functions
│   └── generateTokens.js  # JWT creation
├── scripts/            # Database utilities
│   └── seed.js           # Sample data generation
└── config/             # Environment configuration
    └── .env             # Environment variables
```

---

## 🔐 Authentication Flow

### JWT-Based Authentication System

**Token Strategy:**
- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) for token renewal
- **Storage**: Access token in localStorage, refresh token in HTTP-only cookie

### Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                AUTHENTICATION FLOW                │
├─────────────────────────────────────────────────────────────┤
│                                                     │
│  1. USER LOGIN/REGISTER                          │
│     ┌─────────────────┐                           │
│     │ Credentials     │                           │
│     │ Email/Password  │                           │
│     └─────────────────┘                           │
│               │                                   │
│               ▼                                   │
│  2. BACKEND VALIDATION                           │
│     ┌─────────────────┐                           │
│     │ Check User      │                           │
│     │ Hash Password    │                           │
│     │ Create JWTs      │                           │
│     └─────────────────┘                           │
│               │                                   │
│               ▼                                   │
│  3. TOKEN RESPONSE                              │
│     ┌─────────────────┐        ┌─────────────────┐ │
│     │ Access Token    │        │ Refresh Token   │ │
│     │ (15 min)       │        │ (7 days)       │ │
│     │ localStorage     │        │ HTTP-Only       │ │
│     └─────────────────┘        │ Cookie          │ │
│                                └─────────────────┘ │
│                                                     │
│  4. API REQUESTS WITH TOKENS                    │
│     ┌─────────────────────────────────────────────┐   │
│     │ Authorization: Bearer <access_token>     │   │
│     │ Cookie: refresh_token=<refresh_token>     │   │
│     └─────────────────────────────────────────────┘   │
│               │                                   │
│               ▼                                   │
│  5. TOKEN REFRESH (WHEN NEEDED)                │
│     ┌─────────────────┐                           │
│     │ Auto Refresh    │                           │
│     │ New Access      │                           │
│     │ Token           │                           │
│     └─────────────────┘                           │
│                                                     │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Implementation

**Frontend:**
```javascript
// Login Request
const loginResponse = await authService.login(credentials);
localStorage.setItem('accessToken', loginResponse.data.accessToken);

// Axios Interceptor for Automatic Token Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Auto-refresh token on 401
      const newToken = await authService.refreshToken();
      localStorage.setItem('accessToken', newToken.data.accessToken);
      
      // Retry original request with new token
      error.config.headers.Authorization = `Bearer ${newToken.data.accessToken}`;
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

**Backend:**
```javascript
// JWT Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
```

---

## 🌐 Frontend-Backend Communication

### API Communication Architecture

**HTTP Client Configuration:**
```javascript
// Axios Instance with Base Configuration
const api = axios.create({
  baseURL: 'https://blogspace-fzlh.onrender.com/api',
  withCredentials: true, // For refresh token cookie
  timeout: 10000,
});

// Request Interceptor - Add Access Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor - Handle Token Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const newToken = await authService.refreshToken();
      error.config.headers.Authorization = `Bearer ${newToken.data.accessToken}`;
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

### API Endpoints Structure

**Authentication Endpoints:**
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/refresh-token # Token refresh
POST /api/auth/logout       # User logout
```

**Post Management Endpoints:**
```
GET    /api/posts              # Get all posts (paginated)
GET    /api/posts/search       # Search posts
GET    /api/posts/:id          # Get single post
POST   /api/posts              # Create post (protected)
PUT    /api/posts/:id          # Update post (protected)
DELETE /api/posts/:id          # Delete post (protected)
POST   /api/posts/:id/like     # Toggle like (protected)
```

**Comment System Endpoints:**
```
GET    /api/comments/post/:postId    # Get post comments
POST   /api/comments/post/:postId    # Add comment (protected)
PUT    /api/comments/:commentId   # Update comment (protected)
DELETE /api/comments/:commentId   # Delete comment (protected)
```

**User Management Endpoints:**
```
GET    /api/users/:userId           # Get user profile
GET    /api/users/:userId/posts      # Get user's posts
GET    /api/users/profile/current   # Get current user (protected)
PUT    /api/users/profile          # Update profile (protected)
```

### CORS Configuration

**Backend CORS Setup:**
```javascript
app.use(cors({
  origin: ['https://developer-arena.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
}));
```

---

## 🔄 State Management

### Redux Toolkit Architecture

**Store Configuration:**
```javascript
// Redux Store Setup
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,      // User authentication state
    posts: postsSlice.reducer,    // Posts and pagination
    comments: commentsSlice.reducer, // Comments and replies
    ui: uiSlice.reducer,        // Loading states, modals
  },
  middleware: [thunkMiddleware], // Async action handling
});
```

### Authentication State (authSlice)

```javascript
const initialState = {
  user: null,              // Current user object
  accessToken: null,         // JWT access token
  isAuthenticated: false,   // Auth status
  loading: false,          // Loading states
  error: null              // Error messages
};

// Actions: login, logout, register, refreshToken, updateUser
```

### Posts State (postsSlice)

```javascript
const initialState = {
  posts: [],               // All posts array
  currentPost: null,        // Single post for detail view
  pagination: {             // Pagination metadata
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  loading: false,          // Loading states
  error: null,             // Error messages
  searchResults: [],        // Search results
  searchLoading: false       // Search loading state
};

// Async Thunks: fetchPosts, createPost, updatePost, deletePost, toggleLike, searchPosts
```

### Comments State (commentsSlice)

```javascript
const initialState = {
  comments: [],            // Comments for current post
  loading: false,          // Loading states
  error: null,             // Error messages
  pagination: {            // Comment pagination
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false
  }
};

// Async Thunks: fetchComments, addComment, updateComment, deleteComment
```

### State Flow Examples

**Post Creation Flow:**
```javascript
// Component dispatches async thunk
dispatch(createPost(postData));

// Thunk handles async operation
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await postService.createPost(postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Slice handles state updates
.addCase(createPost.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(createPost.fulfilled, (state, action) => {
  state.loading = false;
  state.posts.unshift(action.payload.post); // Optimistic update
})
.addCase(createPost.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});
```

---

## 🚀 Deployment Strategy

### Frontend Deployment (Vercel)

**Platform Choice: Vercel**
- **Zero-config deployment** with Git integration
- **Automatic HTTPS** and CDN distribution
- **Serverless functions** for backend communication
- **Global edge network** for fast loading

**Deployment Process:**
```bash
# 1. Build for production
npm run build

# 2. Deploy to Vercel
vercel --prod

# 3. Environment variables (Vercel Dashboard)
REACT_APP_API_URL=https://blogspace-fzlh.onrender.com/api
```

**Vercel Configuration:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html",
      "headers": {
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff"
      }
    }
  ]
}
```

### Backend Deployment (Render)

**Platform Choice: Render**
- **Free tier** with auto-scaling
- **HTTPS certificates** automatically managed
- **Custom domain** support
- **Environment variables** secure storage

**Deployment Process:**
```bash
# 1. Install production dependencies
npm install --production

# 2. Set environment variables (Render Dashboard)
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/blog
JWT_SECRET=production-secret-key
JWT_REFRESH_SECRET=production-refresh-secret
FRONTEND_URL=https://developer-arena.vercel.app

# 3. Deploy to Render
git push origin main  # Auto-deploy from main branch
```

**Render Configuration:**
```yaml
# render.yaml
services:
  - type: web
    name: blogspace-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
```

### Production Considerations

**Security:**
- **HTTPS enforced** on both frontend and backend
- **CORS properly configured** for production domains
- **Environment variables** used for sensitive data
- **JWT secrets** are production-specific

**Performance:**
- **Frontend**: Vercel CDN for static assets
- **Backend**: Render auto-scaling based on load
- **Database**: MongoDB Atlas with global distribution
- **Caching**: Browser caching for static content

**Monitoring:**
- **Vercel Analytics** for frontend performance
- **Render Logs** for backend monitoring
- **MongoDB Atlas** for database metrics
- **Error tracking** through console logs

### Deployment URLs

**Live Application:**
- **Frontend**: https://developer-arena.vercel.app/
- **Backend API**: https://blogspace-fzlh.onrender.com/api

**Repository:**
- **Source Code**: https://github.com/anjali91106/Developer_Arena

---

## 📊 System Architecture Summary

**Data Flow:**
```
User Interface (React) 
        ↓ (Redux Actions)
State Management (Redux Toolkit)
        ↓ (Axios HTTP)
API Layer (Express.js)
        ↓ (Mongoose ODM)
Database (MongoDB)
```

**Security Layers:**
```
┌─────────────────────────────────────────┐
│        SECURITY STACK              │
├─────────────────────────────────────────┤
│                                   │
│  Frontend Security                │
│  ┌─────────────────┐              │
│  │ HTTPS Only     │              │
│  │ Input Validation│              │
│  │ XSS Prevention │              │
│  └─────────────────┘              │
│                                   │
│  Backend Security                 │
│  ┌─────────────────┐              │
│  │ JWT Auth       │              │
│  │ Password Hash   │              │
│  │ CORS Config    │              │
│  │ Rate Limiting  │              │
│  └─────────────────┘              │
│                                   │
│  Database Security                │
│  ┌─────────────────┐              │
│  │ MongoDB Atlas   │              │
│  │ Encryption     │              │
│  │ Access Control │              │
│  └─────────────────┘              │
│                                   │
└─────────────────────────────────────────┘
```

This architecture provides a scalable, secure, and maintainable full-stack blogging platform with modern development practices and production-ready deployment strategy.
