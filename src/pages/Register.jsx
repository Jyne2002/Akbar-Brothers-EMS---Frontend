import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthSliderLayout from '../components/AuthSliderLayout';
import { COMPANIES } from '../constants/companies';
import api from '../utils/api';
import { setStoredUser } from '../utils/auth';

const inputClassName =
  'mt-2 block w-full rounded-xl border border-[var(--color-brand-red)]/25 bg-white px-4 py-2.5 text-sm text-[var(--color-earth-brown)] shadow-sm outline-none transition focus:border-[var(--color-brand-red)] focus:ring-4 focus:ring-[var(--color-brand-red)]/14';
const MIN_PASSWORD_LENGTH = 6;
const PHONE_NUMBER_LENGTH = 10;
const EXTENSION_NUMBER_MAX_LENGTH = 6;

const getPhoneNumberError = (value) =>
  value && value.length !== PHONE_NUMBER_LENGTH
    ? `Phone number must be exactly ${PHONE_NUMBER_LENGTH} digits`
    : '';
const getMobileNumberError = (value) =>
  value && value.length !== PHONE_NUMBER_LENGTH
    ? `Mobile number must be exactly ${PHONE_NUMBER_LENGTH} digits`
    : '';
const getExtensionNumberError = (value) =>
  value && !/^\d{1,6}$/.test(String(value || '').trim()) ? 'EXT number must be 1 to 6 digits' : '';
const getEmailError = (value) =>
  value && !String(value || '').trim().includes('@') ? 'Email address must include @' : '';

const initialFormData = {
  employeeNumber: '',
  password: '',
  fullName: '',
  department: '',
  jobRole: '',
  phoneNumber: '',
  mobileNumber: '',
  email: '',
  extensionNumber: '',
  linkedinUrl: '',
  company: '',
};

const Register = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const phoneNumberError = getPhoneNumberError(formData.phoneNumber);
  const mobileNumberError = getMobileNumberError(formData.mobileNumber);
  const extensionNumberError = getExtensionNumberError(formData.extensionNumber);
  const emailError = getEmailError(formData.email);

  const handleChange = (field, value) => {
    const nextValue =
      field === 'phoneNumber' || field === 'mobileNumber'
        ? value.replace(/\D/g, '').slice(0, PHONE_NUMBER_LENGTH)
        : field === 'extensionNumber'
          ? value.replace(/\D/g, '').slice(0, EXTENSION_NUMBER_MAX_LENGTH)
          : value;

    setError('');
    setFormData((currentValue) => ({
      ...currentValue,
      [field]: nextValue,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (
      !formData.employeeNumber.trim() ||
      !formData.password.trim() ||
      !formData.fullName.trim() ||
      !formData.department.trim() ||
      !formData.jobRole.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.mobileNumber.trim() ||
      !formData.email.trim() ||
      !formData.company.trim()
    ) {
      setError('Please complete all required fields before registering');
      return;
    }

    if (formData.password.trim().length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
      return;
    }

    if (phoneNumberError) {
      setError(phoneNumberError);
      return;
    }

    if (mobileNumberError) {
      setError(mobileNumberError);
      return;
    }

    if (emailError) {
      setError(emailError);
      return;
    }

    if (extensionNumberError) {
      setError(extensionNumberError);
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);
      const { data } = await api.post('/api/auth/register', formData);
      setStoredUser(data);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthSliderLayout
      title="Create Account"
      subtitle="Set up your employee profile while creating your account."
      switchPrompt="Already have an account?"
      switchLabel="Login"
      switchTo="/login"
      containerClassName="max-w-3xl"
    >
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-[var(--color-earth-brown)]">
            Employee number
          </label>
          <input
            type="text"
            value={formData.employeeNumber}
            onChange={(e) => handleChange('employeeNumber', e.target.value)}
            className={inputClassName}
            autoComplete="username"
            placeholder="AB-1024"
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--color-earth-brown)]">
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className={inputClassName}
            autoComplete="new-password"
            placeholder="Create a password"
            minLength={MIN_PASSWORD_LENGTH}
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--color-earth-brown)]">
            Full name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className={inputClassName}
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--color-earth-brown)]">
            Department
          </label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
            className={inputClassName}
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--color-earth-brown)]">
            Role
          </label>
          <input
            type="text"
            value={formData.jobRole}
            onChange={(e) => handleChange('jobRole', e.target.value)}
            className={inputClassName}
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--color-earth-brown)]">
            Phone number
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            className={inputClassName}
            inputMode="numeric"
            pattern="\d{10}"
            maxLength={PHONE_NUMBER_LENGTH}
            placeholder="0112697151"
            disabled={isSubmitting}
            required
          />
          {phoneNumberError && <p className="mt-2 text-xs text-[var(--color-earth-brown)]">{phoneNumberError}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--color-earth-brown)]">
            Mobile number
          </label>
          <input
            type="tel"
            value={formData.mobileNumber}
            onChange={(e) => handleChange('mobileNumber', e.target.value)}
            className={inputClassName}
            inputMode="numeric"
            pattern="\d{10}"
            maxLength={PHONE_NUMBER_LENGTH}
            placeholder="0771234567"
            disabled={isSubmitting}
            required
          />
          {mobileNumberError && <p className="mt-2 text-xs text-[var(--color-earth-brown)]">{mobileNumberError}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--color-earth-brown)]">
            Email address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={inputClassName}
            autoComplete="email"
            disabled={isSubmitting}
            required
          />
          {emailError && <p className="mt-2 text-xs text-[var(--color-earth-brown)]">{emailError}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--color-earth-brown)]">
            EXT number (optional)
          </label>
          <input
            type="tel"
            value={formData.extensionNumber}
            onChange={(e) => handleChange('extensionNumber', e.target.value)}
            className={inputClassName}
            inputMode="numeric"
            pattern="\d{1,6}"
            maxLength={EXTENSION_NUMBER_MAX_LENGTH}
            placeholder="247"
            disabled={isSubmitting}
          />
          {extensionNumberError && (
            <p className="mt-2 text-xs text-[var(--color-earth-brown)]">{extensionNumberError}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-[var(--color-earth-brown)]">
            LinkedIn profile (optional)
          </label>
          <input
            type="url"
            value={formData.linkedinUrl}
            onChange={(e) => handleChange('linkedinUrl', e.target.value)}
            className={inputClassName}
            placeholder="linkedin.com/in/your-profile"
            disabled={isSubmitting}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-[var(--color-earth-brown)]">
            Company
          </label>
          <select
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            className={inputClassName}
            disabled={isSubmitting}
            required
          >
            <option value="">Select company</option>
            {COMPANIES.map((company) => (
              <option key={company.code} value={company.code}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand-red)] px-4 py-3 text-sm font-semibold text-[var(--color-cream-white)] shadow-[0_16px_32px_rgba(89,10,22,0.22)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--color-brand-red-dark)] disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:translate-y-0 disabled:hover:bg-[var(--color-brand-red)] sm:col-span-2"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Create Account
        </button>
      </form>
    </AuthSliderLayout>
  );
};

export default Register;
