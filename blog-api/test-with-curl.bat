@echo off
echo 🧪 Testing Blog API...

set BASE_URL=http://localhost:5000

echo 1. Registering user...
curl -X POST "%BASE_URL%/api/register" -H "Content-Type: application/json" -d "{\"username\": \"testuser\", \"email\": \"test@example.com\", \"password\": \"password123\"}"

echo.
echo.

echo 2. Logging in...
for /f "tokens=2 delims=:," %%i in ('curl -X POST "%BASE_URL%/api/login" -H "Content-Type: application/json" -d "{\"email\": \"test@example.com\", \"password\": \"password123\"}" ^| findstr "token"') do set TOKEN=%%i
set TOKEN=%TOKEN:"=%
set TOKEN=%TOKEN:}=%

echo Token: %TOKEN%
echo.
echo.

echo 3. Creating post...
curl -X POST "%BASE_URL%/api/posts" -H "Content-Type: application/json" -H "Authorization: Bearer %TOKEN%" -d "{\"title\": \"My Test Post\", \"content\": \"This is a test post content with sufficient length.\", \"tags\": [\"test\", \"api\", \"blog\"]}"

echo.
echo.

echo 4. Getting all posts...
curl -X GET "%BASE_URL%/api/posts"

echo.
echo.

echo 5. Getting user posts...
curl -X GET "%BASE_URL%/api/user/posts" -H "Authorization: Bearer %TOKEN%"

echo.
echo.

echo 6. Health check...
curl -X GET "%BASE_URL%/api/health"

echo.
echo ✅ API Testing Complete!
pause
