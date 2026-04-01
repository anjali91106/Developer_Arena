# Blog API

A complete Express.js REST API for blog posts with JWT authentication, CRUD operations, and proper error handling.

## 🚀 Features

- **User Authentication**: Registration and login with JWT tokens
- **CRUD Operations**: Complete Create, Read, Update, Delete for blog posts
- **Request Validation**: Input validation using Joi schemas
- **Security**: Helmet, CORS, rate limiting, password hashing
- **Error Handling**: Comprehensive error handling and logging
- **Database**: MongoDB with Mongoose ODM
- **Pagination**: Efficient pagination for post listings

## 📁 Project Structure

```
blog-api/
├── server.js                    # Main server with setup and route mounting
├── package.json                 # Dependencies and scripts
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore file
├── README.md                    # This file
├── postman-collection.json       # Postman API testing collection
├── test-simple-crud.js          # Node.js CRUD testing script
├── test-with-curl.bat           # Windows batch testing script
├── test-all-crud.sh             # Linux/Mac shell testing script
├── src/
│   ├── controllers/
│   │   ├── postController.js    # Post CRUD operations and logic
│   │   └── authController.js    # User authentication logic
│   ├── routes/
│   │   ├── postRoutes.js        # Post route definitions
│   │   ├── authRoutes.js        # Authentication routes
│   │   └── userRoutes.js        # User-specific routes
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── errorHandler.js      # Error handling middleware
│   └── models/
│       ├── User.js              # User model with password hashing
│       └── Post.js              # Blog post model with relationships
└── tests/
    └── api.test.js             # Jest test suite
```

### 🏗️ Architecture Overview

**MVC Pattern Implementation:**
- **Models** (`src/models/`) - Database schemas and data validation
- **Controllers** (`src/controllers/`) - Business logic and request handling
- **Routes** (`src/routes/`) - Route definitions and middleware
- **Middleware** (`src/middleware/`) - Reusable middleware functions

**Key Features:**
- **Separation of Concerns**: Each file has single responsibility
- **Modular Design**: Easy to extend and maintain
- **Security**: JWT authentication and input validation
- **Error Handling**: Comprehensive error management
- **Testing**: Multiple testing approaches included

## 🧪 Testing

### **Quick Testing Options**

#### **1. Node.js Automated Test (Recommended)**
```bash
node test-simple-crud.js
```
**Features**: Complete CRUD testing, error handling, existing user support

#### **2. Windows Batch Script**
```bash
test-with-curl.bat
```
**Features**: Native Windows testing, basic CRUD operations

#### **3. Linux/Mac Shell Script**
```bash
chmod +x test-all-crud.sh
./test-all-crud.sh
```
**Features**: Shell scripting, JSON parsing with jq

#### **4. Postman Collection**
1. Import `postman-collection.json` into Postman
2. Set environment variables:
   - `baseUrl`: `http://localhost:5000`
   - `token`: Auto-filled after login
3. Run all requests in sequence

#### **5. Jest Unit Tests**
```bash
npm test
```
**Features**: Unit testing, CI/CD integration

### **Manual Testing**

#### **Health Check**
```bash
curl http://localhost:5000/api/health
```

#### **API Endpoints**
```bash
# Register User
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login User
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create Post (requires token)
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test Post","content":"Content...","tags":["test"]}'
```

## 🛠️ Installation

1. **Clone and Install**
```bash
git clone <repository-url>
cd blog-api
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start Development**
```bash
npm run dev
```

4. **Start Production**
```bash
npm start
```

## 📡 API Endpoints

### Authentication

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Blog Posts (Public)

#### Get All Posts
```http
GET /api/posts?page=1&limit=10
```

#### Get Single Post
```http
GET /api/posts/:id
```

### Blog Posts (Protected - JWT Required)

#### Create Post
```http
POST /api/posts
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "My First Blog Post",
  "content": "This is the content of my blog post...",
  "tags": ["javascript", "nodejs", "express"]
}
```

#### Update Post
```http
PUT /api/posts/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Blog Post Title",
  "content": "Updated content...",
  "tags": ["updated", "tags"]
}
```

#### Delete Post
```http
DELETE /api/posts/:id
Authorization: Bearer <jwt-token>
```

#### Get User's Posts
```http
GET /api/user/posts
Authorization: Bearer <jwt-token>
```

### Health Check
```http
GET /api/health
```

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: Joi schema validation
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security headers
- **MongoDB**: NoSQL injection protection

## 📊 Response Formats

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### Error Response
```json
{
  "error": "Error message description"
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📝 Environment Variables

Create `.env` file with:

```env
MONGODB_URI=mongodb://localhost:27017/blog-api
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

## 🚀 Deployment

1. **Set Environment Variables**
2. **Install Dependencies**: `npm install --production`
3. **Start Server**: `npm start`

## 📚 API Documentation

### Postman Collection
Import the provided Postman collection to test all endpoints.

### Swagger Documentation
API documentation available at `/api-docs` (when implemented).

## 🔧 Development

### Adding New Endpoints

1. **Add Route**: Create new route in `server.js`
2. **Add Validation**: Create Joi schema for input validation
3. **Add Tests**: Write tests in `tests/` directory
4. **Update Docs**: Update README and API documentation

### Database Models

#### User Model
- `username`: String, required, unique
- `email`: String, required, unique
- `password`: String, required, hashed
- `createdAt`: Date, auto
- `updatedAt`: Date, auto

#### Post Model
- `title`: String, required, max 200 chars
- `content`: String, required, min 10 chars
- `tags`: Array of strings, max 5 tags
- `author`: ObjectId ref to User
- `createdAt`: Date, auto
- `updatedAt`: Date, auto

## 🐛 Error Handling

### Custom Errors
- **ValidationError**: Input validation errors (400)
- **JsonWebTokenError**: JWT errors (401)
- **MongoError**: Database errors (500)
- **CustomError**: Application-specific errors

### Logging
- Morgan for HTTP request logging
- Console error logging
- Structured error responses

## 📈 Performance

### Database Indexes
- Author and creation date compound index
- Tags index for tag-based queries
- Text search index for title and content

### Caching
- MongoDB query optimization
- Response caching for public endpoints
- Rate limiting for API protection

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details.
