# Task Manager API Documentation

## 📚 Table of Contents

- [Authentication](#authentication)
- [User Management](#user-management)
- [Task Management](#task-management)
- [Error Responses](#error-responses)
- [Response Formats](#response-formats)
- [Authentication](#authentication-1)

---

## 🔐 Authentication

### **JWT Token Required**
All protected endpoints require a JWT token in the `Authorization` header:

```http
Authorization: Bearer <your-jwt-token>
```

### **Token Expiration**
- **Duration**: 7 days
- **Refresh**: Required after expiration
- **Error Codes**: `TOKEN_EXPIRED`, `TOKEN_INVALID`, `TOKEN_MISSING`

---

## 👤 User Management

### **POST /api/users/register**
Register a new user account.

**Endpoint**: `POST /api/users/register`  
**Authentication**: Not Required  
**Rate Limit**: 5 requests per minute

#### **Request Body**
```json
{
  "username": "string",
  "email": "string", 
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```

#### **Schema Validation**
| Field | Type | Required | Constraints | Validation |
|-------|------|----------|-------------|-------------|
| `username` | string | ✅ Yes | 3-30 chars | Alphanumeric + underscore only |
| `email` | string | ✅ Yes | Valid email format | RFC 5322 email validation |
| `password` | string | ✅ Yes | Min 6 chars | No whitespace allowed |
| `firstName` | string | ✅ Yes | Max 50 chars | Letters and spaces only |
| `lastName` | string | ✅ Yes | Max 50 chars | Letters and spaces only |

#### **Example Request**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### **Success Response (201)**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "60d5f8b8b4659f277263",
    "username": "john_doe",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### **Error Responses**
- `400` - Validation error
- `409` - Email or username already exists

---

### **POST /api/users/login**
Authenticate user and receive JWT token.

**Endpoint**: `POST /api/users/login`  
**Authentication**: Not Required  
**Rate Limit**: 10 requests per minute

#### **Request Body**
```json
{
  "email": "string",
  "password": "string"
}
```

#### **Schema Validation**
| Field | Type | Required | Constraints | Validation |
|-------|------|----------|-------------|-------------|
| `email` | string | ✅ Yes | Valid email format | RFC 5322 email validation |
| `password` | string | ✅ Yes | Min 1 char | Must match stored password |

#### **Example Request**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

#### **Success Response (200)**
```json
{
  "message": "Login successful",
  "user": {
    "id": "60d5f8b8b4659f277263",
    "username": "john_doe",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### **Error Responses**
- `400` - Validation error
- `401` - Invalid credentials
- `403` - Account deactivated

---

### **GET /api/users/profile**
Get current user profile information.

**Endpoint**: `GET /api/users/profile`  
**Authentication**: ✅ Required  
**Rate Limit**: 60 requests per minute

#### **Request Headers**
```http
Authorization: Bearer <jwt-token>
```

#### **Example Request**
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### **Success Response (200)**
```json
{
  "user": {
    "id": "60d5f8b8b4659f277263",
    "username": "john_doe",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2026-04-01T10:00:00.000Z",
    "isActive": true
  }
}
```

#### **Error Responses**
- `401` - Token missing/invalid
- `404` - User not found

---

### **PUT /api/users/profile**
Update current user profile information.

**Endpoint**: `PUT /api/users/profile`  
**Authentication**: ✅ Required  
**Rate Limit**: 30 requests per minute

#### **Request Headers**
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

#### **Request Body**
```json
{
  "firstName": "string",
  "lastName": "string", 
  "avatar": "string"
}
```

#### **Schema Validation**
| Field | Type | Required | Constraints | Validation |
|-------|------|----------|-------------|-------------|
| `firstName` | string | ❌ No | Max 50 chars | Letters and spaces only |
| `lastName` | string | ❌ No | Max 50 chars | Letters and spaces only |
| `avatar` | string | ❌ No | Valid URL | URL validation, empty allowed |

#### **Example Request**
```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Johnathan",
    "lastName": "Smith",
    "avatar": "https://example.com/new-avatar.jpg"
  }'
```

#### **Success Response (200)**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "60d5f8b8b4659f277263",
    "username": "john_doe",
    "email": "john.doe@example.com",
    "firstName": "Johnathan",
    "lastName": "Smith",
    "avatar": "https://example.com/new-avatar.jpg",
    "updatedAt": "2026-04-01T11:00:00.000Z"
  }
}
```

#### **Error Responses**
- `400` - Validation error
- `401` - Token missing/invalid
- `404` - User not found

---

### **PUT /api/users/change-password**
Change user password.

**Endpoint**: `PUT /api/users/change-password`  
**Authentication**: ✅ Required  
**Rate Limit**: 5 requests per minute

#### **Request Headers**
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

#### **Request Body**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

#### **Schema Validation**
| Field | Type | Required | Constraints | Validation |
|-------|------|----------|-------------|-------------|
| `currentPassword` | string | ✅ Yes | Min 1 char | Must match current password |
| `newPassword` | string | ✅ Yes | Min 6 chars | Password strength validation |

#### **Example Request**
```bash
curl -X PUT http://localhost:5000/api/users/change-password \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456"
  }'
```

#### **Success Response (200)**
```json
{
  "message": "Password changed successfully"
}
```

#### **Error Responses**
- `400` - Validation error
- `401` - Invalid current password
- `404` - User not found

---

## 📋 Task Management

### **POST /api/tasks**
Create a new task.

**Endpoint**: `POST /api/tasks`  
**Authentication**: ✅ Required  
**Rate Limit**: 30 requests per minute

#### **Request Headers**
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

#### **Request Body**
```json
{
  "title": "string",
  "description": "string",
  "status": "string",
  "priority": "string", 
  "category": "string",
  "tags": ["string"],
  "dueDate": "string",
  "estimatedTime": "number",
  "assignedTo": "string"
}
```

#### **Schema Validation**
| Field | Type | Required | Constraints | Validation |
|-------|------|----------|-------------|-------------|
| `title` | string | ✅ Yes | 1-200 chars | No leading/trailing spaces |
| `description` | string | ✅ Yes | 10-2000 chars | Cannot be empty |
| `status` | string | ❌ No | Enum values | `todo`, `in-progress`, `completed`, `cancelled` |
| `priority` | string | ❌ No | Enum values | `low`, `medium`, `high`, `urgent` |
| `category` | string | ❌ No | Enum values | `work`, `personal`, `shopping`, `health`, `education`, `finance`, `other` |
| `tags` | array | ❌ No | Max 10 items | Each max 20 chars |
| `dueDate` | string | ❌ No | Future date | ISO 8601 format |
| `estimatedTime` | number | ❌ No | 1-480 minutes | Positive integer |
| `assignedTo` | string | ❌ No | Valid ObjectId | Must be existing user ID |

#### **Example Request**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation for the task manager API including all endpoints, examples, and best practices.",
    "status": "todo",
    "priority": "high",
    "category": "work",
    "tags": ["documentation", "api", "urgent"],
    "dueDate": "2026-04-15T10:00:00.000Z",
    "estimatedTime": 180,
    "assignedTo": "60d5f8b8b4659f277264"
  }'
```

#### **Success Response (201)**
```json
{
  "message": "Task created successfully",
  "task": {
    "id": "60d5f8b8b4659f277265",
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation for the task manager API...",
    "status": "todo",
    "priority": "high",
    "category": "work",
    "tags": ["documentation", "api", "urgent"],
    "dueDate": "2026-04-15T10:00:00.000Z",
    "estimatedTime": 180,
    "actualTime": null,
    "user": {
      "id": "60d5f8b8b4659f277263",
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe"
    },
    "assignedTo": {
      "id": "60d5f8b8b4659f277264",
      "username": "jane_smith",
      "firstName": "Jane",
      "lastName": "Smith"
    },
    "createdAt": "2026-04-01T10:00:00.000Z",
    "updatedAt": "2026-04-01T10:00:00.000Z",
    "isOverdue": false,
    "completionPercentage": 0
  }
}
```

#### **Error Responses**
- `400` - Validation error
- `401` - Token missing/invalid
- `404` - Assigned user not found

---

### **GET /api/tasks**
Get tasks with filtering, pagination, and sorting.

**Endpoint**: `GET /api/tasks`  
**Authentication**: ✅ Required  
**Rate Limit**: 60 requests per minute

#### **Request Headers**
```http
Authorization: Bearer <jwt-token>
```

#### **Query Parameters**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|----------|-------------|
| `page` | number | ❌ No | 1 | Page number for pagination |
| `limit` | number | ❌ No | 10 | Items per page (max 100) |
| `status` | string | ❌ No | - | Filter by status |
| `priority` | string | ❌ No | - | Filter by priority |
| `category` | string | ❌ No | - | Filter by category |
| `tags` | string | ❌ No | - | Filter by tags (comma-separated) |
| `search` | string | ❌ No | - | Full-text search |
| `sortBy` | string | ❌ No | createdAt | Sort field |
| `order` | string | ❌ No | desc | Sort order (asc/desc) |
| `dueDate` | string | ❌ No | - | Filter by due date (today/upcoming/overdue) |
| `assignedTo` | string | ❌ No | - | Filter by assigned user ID |

#### **Filter Values**
- **status**: `todo`, `in-progress`, `completed`, `cancelled`
- **priority**: `low`, `medium`, `high`, `urgent`
- **category**: `work`, `personal`, `shopping`, `health`, `education`, `finance`, `other`
- **dueDate**: `today`, `upcoming`, `overdue`
- **sortBy**: `createdAt`, `dueDate`, `priority`, `title`, `status`
- **order**: `asc`, `desc`

#### **Example Requests**
```bash
# Get first page of tasks
curl -X GET "http://localhost:5000/api/tasks?page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get high priority work tasks
curl -X GET "http://localhost:5000/api/tasks?priority=high&category=work" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Search tasks
curl -X GET "http://localhost:5000/api/tasks?search=documentation" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get overdue tasks
curl -X GET "http://localhost:5000/api/tasks?dueDate=overdue" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Sort by due date ascending
curl -X GET "http://localhost:5000/api/tasks?sortBy=dueDate&order=asc" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### **Success Response (200)**
```json
{
  "tasks": [
    {
      "id": "60d5f8b8b4659f277265",
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation...",
      "status": "todo",
      "priority": "high",
      "category": "work",
      "tags": ["documentation", "api", "urgent"],
      "dueDate": "2026-04-15T10:00:00.000Z",
      "estimatedTime": 180,
      "actualTime": null,
      "user": {
        "id": "60d5f8b8b4659f277263",
        "username": "john_doe",
        "firstName": "John",
        "lastName": "Doe"
      },
      "assignedTo": {
        "id": "60d5f8b8b4659f277264",
        "username": "jane_smith",
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "createdAt": "2026-04-01T10:00:00.000Z",
      "updatedAt": "2026-04-01T10:00:00.000Z",
      "isOverdue": false,
      "completionPercentage": 0
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  },
  "filters": {
    "status": null,
    "priority": "high",
    "category": "work",
    "tags": null,
    "search": null,
    "sortBy": "createdAt",
    "order": "desc"
  }
}
```

#### **Error Responses**
- `400` - Invalid query parameters
- `401` - Token missing/invalid

---

### **GET /api/tasks/stats**
Get task statistics and analytics.

**Endpoint**: `GET /api/tasks/stats`  
**Authentication**: ✅ Required  
**Rate Limit**: 30 requests per minute

#### **Request Headers**
```http
Authorization: Bearer <jwt-token>
```

#### **Example Request**
```bash
curl -X GET http://localhost:5000/api/tasks/stats \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### **Success Response (200)**
```json
{
  "stats": {
    "overall": {
      "total": 45,
      "completed": 12,
      "inProgress": 8,
      "todo": 20,
      "overdue": 5
    },
    "priority": [
      { "_id": "high", "count": 15 },
      { "_id": "medium", "count": 20 },
      { "_id": "low", "count": 8 },
      { "_id": "urgent", "count": 2 }
    ],
    "category": [
      { "_id": "work", "count": 25 },
      { "_id": "personal", "count": 10 },
      { "_id": "shopping", "count": 5 },
      { "_id": "health", "count": 3 },
      { "_id": "education", "count": 2 }
    ],
    "completionRate": 27
  }
}
```

#### **Error Responses**
- `401` - Token missing/invalid

---

### **GET /api/tasks/:id**
Get a single task by ID.

**Endpoint**: `GET /api/tasks/:id`  
**Authentication**: ✅ Required  
**Rate Limit**: 60 requests per minute

#### **Request Headers**
```http
Authorization: Bearer <jwt-token>
```

#### **Path Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | ✅ Yes | Task ID (ObjectId) |

#### **Example Request**
```bash
curl -X GET http://localhost:5000/api/tasks/60d5f8b8b4659f277265 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### **Success Response (200)**
```json
{
  "task": {
    "id": "60d5f8b8b4659f277265",
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation...",
    "status": "todo",
    "priority": "high",
    "category": "work",
    "tags": ["documentation", "api", "urgent"],
    "dueDate": "2026-04-15T10:00:00.000Z",
    "estimatedTime": 180,
    "actualTime": null,
    "user": {
      "id": "60d5f8b8b4659f277263",
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe"
    },
    "assignedTo": {
      "id": "60d5f8b8b4659f277264",
      "username": "jane_smith",
      "firstName": "Jane",
      "lastName": "Smith"
    },
    "createdAt": "2026-04-01T10:00:00.000Z",
    "updatedAt": "2026-04-01T10:00:00.000Z",
    "isOverdue": false,
    "completionPercentage": 0
  }
}
```

#### **Error Responses**
- `401` - Token missing/invalid
- `403` - Access denied (not owner/assigned)
- `404` - Task not found

---

### **PUT /api/tasks/:id**
Update a task.

**Endpoint**: `PUT /api/tasks/:id`  
**Authentication**: ✅ Required  
**Rate Limit**: 30 requests per minute

#### **Request Headers**
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

#### **Path Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | ✅ Yes | Task ID (ObjectId) |

#### **Request Body**
```json
{
  "title": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "category": "string", 
  "tags": ["string"],
  "dueDate": "string",
  "estimatedTime": "number",
  "actualTime": "number",
  "assignedTo": "string"
}
```

#### **Schema Validation**
Same as POST, but all fields are optional. Only provided fields will be updated.

#### **Example Request**
```bash
curl -X PUT http://localhost:5000/api/tasks/60d5f8b8b4659f277265 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in-progress",
    "actualTime": 45,
    "priority": "urgent"
  }'
```

#### **Success Response (200)**
```json
{
  "message": "Task updated successfully",
  "task": {
    "id": "60d5f8b8b4659f277265",
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation...",
    "status": "in-progress",
    "priority": "urgent",
    "category": "work",
    "tags": ["documentation", "api", "urgent"],
    "dueDate": "2026-04-15T10:00:00.000Z",
    "estimatedTime": 180,
    "actualTime": 45,
    "user": {
      "id": "60d5f8b8b4659f277263",
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe"
    },
    "assignedTo": {
      "id": "60d5f8b8b4659f277264",
      "username": "jane_smith",
      "firstName": "Jane",
      "lastName": "Smith"
    },
    "createdAt": "2026-04-01T10:00:00.000Z",
    "updatedAt": "2026-04-01T11:30:00.000Z",
    "isOverdue": false,
    "completionPercentage": 50
  }
}
```

#### **Error Responses**
- `400` - Validation error
- `401` - Token missing/invalid
- `403` - Access denied (not owner)
- `404` - Task not found

---

### **DELETE /api/tasks/:id**
Delete a task.

**Endpoint**: `DELETE /api/tasks/:id`  
**Authentication**: ✅ Required  
**Rate Limit**: 30 requests per minute

#### **Request Headers**
```http
Authorization: Bearer <jwt-token>
```

#### **Path Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | ✅ Yes | Task ID (ObjectId) |

#### **Example Request**
```bash
curl -X DELETE http://localhost:5000/api/tasks/60d5f8b8b4659f277265 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### **Success Response (200)**
```json
{
  "message": "Task deleted successfully"
}
```

#### **Error Responses**
- `401` - Token missing/invalid
- `403` - Access denied (not owner)
- `404` - Task not found

---

## 🔍 Health Check

### **GET /api/health**
Check API health and database connection status.

**Endpoint**: `GET /api/health`  
**Authentication**: Not Required  
**Rate Limit**: 60 requests per minute

#### **Example Request**
```bash
curl -X GET http://localhost:5000/api/health
```

#### **Success Response (200)**
```json
{
  "status": "OK",
  "timestamp": "2026-04-01T10:00:00.000Z",
  "uptime": 3600.123,
  "database": "connected"
}
```

---

## ❌ Error Responses

### **Standard Error Format**
```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "field": "field_name",
  "details": ["array", "of", "validation", "errors"]
}
```

### **Common Error Codes**

| Code | HTTP Status | Description |
|-------|-------------|-------------|
| `TOKEN_MISSING` | 401 | Authorization header missing |
| `TOKEN_INVALID` | 401 | Invalid JWT token |
| `TOKEN_EXPIRED` | 401 | JWT token expired |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INVALID_ID` | 400 | Invalid ObjectId format |
| `DUPLICATE_KEY` | 409 | Duplicate field value |
| `NOT_FOUND` | 404 | Resource not found |
| `ACCESS_DENIED` | 403 | Insufficient permissions |
| `DB_CONNECTION_ERROR` | 503 | Database connection failed |
| `INTERNAL_ERROR` | 500 | Internal server error |

### **Validation Error Examples**

#### **User Registration Validation**
```json
{
  "error": "Username must be at least 3 characters long",
  "code": "VALIDATION_ERROR",
  "field": "username"
}
```

#### **Task Creation Validation**
```json
{
  "error": "Description must be at least 10 characters long",
  "code": "VALIDATION_ERROR", 
  "field": "description"
}
```

#### **Multiple Validation Errors**
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    "Title is required",
    "Description must be at least 10 characters long",
    "Invalid priority value"
  ]
}
```

---

## 📊 Response Formats

### **Success Responses**

#### **Single Resource Response**
```json
{
  "message": "Operation successful",
  "resource": {
    "id": "60d5f8b8b4659f277263",
    "field1": "value1",
    "field2": "value2"
  }
}
```

#### **Paginated Response**
```json
{
  "resources": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### **Statistics Response**
```json
{
  "stats": {
    "metric1": "value1",
    "metric2": "value2",
    "nested": {
      "submetric1": "value3"
    }
  }
}
```

### **Virtual Properties**

Tasks include computed properties:

| Property | Type | Description |
|----------|------|-------------|
| `isOverdue` | boolean | True if task is past due date and not completed |
| `completionPercentage` | number | 0-100 based on status (todo=0, in-progress=50, completed=100) |

---

## 🔐 Authentication Details

### **JWT Token Structure**
```json
{
  "id": "60d5f8b8b4659f277263",
  "username": "john_doe",
  "iat": 1648833600,
  "exp": 1649438400
}
```

### **Token Usage**
```http
# Include in all protected requests
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDVmOGI4YjQ2NTlmMjc3MjYzIiwidXNlcm5hbWUiOiJqb2huX2RvZSIsImlhdCI6MTY0ODgzMzYwMCwiZXhwIjoxNjQ5NDM4NDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### **Token Expiration**
- **Duration**: 7 days (604800 seconds)
- **Renewal**: Required after expiration
- **Storage**: Should be stored securely (localStorage, httpOnly cookie)

---

## 📝 Testing Examples

### **Complete User Flow**
```bash
# 1. Register user
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# 2. Login user
TOKEN=$(curl -s -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' | jq -r '.token')

# 3. Create task
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"This is a test task","priority":"medium","category":"work"}'

# 4. Get tasks
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer $TOKEN"

# 5. Update task
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"in-progress","actualTime":30}'

# 6. Delete task
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🚀 Rate Limiting

### **Endpoint Limits**
| Endpoint Type | Requests | Window |
|---------------|-----------|---------|
| Authentication | 10/min | 15 minutes |
| Task CRUD | 30/min | 15 minutes |
| Read Operations | 60/min | 15 minutes |
| Password Change | 5/min | 15 minutes |

### **Rate Limit Headers**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1648837200
```

### **Rate Limit Exceeded**
```json
{
  "error": "Too many requests",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 900
}
```

---

## 📱 SDK Examples

### **JavaScript/Node.js**
```javascript
const axios = require('axios');

class TaskManagerAPI {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async login(email, password) {
    const response = await axios.post(`${this.baseURL}/api/users/login`, {
      email,
      password
    });
    this.token = response.data.token;
    return response.data;
  }

  async getTasks(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${this.baseURL}/api/tasks?${params}`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
    return response.data;
  }

  async createTask(taskData) {
    const response = await axios.post(`${this.baseURL}/api/tasks`, taskData, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
    return response.data;
  }
}

// Usage
const api = new TaskManagerAPI('http://localhost:5000');
await api.login('test@example.com', 'password123');
const tasks = await api.getTasks({ status: 'todo', priority: 'high' });
```

### **Python**
```python
import requests

class TaskManagerAPI:
    def __init__(self, base_url):
        self.base_url = base_url
        self.token = None
    
    def login(self, email, password):
        response = requests.post(f"{self.base_url}/api/users/login", json={
            "email": email,
            "password": password
        })
        data = response.json()
        self.token = data["token"]
        return data
    
    def get_tasks(self, filters=None):
        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.get(f"{self.base_url}/api/tasks", 
                            params=filters, headers=headers)
        return response.json()
    
    def create_task(self, task_data):
        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.post(f"{self.base_url}/api/tasks", 
                             json=task_data, headers=headers)
        return response.json()

# Usage
api = TaskManagerAPI("http://localhost:5000")
api.login("test@example.com", "password123")
tasks = api.get_tasks({"status": "todo", "priority": "high"})
```

---

## 📋 Quick Reference

### **Authentication Flow**
1. `POST /api/users/register` - Create account
2. `POST /api/users/login` - Get JWT token
3. Include `Authorization: Bearer <token>` in all protected requests

### **Task Management Flow**
1. `POST /api/tasks` - Create task
2. `GET /api/tasks` - List tasks (with filters)
3. `GET /api/tasks/:id` - Get single task
4. `PUT /api/tasks/:id` - Update task
5. `DELETE /api/tasks/:id` - Delete task

### **Common Headers**
```http
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

### **Status Values**
- `todo` - Not started
- `in-progress` - Currently working on
- `completed` - Finished
- `cancelled` - Cancelled/abandoned

### **Priority Values**
- `low` - Low priority
- `medium` - Normal priority
- `high` - High priority
- `urgent` - Urgent priority

---

**This documentation covers all API endpoints, validation rules, and usage examples for the Task Manager API.**
