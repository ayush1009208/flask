"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Zap } from 'lucide-react';
import { authService } from '../api';

interface AuthFormProps {
  onLogin: (username: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = isRegistering 
        ? await authService.register(username, password)
        : await authService.login(username, password);

      const data = await response.json();

      if (response.ok) {
        onLogin(data.username);
        setUsername('');
        setPassword('');
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl"
      >
        <h1 className="text-3xl text-white text-center mb-4">{isRegistering ? 'Register' : 'Login'}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="w-full p-3 bg-white/20 backdrop-blur-lg rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
            required
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3 bg-white/20 backdrop-blur-lg rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
            required
          />
          
          {error && <p className="text-red-500 text-center">{error}</p>}
          
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            {isLoading ? 'Loading...' : isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button 
            onClick={() => setIsRegistering(!isRegistering)} 
            className="text-white hover:underline"
          >
            {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;  // Export the component as default
