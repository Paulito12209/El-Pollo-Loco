/**
 * Sound Manager für El Pollo Loco
 * Verwaltet alle Sound-bezogenen Funktionen des Spiels.
 */

/**
 * Sammelt alle Spielsounds von World und Character.
 * @returns {HTMLAudioElement[]} Array aller Audio-Elemente
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
 * Stoppt alle Sounds und setzt ihre Position zurück.
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
 * Pausiert alle aktuell laufenden Sounds (ohne Position zurückzusetzen).
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
 * Setzt Sounds nach Pause fort (wenn nicht gemutet).
 */
function resumeAllSounds() {
    if (world && !isMuted) {
        // Sounds werden automatisch fortgesetzt wenn die Game-Loop weiterläuft
    }
}

/**
 * Wechselt den Mute-Status für alle Spielsounds.
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
 * Aktualisiert die Sound-Button Icons und Labels in der UI.
 * Zeigt 🔊 wenn Sound AN ist, 🔇 wenn Sound AUS/Muted ist.
 */
function updateMuteButtons() {
    const startBtn = document.getElementById("muteButtonStart");
    if (startBtn) {
        startBtn.textContent = isMuted ? "🔇" : "🔊";
    }

    // Unterstützt beide möglichen ID-Sets im Burger-Menü
    const burgerIcon =
        document.getElementById("muteIconBurger") ||
        document.getElementById("muteIconBurgerCard");
    const burgerLabel =
        document.getElementById("muteLabelBurger") ||
        document.getElementById("muteLabelBurgerCard");

    if (burgerIcon) {
        burgerIcon.textContent = isMuted ? "🔇" : "🔊";
    }
    if (burgerLabel) {
        burgerLabel.textContent = isMuted ? "Sound aktivieren" : "Sound muten";
    }
}

/**
 * Speichert den Mute-Status in localStorage.
 */
function saveMuteStatus() {
    localStorage.setItem("elPolloLoco_isMuted", isMuted.toString());
}

/**
 * Lädt den Mute-Status aus localStorage.
 */
function loadMuteStatus() {
    const saved = localStorage.getItem("elPolloLoco_isMuted");

    if (saved !== null) {
        isMuted = saved === "true";
        updateMuteButtons();
    }
}

/**
 * Wendet die Mute-Einstellung auf alle Sounds nach Spielstart an.
 */
function applyMuteToAllSounds() {
    if (isMuted) {
        const allSounds = getAllSounds();
        allSounds.forEach((sound) => {
            sound.muted = true;
        });
    }
}
