import { useState } from 'react'
import ChatPrompt from './components/ChatPrompt'
import Quiz from './components/Quiz'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('chat')

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-indigo-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700 mb-4 mt-2">
        {currentView === 'chat' ? 'Chat con IA' : 'Quiz de Conocimientos'}
      </h1>

      <div className="w-full max-w-2xl mx-auto mb-4 flex justify-center space-x-4">
        <button
          onClick={() => setCurrentView('chat')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentView === 'chat'
              ? 'bg-purple-600 text-white'
              : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setCurrentView('quiz')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentView === 'quiz'
              ? 'bg-purple-600 text-white'
              : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
          }`}
        >
          Quiz
        </button>
      </div>
      
      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col">
        <div className="flex-1 flex flex-col pb-4">
          {currentView === 'chat' ? <ChatPrompt /> : <Quiz />}
        </div>
        
        <p className="text-center text-purple-600 font-medium text-sm my-2">
          Desarrollado con ❤️ para UNICATOLICA 2025
        </p>
      </div>
    </div>
  )
}

export default App
