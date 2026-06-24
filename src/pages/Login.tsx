import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";

// Le fournisseur Google
const googleProvider = new GoogleAuthProvider();

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Connexion avec email + mot de passe
  async function handleLogin(): Promise<void> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
  setError('Email ou mot de passe incorrect')
}
  }

  // Connexion avec Google
  async function handleGoogle(): Promise<void> {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setError("Erreur — vérif email et mot de passe (6 caractères min)");
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🔑 Se connecter</h1>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Se connecter</button>
      <button onClick={handleGoogle}>Se connecter avec Google</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;
