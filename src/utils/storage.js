import { encrypt, decrypt } from './crypto';

export const Storage = {
  set(key, value) {
    localStorage.setItem(key, encrypt(value));
  },

  get(key) {
    const value = localStorage.getItem(key);

    if (!value) return null;

    return decrypt(value);
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  },
};
