#!/bin/bash

# Blog API Test Commands
BASE_URL="http://localhost:5000"

echo "🧪 Testing Blog API..."

# 1. Register User
echo "1. Registering user..."
curl -X POST "$BASE_URL/api/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

echo -e "\n\n"

# 2. Login User
echo "2. Logging in..."
TOKEN=$(curl -X POST "$BASE_URL/api/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Token: $TOKEN"
echo -e "\n\n"

# 3. Create Post
echo "3. Creating post..."
curl -X POST "$BASE_URL/api/posts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "My Test Post",
    "content": "This is a test post content with sufficient length.",
    "tags": ["test", "api", "blog"]
  }'

echo -e "\n\n"

# 4. Get All Posts
echo "4. Getting all posts..."
curl -X GET "$BASE_URL/api/posts"

echo -e "\n\n"

# 5. Get User Posts
echo "5. Getting user posts..."
curl -X GET "$BASE_URL/api/user/posts" \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n\n"

# 6. Health Check
echo "6. Health check..."
curl -X GET "$BASE_URL/api/health"

echo -e "\n\n✅ API Testing Complete!"
