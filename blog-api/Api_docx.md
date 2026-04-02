# blog-api — Complete API Guide

This API supports two environments:

* **Localhost:** `http://localhost:5000`
* **Production:** `https://developer-arena.onrender.com`

The API is divided into three main sections:

* Health
* Authentication
* Posts

**Rate Limit:** 100 requests per window (via `X-RateLimit-*` headers)

---

## 1. Health Check

Used to verify if the server is running.

| Method | URL                                             |
| ------ | ----------------------------------------------- |
| GET    | http://localhost:5000/api/health                |
| GET    | https://developer-arena.onrender.com/api/health |

* **Auth:** None
* **Body:** None

### ✅ Success Response — `200 OK`

```json
{
  "status": "OK",
  "timestamp": "2026-04-02T07:35:12.689Z",
  "uptime": 9.1233163
}
```

---

## 2. Authentication

### 2.1 Register

Creates a new user.

| Method | URL                                               |
| ------ | ------------------------------------------------- |
| POST   | http://localhost:5000/api/register                |
| POST   | https://developer-arena.onrender.com/api/register |

* **Auth:** None

### Request Body

```json
{
  "username": "testuser3",
  "email": "test3@example.com",
  "password": "password123"
}
```

### ✅ Success Response — `201 Created`

```json
{
  "message": "User created successfully",
  "user": {
    "id": "69ce1c5778a4533fcebc10f1",
    "username": "testuser3",
    "email": "test3@example.com"
  }
}
```

---

### 2.2 Login

Authenticates user and returns JWT token.

| Method | URL                                            |
| ------ | ---------------------------------------------- |
| POST   | http://localhost:5000/api/login                |
| POST   | https://developer-arena.onrender.com/api/login |

* **Auth:** None

### Request Body

```json
{
  "email": "test2@example.com",
  "password": "password123"
}
```

### ✅ Success Response — `200 OK`

```json
{
  "message": "Login successful",
  "token": "<JWT_TOKEN>",
  "user": {
    "id": "69ccf07ecc8bb4659f27726a",
    "username": "testuser2",
    "email": "test2@example.com"
  }
}
```

> ⚠️ Use this token as:
> `Authorization: Bearer <JWT_TOKEN>`

---

## 3. Posts

### 3.1 Create Post (Protected)

Creates a new blog post.

| Method | URL                                            |
| ------ | ---------------------------------------------- |
| POST   | http://localhost:5000/api/posts                |
| POST   | https://developer-arena.onrender.com/api/posts |

* **Auth:** Required

### Headers

| Key           | Value                |
| ------------- | -------------------- |
| Authorization | Bearer `<JWT_TOKEN>` |

### Request Body

```json
{
  "title": "My New Post",
  "content": "This is test content with sufficient length.",
  "tags": ["test", "blog"]
}
```

### ✅ Success Response — `201 Created`

```json
{
  "message": "Post created successfully",
  "post": {
    "title": "My New Post",
    "content": "This is test content with sufficient length.",
    "tags": ["test", "blog"],
    "author": {
      "_id": "69ccf07ecc8bb4659f27726a",
      "username": "testuser2"
    },
    "_id": "69ce1c7d78a4533fcebc10f4",
    "createdAt": "2026-04-02T07:36:29.363Z",
    "updatedAt": "2026-04-02T07:36:29.363Z"
  }
}
```

---

### 3.2 Get All Posts

Fetches all blog posts (paginated).

| Method | URL                                            |
| ------ | ---------------------------------------------- |
| GET    | http://localhost:5000/api/posts                |
| GET    | https://developer-arena.onrender.com/api/posts |

* **Auth:** Optional

### Headers (Optional)

| Key           | Value                |
| ------------- | -------------------- |
| Authorization | Bearer `<JWT_TOKEN>` |

### ✅ Success Response — `200 OK`

```json
{
  "posts": [
    {
      "_id": "69ce1c7d78a4533fcebc10f4",
      "title": "My Test Post",
      "content": "This is test content with sufficient length.",
      "tags": ["test", "blog"],
      "author": {
        "_id": "69ccf07ecc8bb4659f27726a",
        "username": "testuser2"
      },
      "createdAt": "2026-04-02T07:36:29.363Z",
      "updatedAt": "2026-04-02T07:36:29.363Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  }
}
```

---