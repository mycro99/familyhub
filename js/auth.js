import { auth } from "./firebase.js";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login-button");
const loginMessage = document.getElementById("login-message");

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
