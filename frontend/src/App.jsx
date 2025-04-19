import React from 'react';
import ChatbotUI from './components/ChatbotUI';
import Dashboard from './components/Dashboard';

export default function App() {
  return (
    <div className="dark bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Harmony Link</h1>
      <ChatbotUI />
      <Dashboard />
    </div>
  );
}
