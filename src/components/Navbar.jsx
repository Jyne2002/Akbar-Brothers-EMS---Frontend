import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { clearStoredUser, getStoredUser, subscribeToStoredUser } from '../utils/auth';

const navLinkClassName = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? 'bg-white/86 text-[var(--color-brand-red-dark)] shadow-sm'
      : 'text-[var(--color-brand-ink)] hover:bg-white/55 hover:text-[var(--color-brand-red-dark)]'
  }`;

const Navbar = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(() => getStoredUser());

  useEffect(() => subscribeToStoredUser(setUserInfo), []);

  const handleLogout = () => {
    clearStoredUser();
    navigate('/login');
  };

  const displayName =
    userInfo?.fullName?.trim() || userInfo?.employeeNumber || userInfo?.email || 'Employee';

  return (
    <nav className="sticky top-0 z-40 border-b border-black/6 bg-white/35 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
            <Link
              to="/"
              aria-label="Akbar Brothers EMS home"
              className="flex w-fit items-center"
            >
              <img
                src="/akbar-corporate-logo.png"
                alt="Akbar Brothers corporate logo"
                className="h-12 w-auto object-contain"
              />
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <NavLink to="/" end className={navLinkClassName}>
                Home
              </NavLink>
              {userInfo?.role === 'admin' && (
                <NavLink to="/admin" className={navLinkClassName}>
                  Admin Panel
                </NavLink>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-full border border-black/8 bg-white/70 px-4 py-2.5 text-[var(--color-brand-ink)] shadow-sm backdrop-blur-sm lg:min-w-[19rem]">
            <span className="truncate text-sm font-semibold">
              {displayName}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-brand-red)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-red-dark)]"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
