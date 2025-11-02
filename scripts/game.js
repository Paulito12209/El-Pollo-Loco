let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = false;
let isPaused = false;

// ===== INITIALIZATION =====
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

function hideElement(elementId) {
  document.getElementById(elementId).classList.add("d-none");
}

function showElement(elementId) {
  document.getElementById(elementId).classList.remove("d-none");
}

// ===== DIALOG HANDLING =====
function openGameplayInfo() {
  const dialog = document.getElementById("gameplayInfoDialog");
  if (dialog) {
    dialog.showModal();
  }
}

function closeGameplayInfo() {
  const dialog = document.getElementById("gameplayInfoDialog");
  if (dialog) {
    dialog.close();
  }
}

function openControls() {
  const dialog = document.getElementById("controlsDialog");
  if (dialog) {
    dialog.showModal();
  }
}

function closeControls() {
  const dialog = document.getElementById("controlsDialog");
  if (dialog) {
    dialog.close();
  }
}

function openBurgerMenu() {
  const dialog = document.getElementById("burgerMenuDialog");
  if (dialog) {
    dialog.showModal();
    isPaused = true;
    pauseAllSounds();
  }
}

function closeBurgerMenu() {
  const dialog = document.getElementById("burgerMenuDialog");
  if (dialog) {
    dialog.close();
    isPaused = false;
    resumeAllSounds();
  }
}

function openGameplayInfoFromMenu() {
  closeBurgerMenu();
  setTimeout(() => {
    openGameplayInfo();
  }, 300);
}

function openControlsFromMenu() {
  closeBurgerMenu();
  setTimeout(() => {
    openControls();
  }, 300);
}

function backToStartScreen() {
  closeBurgerMenu();
  stopAllSounds();
  const mobileControls = document.getElementById("mobileControls");
  if (mobileControls) {
    mobileControls.classList.add("d-none");
  }
  document.location.reload();
}

// ===== SOUND MANAGEMENT =====
function getAllSounds() {
  let sounds = [];

  if (world && world.character) {
    if (world.character.snoreSound) sounds.push(world.character.snoreSound);
    if (world.character.walkingSound) sounds.push(world.character.walkingSound);
  }

  if (world) {
    if (world.hurtSound) sounds.push(world.hurtSound);
    if (world.coinSound) sounds.push(world.coinSound);
    if (world.bottleSound) sounds.push(world.bottleSound);
    if (world.chickenDeathSound) sounds.push(world.chickenDeathSound);
  }

  return sounds;
}

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

function resumeAllSounds() {
  if (world && !isMuted) {
  }
}

function toggleMute() {
  isMuted = !isMuted;

  const allSounds = getAllSounds();
  allSounds.forEach((sound) => {
    sound.muted = isMuted;
  });

  saveMuteStatus();

  updateMuteButtons();
}

function updateMuteButtons() {
  const startBtn = document.getElementById("muteButtonStart");
  if (startBtn) {
    startBtn.textContent = isMuted ? "🔊" : "🔇";
  }

  const burgerIcon = document.getElementById("muteIconBurger");
  const burgerLabel = document.getElementById("muteLabelBurger");

  if (burgerIcon && burgerLabel) {
    burgerIcon.textContent = isMuted ? "🔊" : "🔇";
    burgerLabel.textContent = isMuted ? "Sound aktivieren" : "Sound muten";
  }
}

function saveMuteStatus() {
  localStorage.setItem("elPolloLoco_isMuted", isMuted.toString());
}

function loadMuteStatus() {
  const saved = localStorage.getItem("elPolloLoco_isMuted");

  if (saved !== null) {
    isMuted = saved === "true";
    updateMuteButtons();
  }
}

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
  if (e.keyCode == 39) keyboard.RIGHT = true;
  if (e.keyCode == 37) keyboard.LEFT = true;
  if (e.keyCode == 40) keyboard.DOWN = true;
  if (e.keyCode == 38) keyboard.UP = true;
  if (e.keyCode == 32) keyboard.SPACE = true;
  if (e.keyCode == 68) keyboard.D = true;
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 40) keyboard.DOWN = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 32) keyboard.SPACE = false;
  if (e.keyCode == 68) keyboard.D = false;
});

// ===== MOBILE TOUCH CONTROLS =====
document.addEventListener("DOMContentLoaded", function () {
  initMobileControls();
});

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
  });
  btnLeft.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.LEFT = false;
  });

  btnRight.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.RIGHT = true;
  });
  btnRight.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.RIGHT = false;
  });

  btnJump.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.UP = true;
    keyboard.SPACE = true;
  });
  btnJump.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.UP = false;
    keyboard.SPACE = false;
  });

  btnThrow.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.D = true;
  });
  btnThrow.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.D = false;
  });

  [btnLeft, btnRight, btnJump, btnThrow].forEach((btn) => {
    btn.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      keyboard.LEFT = false;
      keyboard.RIGHT = false;
      keyboard.UP = false;
      keyboard.SPACE = false;
      keyboard.D = false;
    });
  });
}
