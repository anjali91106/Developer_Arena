#!/bin/bash

# Complete CRUD Test for Blog API
BASE_URL="http://localhost:5000/api"

echo "🧪 Testing Complete CRUD Operations"
echo "=================================="

# Health Check
echo "🏥 Health Check..."
curl -s "$BASE_URL/health" | jq .
echo ""

# Register User
echo "👤 Register User..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }')
echo "$REGISTER_RESPONSE" | jq .

# Login and Get Token
echo ""
echo "🔑 Login User..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
echo "Token: $TOKEN"

# CREATE Post
echo ""
echo "📝 CREATE Post (POST)..."
POST_RESPONSE=$(curl -s -X POST "$BASE_URL/posts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post with sufficient length.",
    "tags": ["javascript", "nodejs", "express"]
  }')
echo "$POST_RESPONSE" | jq .
POST_ID=$(echo "$POST_RESPONSE" | jq -r '.post._id')

# GET All Posts
echo ""
echo "📚 GET All Posts..."
curl -s "$BASE_URL/posts" | jq .

# GET Single Post
echo ""
echo "📖 GET Single Post..."
curl -s "$BASE_URL/posts/$POST_ID" | jq .

# UPDATE Post
echo ""
echo "✏️ UPDATE Post (PUT)..."
curl -s -X PUT "$BASE_URL/posts/$POST_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Updated Blog Post",
    "content": "This is the updated content with sufficient length.",
    "tags": ["updated", "modified"]
  }' | jq .

# GET User Posts
echo ""
echo "👤 GET User Posts..."
curl -s "$BASE_URL/user/posts" \
  -H "Authorization: Bearer $TOKEN" | jq .

# DELETE Post
echo ""
echo "🗑️ DELETE Post..."
curl -s -X DELETE "$BASE_URL/posts/$POST_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo ""
echo "🎉 CRUD Testing Complete!"
echo "========================="
