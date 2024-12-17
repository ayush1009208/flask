import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { authService } from './api';

interface AuthFormProps {
  onLogin: (username: string) => void;
}

export const AuthForm1: React.FC<AuthFormProps> = ({ onLogin }) => {
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
      // Make sure authService functions are defined
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
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          {isRegistering ? 'Register' : 'Login'}
        </h2>
        {error && (
          <div className="text-red-600 text-center mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-3 rounded-lg text-white ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-700 hover:bg-purple-800'
            }`}
          >
            {isLoading ? 'Processing...' : isRegistering ? 'Register' : 'Login'}
          </button>
        </form>
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full mt-4 text-sm text-blue-300 hover:underline"
        >
          {isRegistering
            ? 'Already have an account? Login'
            : 'Don’t have an account? Register'}
        </button>
      </motion.div>
    </div>
  );
};
