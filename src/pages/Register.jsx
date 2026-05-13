import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthSliderLayout from '../components/AuthSliderLayout';
import api from '../utils/api';
import { setStoredUser } from '../utils/auth';

const inputClassName =
  'mt-2 block w-full rounded-xl border border-[var(--color-brand-red)]/25 bg-white px-4 py-2.5 text-sm text-[var(--color-earth-brown)] shadow-sm outline-none transition focus:border-[var(--color-brand-red)] focus:ring-4 focus:ring-[var(--color-brand-red)]/14';
const MIN_PASSWORD_LENGTH = 6;

const Register = () => {
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password.trim().length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
      return;
    }

    try {
      setError('');
      const { data } = await api.post('/api/auth/register', {
        employeeNumber,
        password,
        isAdmin,
      });
      setStoredUser(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <AuthSliderLayout
      mode="register"
      badge="New Account"
      title="Register employee access"
      subtitle="Create your account with your employee number and password."
      panelTitle="Start with a simple registration flow."
      panelCopy="Register first, then complete your visiting card-style employee profile after your first sign in."
      switchPrompt="Already have credentials?"
      switchLabel="Back to login"
      switchTo="/login"
    >
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
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
            autoComplete="new-password"
            placeholder="Create a password"
            minLength={MIN_PASSWORD_LENGTH}
            required
          />
          <p className="mt-2 text-xs text-[var(--color-earth-brown)]/70">
            Password must be at least {MIN_PASSWORD_LENGTH} characters long.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--color-brand-red)]/18 bg-[var(--color-brand-red-soft)] px-4 py-3 text-sm text-[var(--color-earth-brown)]">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(event) => setIsAdmin(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[var(--color-brand-red-dark)] text-[var(--color-brand-red-dark)] focus:ring-[var(--color-brand-red)]"
          />
          <span>
            <span className="block font-semibold text-[var(--color-brand-red-dark)]">Create this account as admin</span>
            <span className="block text-xs text-[var(--color-earth-brown)]/75">
              Turn this on if this user should have admin access after signing in.
            </span>
          </span>
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-[var(--color-brand-red)] px-4 py-3 text-sm font-semibold text-[var(--color-cream-white)] shadow-[0_16px_32px_rgba(89,10,22,0.22)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--color-brand-red-dark)]"
        >
          Create account
        </button>
      </form>

      <p className="mt-5 text-sm text-[var(--color-earth-brown)]/75">
        Already have an account?{' '}
        <Link viewTransition to="/login" className="font-semibold text-[var(--color-brand-red-dark)] hover:underline">
          Login here
        </Link>
      </p>
    </AuthSliderLayout>
  );
};

export default Register;
