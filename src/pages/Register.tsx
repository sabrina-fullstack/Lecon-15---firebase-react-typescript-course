import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function handleRegister(): Promise<void> {
    try {
      // Crée le compte dans Firebase
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Compte créé !");
  } catch (_err: unknown) {
      setError("Erreur — vérif email et mot de passe (6 caractères min)");
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📝 Créer un compte</h1>
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
      <button onClick={handleRegister}>Créer le compte</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Register;
