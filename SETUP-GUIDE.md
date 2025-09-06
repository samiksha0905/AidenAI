# 🚀 Service Navigator - Complete Setup Guide

## Prerequisites

### Required Software:
1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** (Community Edition) - [Download](https://www.mongodb.com/try/download/community)
3. **Google AI Studio Account** - [Get API Key](https://makersuite.google.com/app/apikey)

---

## 📋 Step-by-Step Setup

### 1. Install MongoDB (Local)

**Option A: MongoDB Community Server (Recommended for Development)**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install with default settings
3. MongoDB will run as a Windows Service automatically

**Option B: MongoDB Atlas (Cloud Database)**
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get connection string (replace `<username>`, `<password>`, `<cluster-url>`)

**Option C: Using Docker**
```bash
docker run --name mongodb -p 27017:27017 -d mongo:latest
```

### 2. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 3. Configure Environment Variables

**Edit `server/.env` file:**
```env
PORT=5001

# MongoDB Configuration (choose one)
# For Local MongoDB:
MONGO_URI=mongodb://localhost:27017/service_navigator

# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/service_navigator?retryWrites=true&w=majority

# Gemini API Key (replace with your actual key)
GEMINI_API_KEY=your_actual_gemini_api_key_here

NODE_ENV=development

# Set to false to use MongoDB, true to use mock data
USE_MOCK_DATA=false
```

### 4. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 5. Seed the Database (If using MongoDB)

```bash
cd server
npm run seed
```

This creates sample services in your database.

---

## 🚀 Running the Application

### Method 1: Automatic Start (Windows)
Double-click `start-app.bat` in the root directory.

### Method 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

---

## 🔗 Application URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001
- **API Health Check:** http://localhost:5001/health

---

## 🤖 Testing the Chatbot

### New JSON Format API Endpoint: `/api/match`

**Test with curl:**
```bash
curl -X POST http://localhost:5001/api/match \
  -H "Content-Type: application/json" \
  -d '{"query": "I need a plumber"}'
```

**Expected Response:**
```json
{
  "internal": {
    "match": "Plumbing Services",
    "route": "/plumbing"
  },
  "external": [
    "https://www.google.com/search?q=plumber",
    "https://en.wikipedia.org/wiki/Plumbing"
  ]
}
```

### Test Queries:

1. **"I need a plumber"** → Should navigate to `/plumbing`
2. **"help with math"** → Should navigate to `/tutoring`  
3. **"house cleaning"** → Should navigate to `/cleaning`
4. **"random question"** → Should show external links

---

## 🛠️ Configuration Options

### Running with Mock Data (No MongoDB Required)

Edit `server/.env`:
```env
USE_MOCK_DATA=true
# MONGO_URI=... (comment out)
```

### Running with MongoDB

Edit `server/.env`:
```env
USE_MOCK_DATA=false
MONGO_URI=mongodb://localhost:27017/service_navigator
```

---

## 🔍 Troubleshooting

### MongoDB Connection Issues:
- Ensure MongoDB service is running
- Check connection string format
- Verify network connectivity for Atlas

### Gemini API Issues:
- Verify API key is correct
- Check API quotas and limits
- App works with fallback if API fails

### Port Conflicts:
- Change ports in `.env` if needed
- Default: Backend (5001), Frontend (3000)

### CORS Issues:
- Backend configured for localhost:3000
- Update CORS settings if using different port

---

## 📊 API Endpoints

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:url` - Get single service
- `POST /api/services` - Create service (admin)

### Chatbot
- `POST /api/match` - New format with internal/external response
- `POST /api/chat` - Legacy format for compatibility

### Health
- `GET /health` - API health status

---

## 🎯 Key Features

✅ **AI-Powered Chatbot** with Gemini integration  
✅ **Auto-Navigation** to matched services  
✅ **External Reference Links** for unmatched queries  
✅ **MongoDB Integration** with fallback to mock data  
✅ **Responsive Design** with modern UI/UX  
✅ **Real-time Chat Interface** with typing indicators  

---

## 🔒 Production Deployment

### Environment Variables for Production:
```env
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
GEMINI_API_KEY=your_production_gemini_key
PORT=80
```

### Build Frontend:
```bash
cd client
npm run build
```

### Serve Static Files:
Add to `server.js`:
```javascript
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
```

---

## 🎉 You're All Set!

Your Service Navigator application is now ready with:
- MongoDB database connection
- Gemini AI chatbot integration  
- Auto-navigation functionality
- Modern responsive UI
- Professional error handling

**Happy coding! 🚀**
