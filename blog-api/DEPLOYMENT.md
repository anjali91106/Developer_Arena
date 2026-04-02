# 🚀 Deployment Guide

## 🔍 Debugging 500 Internal Server Error

### **Common Causes & Solutions**

#### **1. Environment Variables Missing**
**Problem**: Database connection fails on deployment
**Solution**: Set these environment variables in your hosting platform:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-api
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
NODE_ENV=production
PORT=5000
```

#### **2. MongoDB Connection Issues**
**Problem**: Database not accessible from deployed app
**Solutions**:
- **MongoDB Atlas**: Whitelist your deployment IP (0.0.0.0/0 for all)
- **Local DB**: Use cloud database, not local
- **Connection String**: Use `mongodb+srv://` for Atlas

#### **3. Build/Start Script Issues**
**Problem**: Different start command needed for production
**Solution**: Update package.json:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## 🛠️ Render.com Specific Fixes

### **1. Environment Variables in Render**
```bash
# In Render Dashboard → Service → Environment
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/blog-api
JWT_SECRET=your-production-secret-key-32-chars-min
NODE_ENV=production
PORT=5000
```

### **2. Build Command**
```json
"scripts": {
  "start": "node server.js"
}
```

### **3. Health Check Path**
Your health check works, so routing is correct. The issue is likely:
- Database connection
- Missing environment variables
- Model/Controller errors

## 🧪 Testing Fixes

### **1. Test Database Connection**
Add this to your deployed app logs:

```javascript
// In server.js
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  console.log('📍 DB URI:', process.env.MONGODB_URI);
})
.catch(err => {
  console.error('❌ MongoDB error:', err.message);
  process.exit(1);
});
```

### **2. Test Individual Endpoints**
```bash
# Test health (working)
curl https://developer-arena.onrender.com/api/health

# Test posts (failing)
curl https://developer-arena.onrender.com/api/posts

# Check response details
curl -v https://developer-arena.onrender.com/api/posts
```

## 🚨 Quick Fix Checklist

### **Before Deploying:**
- [ ] MongoDB Atlas IP whitelisted (0.0.0.0/0)
- [ ] Environment variables set in hosting platform
- [ ] Database connection string uses `mongodb+srv://`
- [ ] JWT_SECRET is at least 32 characters
- [ ] NODE_ENV=production

### **After Deploying:**
- [ ] Check deployment logs for database errors
- [ ] Test health endpoint first
- [ ] Test posts endpoint with detailed logging
- [ ] Verify all environment variables are loaded

## 📱 Monitoring

### **Add Production Logging**
```javascript
// Add to controllers
console.log('📍 Environment:', process.env.NODE_ENV);
console.log('📍 Database connected:', !!mongoose.connection.readyState);
```

### **Check Render Logs**
1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab
4. Look for MongoDB connection errors

## 🆘️ Emergency Fix

If still getting 500 errors, add this fallback:

```javascript
// In postController.js
const getAllPosts = async (req, res, next) => {
  try {
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: 'Database not connected' 
      });
    }
    
    // Your existing code...
  } catch (err) {
    console.error('❌ getAllPosts error:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
```

## 🎯 Most Likely Issue

**90% chance it's environment variables:**
1. `MONGODB_URI` not set or incorrect
2. `JWT_SECRET` not set
3. Database IP not whitelisted

**Check your Render dashboard environment variables!**
