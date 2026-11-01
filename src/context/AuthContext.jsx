import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'estante:user';
const DEMO = { username: 'admin', password: 'estante123' };

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  });

  const login = useCallback(
    ({ username, password }) =>
      new Promise((resolve, reject) =>
        setTimeout(() => {
          if (username.trim() === DEMO.username && password === DEMO.password) {
            const next = { name: 'Admin' };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            setUser(next);
            resolve(next);
          } else {
            reject(new Error('Usuário ou senha incorretos.'));
          }
        }, 500)
      ),
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>.');
  return ctx;
};
