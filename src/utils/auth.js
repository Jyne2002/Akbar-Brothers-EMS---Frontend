const USER_INFO_KEY = 'userInfo';
const USER_INFO_EVENT = 'user-info-updated';

export const getStoredUser = () => {
  try {
    const rawValue = localStorage.getItem(USER_INFO_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(USER_INFO_EVENT));
};

export const clearStoredUser = () => {
  localStorage.removeItem(USER_INFO_KEY);
  window.dispatchEvent(new Event(USER_INFO_EVENT));
};

export const subscribeToStoredUser = (callback) => {
  const notify = () => callback(getStoredUser());

  window.addEventListener(USER_INFO_EVENT, notify);
  window.addEventListener('storage', notify);

  return () => {
    window.removeEventListener(USER_INFO_EVENT, notify);
    window.removeEventListener('storage', notify);
  };
};
