const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value) => EMAIL_RE.test(String(value || '').trim());

export const isValidPhone = (value) => {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length === 10 && digits[0] !== '0';
};

export const isValidUrl = (value) => {
  if (!value) return true; // optional field
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};
