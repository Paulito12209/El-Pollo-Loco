/**
 * Mobile Controls für El Pollo Loco
 * Verwaltet alle Touch-Event-Listener für mobile Steuerung.
 */

/**
 * Initialisiert Touch-Event-Listener für mobile Steuerungs-Buttons.
 */
function initMobileControls() {
    const btnLeft = document.getElementById("btnLeft");
    const btnRight = document.getElementById("btnRight");
    const btnJump = document.getElementById("btnJump");
    const btnThrow = document.getElementById("btnThrow");

    if (!btnLeft || !btnRight || !btnJump || !btnThrow) {
        return;
    }

    // Links-Button Events
    btnLeft.addEventListener("touchstart", (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
    }, { passive: false });
    btnLeft.addEventListener("touchend", (e) => {
        e.preventDefault();
        keyboard.LEFT = false;
    }, { passive: false });

    // Rechts-Button Events
    btnRight.addEventListener("touchstart", (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
    }, { passive: false });
    btnRight.addEventListener("touchend", (e) => {
        e.preventDefault();
        keyboard.RIGHT = false;
    }, { passive: false });

    // Sprung-Button Events
    btnJump.addEventListener("touchstart", (e) => {
        e.preventDefault();
        keyboard.UP = true;
    }, { passive: false });
    btnJump.addEventListener("touchend", (e) => {
        e.preventDefault();
        keyboard.UP = false;
    }, { passive: false });

    // Wurf-Button Events
    btnThrow.addEventListener("touchstart", (e) => {
        e.preventDefault();
        keyboard.D = true;
    }, { passive: false });
    btnThrow.addEventListener("touchend", (e) => {
        e.preventDefault();
        keyboard.D = false;
    }, { passive: false });

    // Touch-Cancel für alle Buttons
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

// Initialisiere Mobile-Controls wenn DOM geladen ist
document.addEventListener("DOMContentLoaded", function () {
    initMobileControls();
});
