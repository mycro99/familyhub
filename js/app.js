import { auth } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const appLoading = document.getElementById("app-loading");
const appContent = document.getElementById("app-content");
const welcomeMessage = document.getElementById("welcome-message");
const themeToggle = document.getElementById("theme-toggle");
const logoutButton = document.getElementById("logout-button");

initializeTheme();

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.replace("index.html");
    return;
  }

  displayUser(user);

  appLoading.classList.add("hidden");
  appContent.classList.remove("hidden");
});

themeToggle.addEventListener("click", () => {
  const darkThemeEnabled = document.body.classList.toggle("dark-theme");

  localStorage.setItem(
    "familyHubTheme",
    darkThemeEnabled ? "dark" : "light"
  );

  updateThemeButton();
});

logoutButton.addEventListener("click", async () => {
  logoutButton.disabled = true;

  try {
    await signOut(auth);
    window.location.replace("index.html");
  } catch (error) {
    console.error("Erreur pendant la déconnexion :", error);
    logoutButton.disabled = false;
  }
});

function initializeTheme() {
  const savedTheme = localStorage.getItem("familyHubTheme");

  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const shouldUseDarkTheme =
    savedTheme === "dark" ||
    (!savedTheme && systemPrefersDark);

  document.body.classList.toggle(
    "dark-theme",
    shouldUseDarkTheme
  );

  updateThemeButton();
}

function updateThemeButton() {
  const darkThemeEnabled =
    document.body.classList.contains("dark-theme");

  themeToggle.textContent = darkThemeEnabled ? "☀️" : "🌙";

  themeToggle.setAttribute(
    "aria-label",
    darkThemeEnabled
      ? "Activer le thème clair"
      : "Activer le thème sombre"
  );
}

function displayUser(user) {
  const userName =
    user.displayName ||
    user.email?.split("@")[0] ||
    "la famille";

  welcomeMessage.textContent = `Bonjour ${userName} 👋`;
}
