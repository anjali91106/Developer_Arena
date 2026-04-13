# Task Manager API

A comprehensive task management system with MongoDB Atlas, Express.js, and JWT authentication.

## 🚀 Features

### **User Management**
- ✅ **User Registration** with validation and password hashing
- ✅ **User Login** with JWT authentication
- ✅ **Profile Management** with avatar support
- ✅ **Password Change** with secure validation
- ✅ **Account Status** tracking

### **Task Management**
- ✅ **Create Tasks** with comprehensive fields
- ✅ **Read Tasks** with advanced filtering and pagination
- ✅ **Update Tasks** with status tracking
- ✅ **Delete Tasks** with ownership validation
- ✅ **Task Statistics** with analytics dashboard
- ✅ **Task Assignment** to other users
- ✅ **Time Tracking** (estimated vs actual)
- ✅ **File Attachments** support
- ✅ **Due Date Management** with overdue tracking

### **Advanced Features**
- ✅ **Full-text Search** across title and description
- ✅ **Multi-criteria Filtering** (status, priority, category, tags)
- ✅ **Smart Sorting** (date, priority, custom)
- ✅ **Pagination** with metadata
- ✅ **Task Statistics** and analytics
- ✅ **Overdue Task Detection**
- ✅ **Completion Rate Tracking**

## 📁 Project Structure

```
task-manager-backend/
├── server.js                    # Main server with MongoDB Atlas connection
├── package.json                 # Dependencies and scripts
├── .env.example                 # Environment variables template
├── README.md                    # This file
├── src/
│   ├── controllers/
│   │   ├── userController.js    # User CRUD and auth logic
│   │   └── taskController.js   # Task CRUD and analytics
│   ├── routes/
│   │   ├── userRoutes.js        # User authentication routes
│   │   └── taskRoutes.js        # Task management routes
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── errorHandler.js      # Comprehensive error handling
│   └── models/
│       ├── User.js              # User model with validation
│       └── Task.js              # Task model with relationships
```

## 🛠️ Installation

### **1. Clone and Install**
```bash
git clone <repository-url>
cd task-manager-backend
npm install
```

### **2. Environment Setup**
```bash
cp .env.example .env
# Edit .env with your MongoDB Atlas credentials
```

### **3. Start Development**
```bash
npm run dev
```

### **4. Start Production**
```bash
npm start
```

## 📡 API Endpoints

### **Authentication**

#### **Register User**
```http
POST /api/users/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### **Login User**
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### **Get Profile**
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### **Update Profile**
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### **Change Password**
```http
PUT /api/users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### **Task Management**

#### **Create Task**
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the task manager API including all endpoints and examples",
  "status": "todo",
  "priority": "high",
  "category": "work",
  "tags": ["documentation", "api", "urgent"],
  "dueDate": "2026-04-15T10:00:00Z",
  "estimatedTime": 120,
  "assignedTo": "60d5f8b8b4659f277263"  // Optional: User ID
}
```

#### **Get All Tasks**
```http
GET /api/tasks?page=1&limit=10&status=todo&priority=high&category=work&tags=urgent&sort=dueDate&order=asc&search=documentation
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page
- `status` - Filter by status (todo, in-progress, completed, cancelled)
- `priority` - Filter by priority (low, medium, high, urgent)
- `category` - Filter by category (work, personal, shopping, health, education, finance, other)
- `tags` - Filter by tags (comma-separated or array)
- `search` - Full-text search in title and description
- `sortBy` - Sort field (createdAt, dueDate, priority, title)
- `order` - Sort order (asc, desc)
- `dueDate` - Filter by due date (today, upcoming, overdue)

#### **Get Task Statistics**
```http
GET /api/tasks/stats
Authorization: Bearer <token>
```

#### **Get Single Task**
```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

#### **Update Task**
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated task title",
  "status": "in-progress",
  "actualTime": 90
}
```

#### **Delete Task**
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

### **Health Check**
```http
GET /api/health
```

## 📊 Response Formats

### **Success Response**
```json
{
  "message": "Operation successful",
  "task": {
    "id": "60d5f8b8b4659f277263",
    "title": "Complete project documentation",
    "status": "todo",
    "priority": "high",
    "user": {
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe"
    },
    "createdAt": "2026-04-01T10:00:00Z",
    "isOverdue": false,
    "completionPercentage": 0
  }
}
```

### **Paginated Response**
```json
{
  "tasks": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  },
  "filters": {
    "status": "todo",
    "priority": "high",
    "category": "work"
  }
}
```

### **Error Response**
```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "field": "field_name",
  "details": ["array", "of", "validation", "errors"]
}
```

## 🔒 Security Features

### **Authentication & Authorization**
- **JWT Authentication** with expiration handling
- **Password Hashing** with bcryptjs
- **Input Validation** with Joi schemas
- **Rate Limiting** (100 requests/15 minutes)
- **CORS Configuration** for cross-origin requests
- **Security Headers** with Helmet

### **Data Protection**
- **MongoDB Injection Protection** with Mongoose ODM
- **XSS Protection** with input sanitization
- **SQL Injection Protection** (NoSQL focused)
- **Access Control** (user can only modify their own tasks)

## 📈 Performance Features

### **Database Optimization**
- **MongoDB Indexes** for fast queries
- **Text Search Index** for full-text search
- **Compound Indexes** for complex filters
- **Pagination** for large datasets
- **Aggregation Pipelines** for statistics

### **Caching Strategy**
- **Query Optimization** with selective field population
- **Connection Pooling** with Mongoose
- **Memory Management** with proper garbage collection

## 🧪 Testing

### **Manual Testing**
```bash
# Health Check
curl http://localhost:5000/api/health

# Register User
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Login User
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create Task (replace TOKEN)
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Test Task","description":"This is a test task","priority":"medium","category":"work"}'
```

## 🚀 Deployment

### **Environment Variables**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager
JWT_SECRET=your-32-character-secure-random-string
PORT=5000
NODE_ENV=production
```

### **MongoDB Atlas Setup**
1. **Create Cluster**: MongoDB Atlas → Create Cluster
2. **Database User**: Database Access → Create User
3. **Network Access**: Allow IP (0.0.0.0/0 for all)
4. **Connection String**: Get `mongodb+srv://` string

### **Production Deployment**
```bash
npm install --production
npm start
```

## 📱 Task Status Flow

```
todo → in-progress → completed
  ↓           ↓              ↓
  ↓       [Time Tracking]   ↓
  ↓           ↓              ↓
  ↓        [Update Status]  ↓
  ↓           ↓              ↓
  ↓        [Due Date]     ↓
  ↓           ↓              ↓
  ↓      [Overdue Check] ↓
  ↓           ↓              ↓
  ↓    [Cancel/Complete] ↓
```

## 🎯 Use Cases

### **Personal Task Management**
- Daily to-do lists
- Project milestone tracking
- Habit formation
- Goal achievement

### **Team Collaboration**
- Task assignment to team members
- Progress tracking
- Deadline management
- Resource allocation

### **Business Project Management**
- Sprint planning
- Task prioritization
- Resource management
- Progress reporting

## 📚 Advanced Features

### **Task Analytics**
- Completion rates by category
- Priority distribution analysis
- Time tracking insights
- Overdue task alerts

### **Smart Filtering**
- Multi-criteria search
- Saved filter combinations
- Custom view presets
- Export functionality

## 🔧 Development

### **Adding New Features**
1. **Model Updates**: Modify `src/models/Task.js`
2. **Controller Logic**: Update `src/controllers/taskController.js`
3. **Route Definitions**: Add to `src/routes/taskRoutes.js`
4. **Validation**: Update Joi schemas
5. **Testing**: Add comprehensive tests

### **Database Schema Evolution**
```javascript
// Example: Adding subtasks
const subtaskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
  parentTask: { type: ObjectId, ref: 'Task' }
});

// Add to task schema
subtasks: [subtaskSchema]
```

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ using Node.js, Express.js, MongoDB Atlas, and modern JavaScript features.**
