import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

// Ce que contient l'antenne : qui est connecté + est-ce que ça charge
interface AuthContextType {
  user: User | null; // la personne connectée (ou null si personne)
  loading: boolean; // true pendant que Firebase vérifie
}

// Création de l'antenne
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// Le composant qui entoure toute l'app et diffuse l'info
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Surveille qui est connecté — comme onSnapshot mais pour les utilisateurs
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Le raccourci pour utiliser l'antenne dans n'importe quelle page
export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

export default AuthContext;
