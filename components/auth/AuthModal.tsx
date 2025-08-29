import React, { useState } from 'react';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        setError("Please enter both email and password.");
        return;
    }
    // This is a simulated login. In a real app, you would call Firebase Auth here.
    // e.g., firebase.auth().signInWithEmailAndPassword(email, password)
    setError('');
    console.log(`Simulating ${isLogin ? 'login' : 'sign up'} for ${email}`);
    onLoginSuccess(email);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">&times;</button>
        </div>
        
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          This is a simulated auth screen. Any valid email/password will work.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setError(''); }} className="inline-block align-baseline font-bold text-sm text-indigo-500 hover:text-indigo-700">
            {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
          </a>
        </div>
        
        <div className="my-4 flex items-center">
            <hr className="flex-grow border-t dark:border-gray-600" /><span className="mx-4 text-xs text-gray-500">OR</span><hr className="flex-grow border-t dark:border-gray-600" />
        </div>
        
        <div className="space-y-2">
            <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg">Continue with Google</button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Continue with Phone</button>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
