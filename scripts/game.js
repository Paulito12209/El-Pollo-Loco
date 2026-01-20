/**
 * El Pollo Loco - Hauptspiel-Controller
 * Enthält Initialisierung, Spielsteuerung und Dialog-Handling.
 * 
 * Sound-Management: siehe sound-manager.js
 * Mobile-Controls: siehe mobile-controls.js
 */

let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = false;
let isPaused = false;
let openedFromMenu = false;

// ===== INITIALISIERUNG =====

/**
 * Initialisiert das Spiel-Canvas und richtet Dialog-Event-Listener ein.
 */
function init() {
  canvas = document.getElementById("canvas");
  loadMuteStatus();

  const dialog = document.getElementById("gameplayInfoDialog");
  if (dialog) {
    dialog.addEventListener("click", (e) => {
      const rect = dialog.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        dialog.close();
      }
    });
  }

  const controlsDialog = document.getElementById("controlsDialog");
  if (controlsDialog) {
    controlsDialog.addEventListener("click", (e) => {
      const rect = controlsDialog.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        controlsDialog.close();
      }
    });
  }
}

// ===== SPIELSTEUERUNG =====

/**
 * Startet ein neues Spiel durch Initialisierung der World und Anzeige der Spiel-UI.
 */
function startGame() {
  init();
  hideElement("startContainer");
  keyboard = new Keyboard();
  world = new World(canvas, keyboard);

  setTimeout(() => {
    applyMuteToAllSounds();
  }, 100);

  const burgerBtn = document.getElementById("burgerMenuBtn");
  if (burgerBtn) {
    burgerBtn.classList.remove("d-none");
  }

  const mobileControls = document.getElementById("mobileControls");
  if (mobileControls) {
    mobileControls.classList.remove("d-none");
  }
}

/**
 * Versteckt ein Element durch Hinzufügen der 'd-none' Klasse.
 * @param {string} elementId - Die ID des Elements zum Verstecken
 */
function hideElement(elementId) {
  document.getElementById(elementId).classList.add("d-none");
}

/**
 * Zeigt ein Element durch Entfernen der 'd-none' Klasse.
 * @param {string} elementId - Die ID des Elements zum Anzeigen
 */
function showElement(elementId) {
  document.getElementById(elementId).classList.remove("d-none");
}

// ===== DIALOG-HANDLING =====

/**
 * Öffnet den Gameplay-Info-Dialog und pausiert das Spiel.
 */
function openGameplayInfo() {
  const dialog = document.getElementById("gameplayInfoDialog");
  if (dialog) {
    dialog.showModal();
    isPaused = true;
    pauseAllSounds();
  }
}

/**
 * Schließt den Gameplay-Info-Dialog und setzt das Spiel fort (außer wenn vom Menü geöffnet).
 */
function closeGameplayInfo() {
  const dialog = document.getElementById("gameplayInfoDialog");
  if (dialog) {
    dialog.close();
    dialog.classList.remove("over-menu");

    if (openedFromMenu) {
      openedFromMenu = false;
      // Menü ist noch im Hintergrund offen, pausiert bleiben
    } else {
      isPaused = false;
      resumeAllSounds();
    }
  }
}

/**
 * Öffnet den Steuerungs-Dialog und pausiert das Spiel.
 */
function openControls() {
  const dialog = document.getElementById("controlsDialog");
  if (dialog) {
    dialog.showModal();
    isPaused = true;
    pauseAllSounds();
  }
}

/**
 * Schließt den Steuerungs-Dialog und setzt das Spiel fort (außer wenn vom Menü geöffnet).
 */
function closeControls() {
  const dialog = document.getElementById("controlsDialog");
  if (dialog) {
    dialog.close();
    dialog.classList.remove("over-menu");

    if (openedFromMenu) {
      openedFromMenu = false;
      // Menü ist noch im Hintergrund offen, pausiert bleiben
    } else {
      isPaused = false;
      resumeAllSounds();
    }
  }
}

/**
 * Öffnet das Burger-Menü und pausiert das Spiel.
 */
function openBurgerMenu() {
  const dialog = document.getElementById("burgerMenuDialog");
  if (dialog) {
    dialog.showModal();
    isPaused = true;
    pauseAllSounds();
    updateMuteButtons();
  }
}

/**
 * Schließt das Burger-Menü und setzt das Spiel fort.
 */
function closeBurgerMenu() {
  const dialog = document.getElementById("burgerMenuDialog");
  if (dialog) {
    dialog.close();
    isPaused = false;
    resumeAllSounds();
  }
}

/**
 * Öffnet Gameplay-Info vom Burger-Menü (gestapelt, Menü bleibt sichtbar).
 */
function openGameplayInfoFromMenu() {
  openedFromMenu = true;
  const dialog = document.getElementById("gameplayInfoDialog");
  if (dialog) {
    dialog.classList.add("over-menu");
    dialog.showModal();
  }
}

/**
 * Öffnet Steuerung vom Burger-Menü (gestapelt, Menü bleibt sichtbar).
 */
function openControlsFromMenu() {
  openedFromMenu = true;
  const dialog = document.getElementById("controlsDialog");
  if (dialog) {
    dialog.classList.add("over-menu");
    dialog.showModal();
  }
}

/**
 * Kehrt zum Startbildschirm vom Burger-Menü zurück.
 */
function backToStartScreen() {
  closeBurgerMenu();
  stopAllSounds();
  const mobileControls = document.getElementById("mobileControls");
  if (mobileControls) {
    mobileControls.classList.add("d-none");
  }
  resetToStartScreen();
}

/**
 * Setzt das Spiel zum Startbildschirm zurück und räumt alle Ressourcen auf.
 */
function resetToStartScreen() {
  isPaused = false;
  if (world && typeof world.rewrite === "function") {
    world.rewrite();
  }
  world = null;

  const burgerBtn = document.getElementById("burgerMenuBtn");
  if (burgerBtn) {
    burgerBtn.classList.add("d-none");
  }
  const mobileControls = document.getElementById("mobileControls");
  if (mobileControls) {
    mobileControls.classList.add("d-none");
  }
  showElement("startContainer");

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ===== KEYBOARD EVENT LISTENERS =====

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 32) {
    e.preventDefault(); // Verhindert, dass Space fokussierte Buttons auslöst
  }
  if (e.keyCode == 39) keyboard.RIGHT = true;
  if (e.keyCode == 37) keyboard.LEFT = true;
  if (e.keyCode == 40) keyboard.DOWN = true;
  if (e.keyCode == 38) keyboard.UP = true;
  if (e.keyCode == 68) keyboard.D = true;
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 40) keyboard.DOWN = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 68) keyboard.D = false;
});
