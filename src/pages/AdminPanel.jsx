import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building2, Eye, Mail, Phone, RefreshCw, Search, Users } from 'lucide-react';
import { COMPANIES, getCompanyCode, getCompanyLabel } from '../constants/companies';
import api from '../utils/api';
import { getStoredUser } from '../utils/auth';

const inputClassName =
  'w-full rounded-2xl border border-black/10 bg-[#f4f4f4] px-4 py-3 text-sm text-black outline-none transition focus:border-black/20 focus:ring-4 focus:ring-black/8';
const activeFilterButtonClassName =
  'border border-[var(--color-brand-red)] bg-[var(--color-brand-red)] text-white shadow-[0_14px_28px_rgba(142,20,36,0.18)]';
const primaryButtonClassName =
  'rounded-full border border-[var(--color-brand-red)] bg-[var(--color-brand-red)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-red-dark)]';
const compactPrimaryButtonClassName =
  'rounded-full border border-[var(--color-brand-red)] bg-[var(--color-brand-red)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-red-dark)]';
const disabledPrimaryButtonClassName =
  'disabled:cursor-not-allowed disabled:border-[var(--color-brand-red)]/45 disabled:bg-[var(--color-brand-red)]/45 disabled:text-white/80';

const matchesUserSearch = (user, searchValue) => {
  const normalizedSearch = searchValue.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  return [
    user.employeeNumber,
    user.fullName,
    user.email,
    user.department,
    user.jobRole,
    user.phoneNumber,
    user.company,
    getCompanyLabel(user.company),
    user.role,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(normalizedSearch);
};

const sortUsers = (records) =>
  [...records].sort((firstUser, secondUser) =>
    (firstUser.fullName || firstUser.employeeNumber || '').localeCompare(
      secondUser.fullName || secondUser.employeeNumber || '',
    ),
  );

const AdminPanel = () => {
  const userInfo = getStoredUser();
  const [activeSection, setActiveSection] = useState('admins');
  const [selectedCompany, setSelectedCompany] = useState(COMPANIES[0]?.code || 'A');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedPromotionUserId, setSelectedPromotionUserId] = useState('');

  useEffect(() => {
    if (!success) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setSuccess('');
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [success]);

  const requestConfig = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${userInfo?.token}` },
    }),
    [userInfo?.token],
  );

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const { data } = await api.get('/api/auth/users', requestConfig);
      setUsers(data);
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || 'Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  }, [requestConfig]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (
      selectedPromotionUserId &&
      !users.some((user) => String(user._id) === selectedPromotionUserId && user.role !== 'admin')
    ) {
      setSelectedPromotionUserId('');
    }
  }, [selectedPromotionUserId, users]);

  const adminUsers = useMemo(
    () =>
      sortUsers(users.filter((user) => user.role === 'admin' && matchesUserSearch(user, userSearch))),
    [userSearch, users],
  );

  const eligibleUsers = useMemo(
    () => sortUsers(users.filter((user) => user.role !== 'admin')),
    [users],
  );

  const employeeRecords = useMemo(
    () =>
      sortUsers(
        users.filter(
          (user) =>
            getCompanyCode(user.company) === selectedCompany && matchesUserSearch(user, employeeSearch),
        ),
      ),
    [employeeSearch, selectedCompany, users],
  );

  const handleRoleToggle = async (user) => {
    const nextRole = user.role === 'admin' ? 'employee' : 'admin';
    const actionLabel =
      nextRole === 'admin' ? 'grant admin access to' : 'remove admin access from';

    if (
      !window.confirm(
        `Are you sure you want to ${actionLabel} ${user.fullName || user.employeeNumber}?`,
      )
    ) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await api.put(`/api/auth/users/${user._id}/role`, { role: nextRole }, requestConfig);
      await fetchUsers();
      setSuccess(
        `${user.fullName || user.employeeNumber} is now ${
          nextRole === 'admin' ? 'an admin' : 'an employee'
        }.`,
      );
    } catch (toggleError) {
      setError(toggleError.response?.data?.message || 'Failed to update user role');
    }
  };

  const handlePromoteSelectedUser = async () => {
    const selectedUser = eligibleUsers.find((user) => String(user._id) === selectedPromotionUserId);
    if (!selectedUser) {
      setError('Choose an employee account before granting admin access');
      setSuccess('');
      return;
    }

    await handleRoleToggle(selectedUser);
    setSelectedPromotionUserId('');
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Delete the account for ${user.fullName || user.employeeNumber}?`)) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await api.delete(`/api/auth/users/${user._id}`, requestConfig);
      await fetchUsers();
      setSuccess(`${user.fullName || user.employeeNumber} was removed from the system.`);
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Failed to delete user');
    }
  };

  const selectedCompanyLabel = getCompanyLabel(selectedCompany);

  return (
    <div className="space-y-8 pb-12 pt-4 animate-in fade-in duration-500">
      <section className="rounded-[2rem] border border-black/8 bg-[linear-gradient(135deg,_rgba(255,255,255,0.97)_0%,_rgba(241,241,241,0.94)_100%)] p-7 shadow-[0_28px_60px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black">
              Admin Panel
            </p>
            <h1 className="mt-2 text-4xl font-black text-black">Manage employees and access</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveSection('admins')}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                activeSection === 'admins'
                  ? activeFilterButtonClassName
                  : 'border border-black/10 bg-white text-black hover:bg-[#f3f3f3]'
              }`}
            >
              Manage Admins
            </button>
            <button
              onClick={() => setActiveSection('employees')}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                activeSection === 'employees'
                  ? activeFilterButtonClassName
                  : 'border border-black/10 bg-white text-black hover:bg-[#f3f3f3]'
              }`}
            >
              Manage Employees
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-black/10 bg-[#f3f3f3] px-4 py-3 text-sm text-black">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-black/10 bg-[#f3f3f3] px-4 py-3 text-sm text-black">
          {success}
        </div>
      )}

      {activeSection === 'admins' ? (
        <section className="rounded-[1.9rem] border border-black/8 bg-white/90 p-6 shadow-[0_22px_54px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-4 border-b border-black/10 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black text-black">Admin access management</h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-[18rem]">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(event) => setUserSearch(event.target.value)}
                  placeholder="Search users"
                  className="w-full rounded-full border border-black/10 bg-[#f4f4f4] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-black/20 focus:ring-4 focus:ring-black/8"
                />
              </div>
              <button
                onClick={fetchUsers}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#f3f3f3]"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-[1.6rem] border border-black/10 bg-[#f7f7f7] p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-2xl">
                <h3 className="text-lg font-black text-black">Grant admin access</h3>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row xl:max-w-2xl">
                <select
                  value={selectedPromotionUserId}
                  onChange={(event) => setSelectedPromotionUserId(event.target.value)}
                  className={inputClassName}
                  disabled={eligibleUsers.length === 0}
                >
                  <option value="">
                    {eligibleUsers.length === 0
                      ? 'No employee accounts available'
                      : 'Select an employee account'}
                  </option>
                  {eligibleUsers.map((user) => (
                    <option key={user._id} value={String(user._id)}>
                      {user.fullName || user.employeeNumber}{' '}
                      {user.employeeNumber ? `(${user.employeeNumber})` : ''}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handlePromoteSelectedUser}
                  disabled={!selectedPromotionUserId}
                  className={`${primaryButtonClassName} ${disabledPrimaryButtonClassName}`}
                >
                  Make admin
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {loadingUsers ? (
              <div className="flex justify-center p-10">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-black" />
              </div>
            ) : adminUsers.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-black/12 bg-[#f4f4f4] p-10 text-center text-black/65">
                No admin accounts matched that search.
              </div>
            ) : (
              adminUsers.map((user) => (
                <div
                  key={user._id}
                  className="rounded-[1.6rem] border border-black/10 bg-[#fafafa] p-5"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-[#ededed] text-black/65">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.fullName || user.employeeNumber}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Users className="h-7 w-7" />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold text-black">
                            {user.fullName || user.employeeNumber}
                          </h3>
                          <span className="rounded-full border border-black/10 bg-[#f0f0f0] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-black">
                            Admin
                          </span>
                          {user._id === userInfo?._id && (
                            <span className="rounded-full border border-black/10 bg-[#e9e9e9] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-black">
                              You
                            </span>
                          )}
                        </div>

                        <div className="mt-3 grid gap-2 text-sm text-black/70 sm:grid-cols-2">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-black/70" />
                            {user.employeeNumber || 'No employee number'}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-black/70" />
                            {user.email || 'Email not added yet'}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-black/70" />
                            {user.phoneNumber || 'Phone not added yet'}
                          </div>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-black/70" />
                            {getCompanyLabel(user.company) || 'No company added yet'}
                          </div>
                          <div className="flex items-center gap-2 sm:col-span-2">
                            <Briefcase className="h-4 w-4 text-black/70" />
                            {[user.jobRole, user.department].filter(Boolean).join(' / ') ||
                              'Role and department not added yet'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleRoleToggle(user)}
                        disabled={user._id === userInfo?._id && user.role === 'admin'}
                        className={`${compactPrimaryButtonClassName} ${disabledPrimaryButtonClassName}`}
                      >
                        Remove admin
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        disabled={user._id === userInfo?._id}
                        className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#f3f3f3] disabled:cursor-not-allowed disabled:border-black/8 disabled:text-black/35"
                      >
                        Delete user
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      ) : (
        <section className="rounded-[1.9rem] border border-black/8 bg-white/90 p-6 shadow-[0_22px_54px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-4 border-b border-black/10 pb-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-2xl font-black text-black">Employee management</h2>
            </div>

            <button
              onClick={fetchUsers}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#f3f3f3]"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              {COMPANIES.map((company) => (
                <button
                  key={company.code}
                  onClick={() => setSelectedCompany(company.code)}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    selectedCompany === company.code
                      ? activeFilterButtonClassName
                      : 'border border-black/10 bg-white text-black hover:bg-[#f3f3f3]'
                  }`}
                >
                  {company.name}
                </button>
              ))}
            </div>

            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45" />
              <input
                type="text"
                value={employeeSearch}
                onChange={(event) => setEmployeeSearch(event.target.value)}
                placeholder={`Search ${selectedCompanyLabel} employees`}
                className="w-full rounded-full border border-black/10 bg-[#f4f4f4] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-black/20 focus:ring-4 focus:ring-black/8"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {loadingUsers ? (
              <div className="flex justify-center p-10">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-black" />
              </div>
            ) : employeeRecords.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-black/12 bg-[#f4f4f4] p-10 text-center text-black/65">
                No employee records found for {selectedCompanyLabel}.
              </div>
            ) : (
              employeeRecords.map((user) => (
                <div
                  key={user._id}
                  className="rounded-[1.6rem] border border-black/10 bg-white p-5"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-[#ededed] text-black/65">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.fullName || user.employeeNumber}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Users className="h-7 w-7" />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold text-black">
                            {user.fullName || user.employeeNumber}
                          </h3>
                          <span className="rounded-full border border-black/10 bg-[#f0f0f0] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-black">
                            {user.employeeNumber || 'No employee number'}
                          </span>
                        </div>

                        <div className="mt-3 grid gap-2 text-sm text-black/70 sm:grid-cols-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-black/70" />
                            {user.email || 'Email not added yet'}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-black/70" />
                            {user.phoneNumber || 'Phone not added yet'}
                          </div>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-black/70" />
                            {getCompanyLabel(user.company) || 'No company added yet'}
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-black/70" />
                            {user.department || 'Department not added yet'}
                          </div>
                          <div className="flex items-center gap-2 sm:col-span-2">
                            <Briefcase className="h-4 w-4 text-black/70" />
                            {user.jobRole || 'Role not added yet'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/admin/profile/${user._id}`}
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--color-brand-red)] bg-[var(--color-brand-red)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-red-dark)]"
                      >
                        <Eye className="h-4 w-4" />
                        View profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminPanel;
