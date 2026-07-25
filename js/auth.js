import { auth } from "./firebase.js";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login-button");
const loginMessage = document.getElementById("login-message");
const googleLoginButton =
  document.getElementById("google-login-button");

const googleProvider = new GoogleAuthProvider();

let authCheckFinished = false;

onAuthStateChanged(auth, (user) => {
  if (user && !authCheckFinished) {
    window.location.replace("dashboard.html");
    return;
  }

  authCheckFinished = true;
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  setLoginMessage("");
  setLoadingState(true);

  try {
    await signInWithEmailAndPassword(auth, email, password);

    window.location.replace("dashboard.html");
  } catch (error) {
    console.error("Erreur de connexion :", error);

    setLoginMessage(getFriendlyErrorMessage(error.code), true);
    setLoadingState(false);
  }
});
googleLoginButton.addEventListener("click", async () => {
  googleLoginButton.disabled = true;
  setLoginMessage("");

  try {
    await signInWithPopup(auth, googleProvider);
    window.location.replace("dashboard.html");
  } catch (error) {
    console.error("Erreur de connexion Google :", error);

    if (error.code === "auth/popup-closed-by-user") {
      setLoginMessage(
        "La fenêtre de connexion Google a été fermée.",
        true
      );
    } else if (error.code === "auth/popup-blocked") {
      setLoginMessage(
        "Le navigateur a bloqué la fenêtre de connexion Google.",
        true
      );
    } else {
      setLoginMessage(
        `Erreur Google : ${error.code}`,
        true
      );
    }

    googleLoginButton.disabled = false;
  }
});

function setLoadingState(isLoading) {
  loginButton.disabled = isLoading;
  emailInput.disabled = isLoading;
  passwordInput.disabled = isLoading;

  loginButton.textContent = isLoading
    ? "Connexion..."
    : "Se connecter";
}

function setLoginMessage(message, isError = false) {
  loginMessage.textContent = message;
  loginMessage.classList.toggle("error", isError);
}

function getFriendlyErrorMessage(errorCode) {
  switch (errorCode) {
    case "auth/invalid-email":
      return "L’adresse e-mail n’est pas valide.";

    case "auth/missing-password":
      return "Veuillez saisir votre mot de passe.";

    case "auth/invalid-credential":
      return "L’adresse e-mail ou le mot de passe est incorrect.";

    case "auth/too-many-requests":
      return "Trop de tentatives. Réessayez dans quelques minutes.";

    case "auth/network-request-failed":
      return "Impossible de contacter le serveur. Vérifiez votre connexion.";

    default:
      return "Une erreur est survenue pendant la connexion.";
  }
}
