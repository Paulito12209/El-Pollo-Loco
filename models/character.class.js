class Character extends MovableObject {
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png"
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png"
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png"
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png"
  ];

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png"
  ];

  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png"
  ];

  offset = {
    top: 100, // Viel transparenter Raum über dem Kopf
    bottom: 20, // Nur 20px unter den Füßen (siehe Screenshot!)
    left: 20, // 25px von links
    right: 20 // 25px von rechts
  };

  CAMERA_OFFSET = 100; // Character-Offset vom linken Rand
  ENDBOSS_MIN_DISTANCE = 500; // Minimaler Abstand des Endboss vom Rand
  lastActivity = Date.now();
  isLongIdle = false;

  world;
  speed = 4;
  y = 180;
  endGame = false;

  constructor() {
    // ✅ 29-10-2025 - 22:18
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");

    // SOUNDS:
    this.snoreSound = new Audio(
      "https://cdn.freesound.org/previews/796/796594_16895071-lq.mp3"
    );
    this.snoreSound.volume = 0.3;
    this.snoreSound.loop = true;

    this.walkingSound = new Audio(
      "https://cdn.freesound.org/previews/55/55690_321967-lq.mp3"
    );
    this.walkingSound.volume = 0.3;
    this.walkingSound.loop = true;

    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.applyGravity();
    this.animate();
  }

  animate() {
    // ✅ 29-10-2025 - 21:49
    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        this.otherDirection = false;
        this.lastActivity = Date.now();
      }
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
        this.lastActivity = Date.now();
      }
      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump();
        this.lastActivity = Date.now();
      }
      // Berechne Kamera-Position
      let desiredCameraX = -this.x + 100;

      // Finde Endboss
      let endboss = this.world.level.enemies.find((e) => e instanceof Endboss);

      if (endboss) {
        // Limit: Endboss muss mindestens 100px vom linken Rand entfernt sein
        let maxCameraX = -(endboss.x - 100);
        this.world.camera_x = Math.max(desiredCameraX, maxCameraX);
      } else {
        this.world.camera_x = desiredCameraX;
      }
    }, 1000 / 60);

    setInterval(() => {
      // ✅ 29-10-2025 21:49
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);

        // 🔥 Walking Sound stoppen
        if (!this.walkingSound.paused) {
          this.walkingSound.pause();
          this.walkingSound.currentTime = 0;
        }

        // Nach 1 Sekunde → endGame Flag setzen
        if (!this.endGame) {
          setTimeout(() => {
            this.endGame = true;
          }, 1000);
        }
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);

        // 🔥 Walking Sound stoppen
        if (!this.walkingSound.paused) {
          this.walkingSound.pause();
          this.walkingSound.currentTime = 0;
        }
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);

        // 🔥 Walking Sound stoppen (beim Springen)
        if (!this.walkingSound.paused) {
          this.walkingSound.pause();
          this.walkingSound.currentTime = 0;
        }
      } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.IMAGES_WALKING);

        // SCHNARCHEN STOPPEN (falls es läuft)
        if (!this.snoreSound.paused) {
          this.snoreSound.pause();
          this.snoreSound.currentTime = 0;
        }

        // IDLE-Flag zurücksetzen
        if (this.isLongIdle) {
          this.isLongIdle = false;
        }

        // Walking Sound starten (wenn noch nicht läuft)
        if (this.walkingSound.paused) {
          this.walkingSound.play();
        }
      } else {
        // Walking Sound stoppen
        if (!this.walkingSound.paused) {
          this.walkingSound.pause();
          this.walkingSound.currentTime = 0;
        }

        // IDLE Logik
        let timeSinceLastActivity = Date.now() - this.lastActivity;

        if (timeSinceLastActivity > 6000) {
          if (!this.isLongIdle) {
            this.isLongIdle = true;
            this.snoreSound.play(); // Schnarchen starten
          }
          this.playAnimation(this.IMAGES_LONG_IDLE);
        } else {
          if (this.isLongIdle) {
            this.isLongIdle = false;
            this.snoreSound.pause(); // Schnarchen stoppen
            this.snoreSound.currentTime = 0; // Zurückspulen
          }
          this.playAnimation(this.IMAGES_IDLE);
        }
      }
    }, 120);
  }

  isJumpingOnEnemy(enemy) {
    // ✅ 29-10-2025
    return this.isAboveGround() && this.speedY < 0 && this.isColliding(enemy);
  }

  hit() {
    // ✅ 29-10-2025 - 23:38
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
    }
    this.lastHit = new Date().getTime();
  }
}
