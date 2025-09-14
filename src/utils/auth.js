export const getUsers = () => JSON.parse(localStorage.getItem('users') || '[]');

export const setUsers = (users) => localStorage.setItem('users', JSON.stringify(users));

export const validatePassword = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const isLessThan10 = password.length < 10;
  if (!hasUpperCase) return 'Password must contain at least 1 uppercase letter';
  if (!hasLowerCase) return 'Password must contain at least 1 lowercase letter';
  if (!isLessThan10) return 'Password must be less than 10 characters';
  return null;
}; 