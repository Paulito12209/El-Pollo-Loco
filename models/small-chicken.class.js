/**
 * Repräsentiert ein kleines Huhn als Gegner.
 * Läuft schneller als normale Hühner und ist kleiner.
 * @extends MovableObject
 */
class SmallChicken extends MovableObject {
    y = 378;
    height = 40;
    width = 40;
    offset = {
        top: -20,
        bottom: 0,
        left: 0,
        right: 0
    };

    IMAGES_WALKING = [
        "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/3_w.png"
    ];

    IMAGE_DEAD = "img/3_enemies_chicken/chicken_small/2_dead/dead.png";
    isDead = false;

    /**
     * Erstellt ein neues kleines Huhn an der angegebenen Position.
     * Geschwindigkeit ist randomisiert und höher als normale Hühner.
     * @param {number} x - Start X-Position
     */
    constructor(x) {
        super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGE_DEAD);
        this.x = x;
        this.speed = 0.8 + (0.6 * Math.random()); // Schneller als normale Hühner
        this.animate();
    }

    /**
     * Startet die Bewegungs- und Animations-Intervalle.
     */
    animate() {
        this.setGameInterval(() => this.handleMovement(), 1000 / 60);
        this.setGameInterval(() => this.handleAnimation(), 180); // Schnellere Animation
    }

    /**
     * Behandelt die Bewegungslogik.
     */
    handleMovement() {
        if (isPaused) return;
        if (this.isDead) {
            this.moveDown();
        } else {
            this.moveLeft();
        }
    }

    /**
     * Behandelt die Animationslogik.
     */
    handleAnimation() {
        if (isPaused) return;
        if (this.isDead) {
            this.loadImage(this.IMAGE_DEAD);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Bewegt das Huhn nach unten (nach dem Tod).
     */
    moveDown() {
        this.y += 1;
    }
}
