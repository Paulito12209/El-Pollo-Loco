let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = false;
let isPaused = false;
let openedFromMenu = false;

// ===== INITIALIZATION =====

/**
 * Initializes the game canvas and sets up dialog event listeners.
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

// ===== GAME CONTROL =====

/**
 * Starts a new game by initializing the world and showing game UI.
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
 * Hides an element by adding the 'd-none' class.
 * @param {string} elementId - The ID of the element to hide
 */
function hideElement(elementId) {
  document.getElementById(elementId).classList.add("d-none");
}

/**
 * Shows an element by removing the 'd-none' class.
 * @param {string} elementId - The ID of the element to show
 */
function showElement(elementId) {
  document.getElementById(elementId).classList.remove("d-none");
}

// ===== DIALOG HANDLING =====

/**
 * Opens the gameplay info dialog and pauses the game.
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
 * Closes the gameplay info dialog and resumes the game (unless opened from menu).
 */
function closeGameplayInfo() {
  const dialog = document.getElementById("gameplayInfoDialog");
  if (dialog) {
    dialog.close();
    dialog.classList.remove("over-menu");

    if (openedFromMenu) {
      openedFromMenu = false;
      // Menu is still open in background, stay paused
    } else {
      isPaused = false;
      resumeAllSounds();
    }
  }
}

/**
 * Opens the controls dialog and pauses the game.
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
 * Closes the controls dialog and resumes the game (unless opened from menu).
 */
function closeControls() {
  const dialog = document.getElementById("controlsDialog");
  if (dialog) {
    dialog.close();
    dialog.classList.remove("over-menu");

    if (openedFromMenu) {
      openedFromMenu = false;
      // Menu is still open in background, stay paused
    } else {
      isPaused = false;
      resumeAllSounds();
    }
  }
}

/**
 * Opens the burger menu and pauses the game.
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
 * Closes the burger menu and resumes the game.
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
 * Opens gameplay info from the burger menu (stacked on top, menu stays visible).
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
 * Opens controls from the burger menu (stacked on top, menu stays visible).
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
 * Returns to the start screen from the burger menu.
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

// ===== SOUND MANAGEMENT =====

/**
 * Collects all game sounds from the world and character.
 * @returns {HTMLAudioElement[]} Array of all audio elements
 */
function getAllSounds() {
  let sounds = [];

  if (world && world.character) {
    if (world.character.snoreSound) sounds.push(world.character.snoreSound);
    if (world.character.walkingSound) sounds.push(world.character.walkingSound);
    if (world.character.jumpSound) sounds.push(world.character.jumpSound);
  }

  if (world) {
    if (world.hurtSound) sounds.push(world.hurtSound);
    if (world.coinSound) sounds.push(world.coinSound);
    if (world.bottleSound) sounds.push(world.bottleSound);
    if (world.chickenDeathSound) sounds.push(world.chickenDeathSound);
    if (world.level && world.level.enemies) {
      const endboss = world.level.enemies.find((e) => e instanceof Endboss);
      if (endboss && endboss.hurtSound) sounds.push(endboss.hurtSound);
    }
  }

  return sounds;
}

/**
 * Stops all sounds and resets their playback position.
 */
function stopAllSounds() {
  if (world) {
    if (world.character) {
      if (world.character.snoreSound) {
        world.character.snoreSound.pause();
        world.character.snoreSound.currentTime = 0;
      }
      if (world.character.walkingSound) {
        world.character.walkingSound.pause();
        world.character.walkingSound.currentTime = 0;
      }
    }

    if (world.hurtSound) {
      world.hurtSound.pause();
      world.hurtSound.currentTime = 0;
    }
    if (world.coinSound) {
      world.coinSound.pause();
      world.coinSound.currentTime = 0;
    }
    if (world.bottleSound) {
      world.bottleSound.pause();
      world.bottleSound.currentTime = 0;
    }
    if (world.chickenDeathSound) {
      world.chickenDeathSound.pause();
      world.chickenDeathSound.currentTime = 0;
    }
  }
}

/**
 * Pauses all currently playing sounds (without resetting position).
 */
function pauseAllSounds() {
  if (world) {
    if (world.character) {
      if (!world.character.snoreSound.paused) {
        world.character.snoreSound.pause();
      }
      if (!world.character.walkingSound.paused) {
        world.character.walkingSound.pause();
      }
    }

    if (!world.hurtSound.paused) world.hurtSound.pause();
    if (!world.coinSound.paused) world.coinSound.pause();
    if (!world.bottleSound.paused) world.bottleSound.pause();
    if (!world.chickenDeathSound.paused) world.chickenDeathSound.pause();
  }
}

/**
 * Resumes sounds after pause (if not muted).
 */
function resumeAllSounds() {
  if (world && !isMuted) {
    // Sounds resume automatically when game loop continues
  }
}

/**
 * Resets the game to the start screen, cleaning up all resources.
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

/**
 * Toggles the mute state for all game sounds.
 */
function toggleMute() {
  isMuted = !isMuted;

  const allSounds = getAllSounds();
  allSounds.forEach((sound) => {
    sound.muted = isMuted;
  });

  saveMuteStatus();

  updateMuteButtons();
}

/**
 * Updates the mute button icons and labels in the UI.
 */
function updateMuteButtons() {
  const startBtn = document.getElementById("muteButtonStart");
  if (startBtn) {
    startBtn.textContent = isMuted ? "🔊" : "🔇";
  }

  // Support both possible ID sets in the burger menu
  const burgerIcon =
    document.getElementById("muteIconBurger") ||
    document.getElementById("muteIconBurgerCard");
  const burgerLabel =
    document.getElementById("muteLabelBurger") ||
    document.getElementById("muteLabelBurgerCard");

  if (burgerIcon) {
    burgerIcon.textContent = isMuted ? "🔊" : "🔇";
  }
  if (burgerLabel) {
    burgerLabel.textContent = isMuted ? "Sound aktivieren" : "Sound muten";
  }
}

/**
 * Saves the mute status to localStorage.
 */
function saveMuteStatus() {
  localStorage.setItem("elPolloLoco_isMuted", isMuted.toString());
}

/**
 * Loads the mute status from localStorage.
 */
function loadMuteStatus() {
  const saved = localStorage.getItem("elPolloLoco_isMuted");

  if (saved !== null) {
    isMuted = saved === "true";
    updateMuteButtons();
  }
}

/**
 * Applies the mute setting to all sounds after game start.
 */
function applyMuteToAllSounds() {
  if (isMuted) {
    const allSounds = getAllSounds();
    allSounds.forEach((sound) => {
      sound.muted = true;
    });
  }
}

// ===== EVENT LISTENERS =====
window.addEventListener("keydown", (e) => {
  if (e.keyCode == 32) {
    e.preventDefault(); // Prevents Space from triggering focused buttons
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

// ===== MOBILE TOUCH CONTROLS =====
document.addEventListener("DOMContentLoaded", function () {
  initMobileControls();
});

/**
 * Initializes touch event listeners for mobile control buttons.
 */
function initMobileControls() {
  const btnLeft = document.getElementById("btnLeft");
  const btnRight = document.getElementById("btnRight");
  const btnJump = document.getElementById("btnJump");
  const btnThrow = document.getElementById("btnThrow");

  if (!btnLeft || !btnRight || !btnJump || !btnThrow) {
    return;
  }

  btnLeft.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.LEFT = true;
  }, { passive: false });
  btnLeft.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.LEFT = false;
  }, { passive: false });

  btnRight.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.RIGHT = true;
  }, { passive: false });
  btnRight.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.RIGHT = false;
  }, { passive: false });

  btnJump.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.UP = true;
  }, { passive: false });
  btnJump.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.UP = false;
  }, { passive: false });

  btnThrow.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.D = true;
  }, { passive: false });
  btnThrow.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.D = false;
  }, { passive: false });

  [btnLeft, btnRight, btnJump, btnThrow].forEach((btn) => {
    btn.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      keyboard.LEFT = false;
      keyboard.RIGHT = false;
      keyboard.UP = false;
      keyboard.D = false;
    }, { passive: false });
  });
}
