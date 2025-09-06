# Service Navigator - MERN Stack with AI Chatbot

A modern, responsive web application that connects users with professional service providers. Features an intelligent AI-powered chatbot using the Gemini API for smart navigation and assistance.

## 🚀 Features

- **Intelligent Chatbot**: AI-powered chatbot using Google's Gemini API
- **Smart Navigation**: Contextual navigation to specific services and sections
- **Responsive Design**: Modern, mobile-first design with smooth animations
- **Service Management**: Complete CRUD operations for services
- **Real-time Chat**: Interactive chat interface with typing indicators
- **Dynamic Routing**: React Router for seamless navigation
- **Modern UI/UX**: Professional design with glassmorphism effects

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Google Generative AI** - Gemini API integration
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Modern icon library
- **CSS3** - Modern styling with custom properties

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Gemini API key from Google AI Studio

### 1. Clone the repository
```bash
git clone <repository-url>
cd service-navigator
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/service_navigator
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

### 4. Database Setup
Seed the database with sample data:
```bash
cd ../server
npm run seed
```

## 🚦 Running the Application

### Start the Backend
```bash
cd server
npm start
# or for development
npm run dev
```

### Start the Frontend
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## 🤖 Chatbot Features

The AI chatbot can:
- Navigate users to specific services (e.g., "I need a plumber")
- Direct to service subsections (e.g., "help with leaky faucet")
- Provide general information and assistance
- Handle natural language queries
- Gracefully fallback when Gemini API is unavailable

## 📱 Service Categories

- 🔧 **Plumbing Services** - Pipes, faucets, toilets
- 📚 **Tutoring Services** - Math, science, language arts
- 🌿 **Landscaping** - Lawn care, garden design, tree services
- 🧽 **House Cleaning** - Regular, deep, move-in/out cleaning
- ⚡ **Electrical Services** - Outlets, lighting, repairs
- 🌡️ **HVAC Services** - Heating, cooling, ventilation

## 🎨 Design Features

- **Modern Glassmorphism UI**
- **Smooth Animations**
- **Responsive Grid Layouts**
- **Interactive Hover Effects**
- **Professional Color Scheme**
- **Mobile-First Design**

## 📊 API Endpoints

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:url` - Get single service
- `POST /api/services` - Create new service

### Chatbot
- `POST /api/chat` - Chat with AI assistant

### Health Check
- `GET /health` - API health status

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/service_navigator
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

#### Frontend (.env.local) - Optional
```env
REACT_APP_API_URL=http://localhost:5001/api
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use local MongoDB
2. Configure environment variables
3. Deploy to platforms like Heroku, Vercel, or Railway

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or Firebase

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google AI for the Gemini API
- MongoDB for the database
- React community for the amazing ecosystem
- Lucide for the beautiful icons
