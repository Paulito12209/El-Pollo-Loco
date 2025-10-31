let canvas;
let world;
let keyboard = new Keyboard();

// 🔊 SOUND MANAGEMENT
let isMuted = false;

function init() {
  // 🔥 30-10-2025 19:15
  canvas = document.getElementById("canvas");
  // ❌ WICHTIG: world wird NICHT mehr hier erstellt!  ==> world wird erst in startGame() erstellt

  // 📱 Skaliere Canvas auf Mobile-Geräten
  if (window.matchMedia("(hover: none)").matches) {
    resizeCanvasForMobile();

    // Bei Orientierungs-Änderung neu skalieren
    window.addEventListener("orientationchange", () => {
      setTimeout(resizeCanvasForMobile, 100);
    });
  }

  // 🔊 Mute-Status aus LocalStorage laden
  loadMuteStatus();

  // Dialog schließen bei Klick auf Backdrop
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

  // Controls Dialog Backdrop Click 🔥 30-10-2025
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

/**
 * Skaliert Canvas für Mobile-Geräte
 */
function resizeCanvasForMobile() {
  const canvas = document.getElementById("canvas");
  const wrapper = document.getElementById("canvasWrapper");

  if (!canvas || !wrapper) return;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Berechne Skalierung unter Beibehaltung des Seitenverhältnisses
  const canvasRatio = 720 / 480; // Original Canvas-Größe
  const viewportRatio = viewportWidth / viewportHeight;

  let newWidth, newHeight;

  if (viewportRatio > canvasRatio) {
    // Viewport ist breiter -> Höhe voll ausnutzen
    newHeight = viewportHeight;
    newWidth = newHeight * canvasRatio;
  } else {
    // Viewport ist höher -> Breite voll ausnutzen
    newWidth = viewportWidth;
    newHeight = newWidth / canvasRatio;
  }

  wrapper.style.width = `${newWidth}px`;
  wrapper.style.height = `${newHeight}px`;

  console.log(`Canvas skaliert: ${newWidth}x${newHeight}`);
}

/**
 * Startet das Spiel (wird beim Klick auf "Start Game" aufgerufen)
 */
function startGame() {
  // Start Screen ausblenden
  hideElement("startContainer");

  // Spiel initialisieren
  keyboard = new Keyboard();
  world = new World(canvas, keyboard);

  // 🔊 Mute-Status auf neue Sounds anwenden
  setTimeout(() => {
    applyMuteToAllSounds();
  }, 100);

  // 🔥 Burger-Button einblenden
  const burgerBtn = document.getElementById("burgerMenuBtn");
  if (burgerBtn) {
    burgerBtn.classList.remove("d-none");
  }
}

/**
 * Versteckt ein HTML-Element
 */
function hideElement(elementId) {
  document.getElementById(elementId).classList.add("d-none");
}

/**
 * Zeigt ein HTML-Element an
 */
function showElement(elementId) {
  document.getElementById(elementId).classList.remove("d-none");
}

// 🔥 Dialog Implementation 30-10-2025
/**
 * Öffnet den Gameplay-Info-Dialog (natives HTML5 <dialog>)
 */
function openGameplayInfo() {
  const dialog = document.getElementById("gameplayInfoDialog");
  if (dialog) {
    dialog.showModal(); // Öffnet den Dialog modal (mit Backdrop)
  }
}

/**
 * Schließt den Gameplay-Info-Dialog
 */
function closeGameplayInfo() {
  const dialog = document.getElementById("gameplayInfoDialog");
  if (dialog) {
    dialog.close(); // Schließt den Dialog
  }
}

/**
 * Öffnet das Burger-Menü
 */
function openBurgerMenu() {
  const dialog = document.getElementById("burgerMenuDialog");
  if (dialog) {
    dialog.showModal();
  }
}

/**
 * Schließt das Burger-Menü
 */
function closeBurgerMenu() {
  const dialog = document.getElementById("burgerMenuDialog");
  if (dialog) {
    dialog.close();
  }
}

/**
 * Öffnet Gameplay Info Dialog aus dem Burger-Menü heraus
 */
function openGameplayInfoFromMenu() {
  closeBurgerMenu(); // Schließe Burger-Menü zuerst
  setTimeout(() => {
    openGameplayInfo(); // Öffne Gameplay Info
  }, 300); // Kurze Verzögerung für sanften Übergang
}

/**
 * Öffnet Steuerung Dialog (Placeholder - wird später implementiert)
 */
function openControls() {
  closeBurgerMenu();
  // TODO: Steuerung Dialog implementieren
  console.log("Steuerung Dialog - noch nicht implementiert");
}

/**
 * Schaltet Sound an/aus (Placeholder - wird später implementiert)
 */
function toggleMute() {
  // TODO: Sound Mute-Logik implementieren
  console.log("Sound Mute - noch nicht implementiert");
  // Optional: Dialog offen lassen oder schließen
}

/**
 * Kehrt zum Start-Screen zurück
 */
function backToStartScreen() {
  closeBurgerMenu();

  // Start-Container wieder anzeigen
  const startContainer = document.getElementById("startContainer");
  if (startContainer) {
    startContainer.classList.remove("d-none");
  }

  // Burger-Button ausblenden
  const burgerBtn = document.getElementById("burgerMenuBtn");
  if (burgerBtn) {
    burgerBtn.classList.add("d-none");
  }

  // Optional: Spiel pausieren oder zurücksetzen
  // TODO: Game Reset Logik
  console.log("Zurück zum Start Screen");
}

// ==== 🎮 CONTROLLER SETTINGS ====
/**
 * Öffnet den Controls-Dialog
 */
function openControls() {
  const dialog = document.getElementById("controlsDialog");
  if (dialog) {
    dialog.showModal();
  }
}

/**
 * Schließt den Controls-Dialog
 */
function closeControls() {
  const dialog = document.getElementById("controlsDialog");
  if (dialog) {
    dialog.close();
  }
}

/**
 * Öffnet Controls Dialog aus dem Burger-Menü heraus
 */
function openControlsFromMenu() {
  closeBurgerMenu(); // Schließe Burger-Menü zuerst
  setTimeout(() => {
    openControls(); // Öffne Controls Dialog
  }, 300); // Kurze Verzögerung für sanften Übergang
}

// ==== 🔊 SOUND MUTE/UNMUTE SYSTEM ====

/**
 * Sammelt alle Sound-Objekte aus Character und World
 * @returns {Array} Array mit allen Audio-Objekten
 */
function getAllSounds() {
  let sounds = [];

  // Character Sounds
  if (world && world.character) {
    if (world.character.snoreSound) sounds.push(world.character.snoreSound);
    if (world.character.walkingSound) sounds.push(world.character.walkingSound);
  }

  // World Sounds
  if (world) {
    if (world.hurtSound) sounds.push(world.hurtSound);
    if (world.coinSound) sounds.push(world.coinSound);
    if (world.bottleSound) sounds.push(world.bottleSound);
    if (world.chickenDeathSound) sounds.push(world.chickenDeathSound);
  }

  return sounds;
}

/**
 * Schaltet alle Sounds an/aus
 */
function toggleMute() {
  // Status umschalten
  isMuted = !isMuted;

  // Alle Sounds durchgehen
  const allSounds = getAllSounds();
  allSounds.forEach((sound) => {
    sound.muted = isMuted;
  });

  // Status speichern
  saveMuteStatus();

  // UI aktualisieren
  updateMuteButtons();
}

/**
 * Aktualisiert die Mute-Button Icons
 */
function updateMuteButtons() {
  // Start-Screen Button
  const startBtn = document.getElementById("muteButtonStart");
  if (startBtn) {
    startBtn.textContent = isMuted ? "🔊" : "🔇";
  }

  // Burger-Menu Button
  const burgerIcon = document.getElementById("muteIconBurger");
  const burgerLabel = document.getElementById("muteLabelBurger");

  if (burgerIcon && burgerLabel) {
    burgerIcon.textContent = isMuted ? "🔊" : "🔇";
    burgerLabel.textContent = isMuted ? "Sound aktivieren" : "Sound muten";
  }
}

/**
 * Speichert den Mute-Status im LocalStorage
 */
function saveMuteStatus() {
  localStorage.setItem("elPolloLoco_isMuted", isMuted.toString());
}

/**
 * Lädt den Mute-Status aus dem LocalStorage
 */
function loadMuteStatus() {
  const saved = localStorage.getItem("elPolloLoco_isMuted");

  if (saved !== null) {
    isMuted = saved === "true";
    updateMuteButtons();
  }
}

/**
 * Wendet den gespeicherten Mute-Status auf alle Sounds an
 * (Wird nach startGame() aufgerufen)
 */
function applyMuteToAllSounds() {
  if (isMuted) {
    const allSounds = getAllSounds();
    allSounds.forEach((sound) => {
      sound.muted = true;
    });
  }
}

// Buttons ✅
window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }

  if (e.keyCode == 38) {
    keyboard.UP = true;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }

  if (e.keyCode == 68) {
    keyboard.D = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }

  if (e.keyCode == 38) {
    keyboard.UP = false;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }

  if (e.keyCode == 68) {
    keyboard.D = false;
  }
});
