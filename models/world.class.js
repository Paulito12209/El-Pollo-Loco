/**
 * Main game world that manages all game objects, collision detection,
 * rendering, and game state.
 */
class World {
  character = new Character();
  level = createLevel1();
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  healthBar = new HealthBar();
  coinBar = new CoinBar();
  bottleBar = new BottleBar();
  endbossBar = new EndbossBar();
  throwableObjects = [];
  collectedBottles = 0;
  lastHitTime = 0;
  lastThrowTime = 0;

  Endscreens;
  gameOverWin = new Endscreen(
    "img/9_intro_outro_screens/game_over/game over.png"
  );
  gameOverLost = new Endscreen(
    "img/9_intro_outro_screens/game_over/you lost.png"
  );
  runInterval;
  animationId;

  /**
   * Creates a new World instance with all game sounds and objects.
   * @param {HTMLCanvasElement} canvas - The canvas element to render to
   * @param {Keyboard} keyboard - The keyboard input handler
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;

    this.hurtSound = new Audio(
      "https://cdn.freesound.org/previews/262/262279_4902403-lq.mp3"
    );
    this.hurtSound.volume = 0.2;
    this.coinSound = new Audio(
      "https://cdn.freesound.org/previews/779/779239_15068221-lq.mp3"
    );
    this.coinSound.volume = 0.3;
    this.bottleSound = new Audio(
      "https://cdn.freesound.org/previews/326/326039_8238-lq.mp3"
    );
    this.bottleSound.volume = 0.2;
    this.chickenDeathSound = new Audio(
      "https://cdn.freesound.org/previews/667/667601_2971579-lq.mp3"
    );
    this.chickenDeathSound.volume = 0.3;

    this.draw();
    this.setWorld();
    this.run();
  }

  /**
   * Links the character to this world instance.
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Starts the main game loop interval for collision checks and game logic.
   */
  run() {
    this.runInterval = setInterval(() => {
      if (isPaused) return;

      this.checkCoinCollisions();
      this.checkBottleCollisions();
      this.checkBottleEnemyCollisions();
      this.checkEndbossAppearance();
      this.updateEndbossDirection();
      this.checkEndGame();
    }, 200);
  }

  /**
   * Checks if the game should end (player or boss dies).
   */
  checkEndGame() {
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);

    if (this.character.endGame || (endboss && endboss.endGame)) {
      setTimeout(() => {
        if (typeof resetToStartScreen === "function") {
          resetToStartScreen();
        }
      }, 2000);
    }
  }

  /**
   * Updates the endboss to always face the character.
   */
  updateEndbossDirection() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss && !enemy.isDead) {
        enemy.lookAtCharacter(this.character);
      }
    });
  }

  /**
   * Checks for collisions between thrown bottles and enemies.
   */
  checkBottleEnemyCollisions() {
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy) && !bottle.hasHit && !enemy.isDead) {
          bottle.hasHit = true;

          if (enemy instanceof Endboss) {
            enemy.energy -= 20;
            enemy.lastHit = new Date().getTime();
            if (enemy.energy <= 0) {
              enemy.energy = 0;
              enemy.isDead = true;
            } else {
              enemy.performCounterAttack(this.character);
            }

            this.endbossBar.setPercentage(enemy.energy);
            try {
              this.chickenDeathSound.currentTime = 1;
              this.chickenDeathSound.play().catch(() => { });
            } catch (e) { }
            if (typeof enemy.playHurtSound === "function") {
              enemy.playHurtSound();
            }
          } else {
            enemy.isDead = true;
            try {
              this.chickenDeathSound.currentTime = 1;
              this.chickenDeathSound.play().catch(() => { });
            } catch (e) { }
          }
        }
      });
    });
  }

  /**
   * Handles throwing bottles when the player presses the throw key.
   * Includes a 400ms cooldown to ensure responsive but controlled throwing.
   */
  checkThrowableObjects() {
    let currentTime = Date.now();
    let timeSinceLastThrow = currentTime - this.lastThrowTime;

    if (this.keyboard.D && this.collectedBottles > 0 && timeSinceLastThrow > 400) {
      let direction = this.character.otherDirection ? -1 : 1;
      let spawnX = this.character.otherDirection
        ? this.character.x - 20
        : this.character.x + 60;
      let bottle = new ThrowableObject(
        spawnX,
        this.character.y + 80,
        direction
      );
      this.throwableObjects.push(bottle);
      this.collectedBottles--;
      this.updateBottleBar();
      this.character.lastActivity = Date.now();
      this.lastThrowTime = currentTime;
    }
  }

  /**
   * Updates the bottle status bar based on collected bottles.
   */
  updateBottleBar() {
    let totalBottles = this.level?.initialBottlesCount || 0;
    let percentage =
      totalBottles > 0 ? (this.collectedBottles / totalBottles) * 100 : 0;
    this.bottleBar.setPercentage(percentage);
  }

  /**
   * Checks collisions between character and enemies.
   */
  checkCollisions() {
    const endboss = this.level.enemies.find(e => e instanceof Endboss);
    const isVictory = endboss?.isDead;

    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        if (this.character.isJumpingOnEnemy(enemy)) {
          if (enemy instanceof Endboss) {
            if (!enemy.isDead) {
              // Check if this is a consecutive jump (2nd+ jump without landing)
              if (this.character.consecutiveBossJumps >= 1) {
                // 2nd consecutive jump -> Pepe takes damage
                this.character.hit();
                this.healthBar.setPercentage(this.character.energy);
                try {
                  this.hurtSound.play().catch(() => { });
                } catch (e) { }
              } else {
                // 1st jump -> Boss takes damage
                enemy.hit();
                if (enemy.energy <= 0) {
                  enemy.energy = 0;
                  enemy.isDead = true;
                } else {
                  enemy.performCounterAttack(this.character);
                }
                this.endbossBar.setPercentage(enemy.energy);
                try {
                  this.chickenDeathSound.currentTime = 1;
                  this.chickenDeathSound.play().catch(() => { });
                } catch (e) { }
                if (typeof enemy.playHurtSound === "function") {
                  enemy.playHurtSound();
                }
                this.character.consecutiveBossJumps++;
              }
            }
            this.character.jump();
            this.character.lastBounceTime = Date.now();
          } else {
            if (!enemy.isDead) {
              enemy.isDead = true;
              try {
                this.chickenDeathSound.currentTime = 1;
                this.chickenDeathSound.play().catch(() => { });
              } catch (e) { }
            }
            this.character.jump();
            this.character.lastBounceTime = Date.now();
          }
        } else if (
          !enemy.isDead &&
          !this.character.isHurt() &&
          !this.character.isDead() &&
          !isVictory &&
          Date.now() - this.character.lastBounceTime > 300
        ) {
          this.character.hit();
          this.healthBar.setPercentage(this.character.energy);
          let currentTime = new Date().getTime();
          if (currentTime - this.lastHitTime > 500) {
            try {
              this.hurtSound.play().catch(() => { });
            } catch (e) { }
            this.lastHitTime = currentTime;
          }
        }
      }
    });
  }

  /**
   * Main draw loop - renders all game objects to the canvas.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);

    // Draw fixed UI elements (not affected by camera)
    this.addToMap(this.healthBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.bottleBar);

    if (this.endbossBar.isVisible) {
      this.addToMap(this.endbossBar);
    }

    let endboss = this.level.enemies.find((e) => e instanceof Endboss);

    if (this.character.endGame) {
      this.addToMap(this.gameOverLost);
    } else if (endboss && endboss.endGame) {
      this.addToMap(this.gameOverWin);
    }

    if (!isPaused) {
      this.checkCollisions();
      this.checkThrowableObjects();
    }

    let self = this;
    this.animationId = requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Checks for collisions between character and collectible bottles.
   */
  checkBottleCollisions() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.level.bottles.splice(index, 1);
        this.collectedBottles++;
        this.updateBottleBar();
        try {
          this.bottleSound.currentTime = 0;
          this.bottleSound.play().catch(() => { });
        } catch (e) { }
      }
    });
  }

  /**
   * Checks for collisions between character and collectible coins.
   */
  checkCoinCollisions() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.level.coins.splice(index, 1);
        let totalCoins = this.level?.initialCoinsCount || 0;
        let coinsCollected = totalCoins - this.level.coins.length;
        let percentage =
          totalCoins > 0 ? (coinsCollected / totalCoins) * 100 : 0;
        this.coinBar.setPercentage(percentage);
        try {
          this.coinSound.currentTime = 0.6;
          this.coinSound.play().catch(() => { });
        } catch (e) { }
      }
    });
  }

  /**
   * Adds an array of objects to the canvas.
   * @param {DrawableObject[]} objects - Array of objects to draw
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Adds a single object to the canvas, handling direction flipping.
   * @param {DrawableObject} mo - The object to draw
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips the canvas context for drawing mirrored sprites.
   * @param {DrawableObject} mo - The object to flip
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the canvas context after drawing a flipped sprite.
   * @param {DrawableObject} mo - The object that was flipped
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Shows the endboss health bar when player gets close enough.
   */
  checkEndbossAppearance() {
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (endboss && this.character.x >= endboss.x - 400) {
      this.endbossBar.isVisible = true;
    }
  }

  /**
   * Cleans up all intervals, animations, and sounds when game ends.
   */
  rewrite() {
    if (this.runInterval) {
      clearInterval(this.runInterval);
      this.runInterval = null;
    }
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.character) {
      if (this.character.snoreSound) {
        this.character.snoreSound.pause();
        this.character.snoreSound.currentTime = 0;
      }
      if (this.character.walkingSound) {
        this.character.walkingSound.pause();
        this.character.walkingSound.currentTime = 0;
      }
    }
    [
      this.hurtSound,
      this.coinSound,
      this.bottleSound,
      this.chickenDeathSound
    ].forEach((s) => {
      if (s) {
        s.pause();
        s.currentTime = 0;
      }
    });

    const objects = []
      .concat(this.level?.backgroundObjects || [])
      .concat(this.level?.clouds || [])
      .concat(this.level?.enemies || [])
      .concat(this.level?.coins || [])
      .concat(this.level?.bottles || [])
      .concat(this.throwableObjects || [])
      .concat([this.character].filter(Boolean));

    objects.forEach((o) => {
      if (o && typeof o.clearAllIntervals === "function") {
        o.clearAllIntervals();
      }
    });
  }
}
