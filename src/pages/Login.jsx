import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthSliderLayout from '../components/AuthSliderLayout';
import { setStoredUser } from '../utils/auth';

const inputClassName =
  'mt-2 block w-full rounded-xl border border-[var(--color-brand-red)]/25 bg-white px-4 py-2.5 text-sm text-[var(--color-earth-brown)] shadow-sm outline-none transition focus:border-[var(--color-brand-red)] focus:ring-4 focus:ring-[var(--color-brand-red)]/14';

const Login = () => {
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { employeeNumber, password });
      setStoredUser(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid employee number or password');
    }
  };

  return (
    <AuthSliderLayout
      mode="login"
      badge="Employee Portal"
      title="Welcome back"
      subtitle="Sign in with your employee number and password to access your EMS workspace."
      panelTitle="Akbar Brothers employee access in one secure workspace."
      panelCopy="Log in quickly, complete your employee card on first access, and manage your profile in one place."
      switchPrompt="Need a new account?"
      switchLabel="Create account"
      switchTo="/register"
    >
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[var(--color-earth-brown)]">
            Employee number
          </label>
          <input
            type="text"
            value={employeeNumber}
            onChange={(e) => setEmployeeNumber(e.target.value)}
            className={inputClassName}
            autoComplete="username"
            placeholder="AB-1024"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--color-earth-brown)]">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClassName}
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[var(--color-brand-red)] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(89,10,22,0.22)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--color-brand-red-dark)]"
        >
          Sign In
        </button>
      </form>

      <p className="mt-5 text-sm text-[var(--color-earth-brown)]/75">
        Don&apos;t have an account?{' '}
        <Link viewTransition to="/register" className="font-semibold text-[var(--color-brand-red-dark)] hover:underline">
          Register here
        </Link>
      </p>
    </AuthSliderLayout>
  );
};

export default Login;
