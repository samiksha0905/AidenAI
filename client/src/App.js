import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatProvider } from './contexts/ChatContext';
import Header from './components/Header';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import ServicePage from './pages/ServicePage';
import './App.css';

function App() {
  return (
    <ChatProvider>
      <Router>
        <div className="App">
          <Header />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:serviceUrl" element={<ServicePage />} />
            </Routes>
          </main>
          
          <Chatbot />
        </div>
      </Router>
    </ChatProvider>
  );
}

export default App;
