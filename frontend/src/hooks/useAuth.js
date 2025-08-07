import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function useAuth() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      localStorage.removeItem('token');
      return null;
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (!token) return setUser(null);

      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch {
        localStorage.removeItem('token');
        setUser(null);
      }
    }, 1000); 

    return () => clearInterval(interval);
  }, []);

  return user;
}
