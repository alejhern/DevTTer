import { GithubAuthProvider, signInWithPopup } from "firebase/auth";

import { auth } from "./app";

// export const getCurrentUser = async (): Promise<User | null> => {
//   const firebaseUser = auth.currentUser;

//   if (!firebaseUser) return null;

//   // Recuperamos el token guardado
//   const token = localStorage.getItem("github_token");

//   if (token) {
//     // Llamamos a GitHub API
//     const response = await fetch("https://api.github.com/user", {
//       headers: { Authorization: `token ${token}` },
//     });
//     const githubUser = await response.json();

//     const user: User = {
//       id: firebaseUser.uid,
//       userName: githubUser.login,
//       name: firebaseUser.displayName || githubUser.name || "GitHub User",
//       email: firebaseUser.email || githubUser.email || "",
//       avatar: firebaseUser.photoURL || githubUser.avatar_url || "",
//     };

//     return user;
//   }

//   console.warn("No se encontró token de GitHub, devolviendo usuario temporal");
//   console.warn("Firebase UID:", firebaseUser);

//   // Si no hay token, devolvemos UID temporal
//   return {
//     id: firebaseUser.uid,
//     userName: firebaseUser.uid,
//     name: firebaseUser.displayName || "User",
//     email: firebaseUser.email || "",
//     avatar: firebaseUser.photoURL || "",
//   };
// };

// LOGIN con GitHub
export const loginWithGithub = async () => {
  const provider = new GithubAuthProvider();
  const result = await signInWithPopup(auth, provider);

  // Aquí sí tenemos el token
  const credential = GithubAuthProvider.credentialFromResult(result);
  const token = credential?.accessToken;

  if (!token) throw new Error("No se pudo obtener token de GitHub");
  localStorage.setItem("github_token", token);
};
