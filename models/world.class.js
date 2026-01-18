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
  gameOverWin = new Endscreen("img/9_intro_outro_screens/game_over/game over.png");
  gameOverLost = new Endscreen("img/9_intro_outro_screens/game_over/you lost.png");
  runInterval;
  animationId;

  /**
   * Creates a new World instance.
   * @param {HTMLCanvasElement} canvas - The canvas element
   * @param {Keyboard} keyboard - The keyboard handler
   */
  constructor(canvas, keyboard) {
    this.initializeCanvas(canvas, keyboard);
    this.initializeSounds();
    this.draw();
    this.setWorld();
    this.run();
  }

  /**
   * Initializes canvas and keyboard.
   */
  initializeCanvas(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
  }

  /**
   * Initializes all sound effects.
   */
  initializeSounds() {
    this.hurtSound = new Audio("https://cdn.freesound.org/previews/262/262279_4902403-lq.mp3");
    this.hurtSound.volume = 0.2;
    this.coinSound = new Audio("https://cdn.freesound.org/previews/779/779239_15068221-lq.mp3");
    this.coinSound.volume = 0.3;
    this.bottleSound = new Audio("https://cdn.freesound.org/previews/326/326039_8238-lq.mp3");
    this.bottleSound.volume = 0.2;
    this.chickenDeathSound = new Audio("https://cdn.freesound.org/previews/667/667601_2971579-lq.mp3");
    this.chickenDeathSound.volume = 0.3;
  }

  /**
   * Links the character to this world.
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Starts the main game loop.
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
   * Checks if the game should end.
   */
  checkEndGame() {
    let endboss = this.findEndboss();
    if (this.character.endGame || (endboss && endboss.endGame)) {
      setTimeout(() => {
        if (typeof resetToStartScreen === "function") {
          resetToStartScreen();
        }
      }, 2000);
    }
  }

  /**
   * Finds the endboss in the level.
   * @returns {Endboss|undefined} The endboss or undefined
   */
  findEndboss() {
    return this.level.enemies.find((e) => e instanceof Endboss);
  }

  /**
   * Updates the endboss facing direction.
   */
  updateEndbossDirection() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss && !enemy.isDead) {
        enemy.lookAtCharacter(this.character);
      }
    });
  }

  /**
   * Checks collisions between bottles and enemies.
   */
  checkBottleEnemyCollisions() {
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        this.checkSingleBottleEnemyCollision(bottle, enemy);
      });
    });
  }

  /**
   * Checks a single bottle-enemy collision.
   */
  checkSingleBottleEnemyCollision(bottle, enemy) {
    if (!bottle.isColliding(enemy) || bottle.hasHit || enemy.isDead) return;
    bottle.hasHit = true;
    if (enemy instanceof Endboss) {
      this.handleBottleHitsEndboss(enemy);
    } else {
      this.handleBottleHitsChicken(enemy);
    }
  }

  /**
   * Handles bottle hits on endboss.
   */
  handleBottleHitsEndboss(enemy) {
    enemy.energy -= 20;
    enemy.lastHit = new Date().getTime();
    if (enemy.energy <= 0) {
      enemy.energy = 0;
      enemy.isDead = true;
    } else {
      enemy.performCounterAttack(this.character);
    }
    this.endbossBar.setPercentage(enemy.energy);
    this.playChickenDeathSound();
    if (typeof enemy.playHurtSound === "function") {
      enemy.playHurtSound();
    }
  }

  /**
   * Handles bottle hits on chicken.
   */
  handleBottleHitsChicken(enemy) {
    enemy.isDead = true;
    this.playChickenDeathSound();
  }

  /**
   * Plays the chicken death sound.
   */
  playChickenDeathSound() {
    try {
      this.chickenDeathSound.currentTime = 1;
      this.chickenDeathSound.play().catch(() => { });
    } catch (e) { }
  }

  /**
   * Handles throwing of bottles.
   */
  checkThrowableObjects() {
    let currentTime = Date.now();
    let timeSinceLastThrow = currentTime - this.lastThrowTime;
    if (!this.canThrowBottle(timeSinceLastThrow)) return;
    this.throwBottle();
    this.lastThrowTime = currentTime;
  }

  /**
   * Checks if a bottle can be thrown.
   */
  canThrowBottle(timeSinceLastThrow) {
    return this.keyboard.D && this.collectedBottles > 0 && timeSinceLastThrow > 400;
  }

  /**
   * Throws a bottle.
   */
  throwBottle() {
    let direction = this.character.otherDirection ? -1 : 1;
    let spawnX = this.character.otherDirection
      ? this.character.x + (-20)
      : this.character.x + 60;
    let bottle = new ThrowableObject(spawnX, this.character.y + 80, direction);
    this.throwableObjects.push(bottle);
    this.collectedBottles--;
    this.updateBottleBar();
    this.character.lastActivity = Date.now();
  }

  /**
   * Updates the bottle status bar.
   */
  updateBottleBar() {
    let totalBottles = this.level?.initialBottlesCount || 0;
    let percentage = totalBottles > 0 ? (this.collectedBottles / totalBottles) * 100 : 0;
    this.bottleBar.setPercentage(percentage);
  }

  /**
   * Checks collisions between character and enemies.
   */
  checkAllEnemyCollisions() {
    const isVictory = this.findEndboss()?.isDead;
    this.level.enemies.forEach((enemy) => {
      this.checkSingleEnemyCollision(enemy, isVictory);
    });
  }

  /**
   * Checks a single enemy collision.
   */
  checkSingleEnemyCollision(enemy, isVictory) {
    if (!this.character.isColliding(enemy)) return;
    if (this.character.isJumpingOnEnemy(enemy)) {
      this.handleJumpOnEnemy(enemy);
    } else {
      this.handleEnemyHitsCharacter(enemy, isVictory);
    }
  }

  /**
   * Handles jump on enemy.
   */
  handleJumpOnEnemy(enemy) {
    if (enemy instanceof Endboss) {
      this.handleJumpOnEndboss(enemy);
    } else {
      this.handleJumpOnChicken(enemy);
    }
  }

  /**
   * Handles jump on endboss.
   */
  handleJumpOnEndboss(enemy) {
    if (enemy.isDead) {
      this.bounceCharacter();
      return;
    }
    if (this.character.consecutiveBossJumps >= 1) {
      this.damageCharacterFromBossJump();
    } else {
      this.damageBossFromJump(enemy);
    }
    this.bounceCharacter();
  }

  /**
   * Damages the character from consecutive boss jump.
   */
  damageCharacterFromBossJump() {
    this.character.hit();
    this.healthBar.setPercentage(this.character.energy);
    this.playHurtSound();
  }

  /**
   * Damages the boss from jump.
   */
  damageBossFromJump(enemy) {
    enemy.hit();
    if (enemy.energy <= 0) {
      enemy.energy = 0;
      enemy.isDead = true;
    } else {
      enemy.performCounterAttack(this.character);
    }
    this.endbossBar.setPercentage(enemy.energy);
    this.playChickenDeathSound();
    if (typeof enemy.playHurtSound === "function") {
      enemy.playHurtSound();
    }
    this.character.consecutiveBossJumps++;
  }

  /**
   * Handles jump on chicken.
   */
  handleJumpOnChicken(enemy) {
    if (!enemy.isDead) {
      enemy.isDead = true;
      this.playChickenDeathSound();
    }
    this.bounceCharacter();
  }

  /**
   * Makes the character bounce.
   */
  bounceCharacter() {
    this.character.jump();
    this.character.lastBounceTime = Date.now();
  }

  /**
   * Handles enemy hits on character.
   */
  handleEnemyHitsCharacter(enemy, isVictory) {
    if (!this.canEnemyDamageCharacter(enemy, isVictory)) return;
    this.character.hit();
    this.healthBar.setPercentage(this.character.energy);
    this.playHurtSoundWithCooldown();
  }

  /**
   * Checks if enemy can damage the character.
   */
  canEnemyDamageCharacter(enemy, isVictory) {
    return !enemy.isDead &&
      !this.character.isHurt() &&
      !this.character.isDead() &&
      !isVictory &&
      Date.now() - this.character.lastBounceTime > 300;
  }

  /**
   * Plays hurt sound with cooldown.
   */
  playHurtSoundWithCooldown() {
    let currentTime = new Date().getTime();
    if (currentTime - this.lastHitTime > 500) {
      this.playHurtSound();
      this.lastHitTime = currentTime;
    }
  }

  /**
   * Plays the hurt sound.
   */
  playHurtSound() {
    try {
      this.hurtSound.play().catch(() => { });
    } catch (e) { }
  }

  /**
   * Main draw loop.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.drawGameObjects();
    this.ctx.translate(-this.camera_x, 0);
    this.drawUI();
    this.drawEndScreens();
    this.checkGameLogic();
    this.requestNextFrame();
  }

  /**
   * Draws all game objects.
   */
  drawGameObjects() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObjects);
  }

  /**
   * Draws the UI elements.
   */
  drawUI() {
    this.addToMap(this.healthBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.bottleBar);
    if (this.endbossBar.isVisible) {
      this.addToMap(this.endbossBar);
    }
  }

  /**
   * Draws the end screens.
   */
  drawEndScreens() {
    let endboss = this.findEndboss();
    if (this.character.endGame) {
      this.addToMap(this.gameOverLost);
    } else if (endboss && endboss.endGame) {
      this.addToMap(this.gameOverWin);
    }
  }

  /**
   * Checks game logic in the draw loop.
   */
  checkGameLogic() {
    if (!isPaused) {
      this.checkAllEnemyCollisions();
      this.checkThrowableObjects();
    }
  }

  /**
   * Requests the next frame.
   */
  requestNextFrame() {
    let self = this;
    this.animationId = requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Checks collisions with bottles.
   */
  checkBottleCollisions() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.collectBottle(index);
      }
    });
  }

  /**
   * Collects a bottle.
   */
  collectBottle(index) {
    this.level.bottles.splice(index, 1);
    this.collectedBottles++;
    this.updateBottleBar();
    this.playBottleSound();
  }

  /**
   * Plays the bottle sound.
   */
  playBottleSound() {
    try {
      this.bottleSound.currentTime = 0;
      this.bottleSound.play().catch(() => { });
    } catch (e) { }
  }

  /**
   * Checks collisions with coins.
   */
  checkCoinCollisions() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.collectCoin(index);
      }
    });
  }

  /**
   * Collects a coin.
   */
  collectCoin(index) {
    this.level.coins.splice(index, 1);
    let totalCoins = this.level?.initialCoinsCount || 0;
    let coinsCollected = totalCoins - this.level.coins.length;
    let percentage = totalCoins > 0 ? (coinsCollected / totalCoins) * 100 : 0;
    this.coinBar.setPercentage(percentage);
    this.playCoinSound();
  }

  /**
   * Plays the coin sound.
   */
  playCoinSound() {
    try {
      this.coinSound.currentTime = 0.6;
      this.coinSound.play().catch(() => { });
    } catch (e) { }
  }

  /**
   * Adds multiple objects to the map.
   * @param {DrawableObject[]} objects - Array of objects
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  /**
   * Adds a single object to the map.
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
   * Flips the canvas for mirrored sprites.
   * @param {DrawableObject} mo - The object to flip
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the canvas after flipping.
   * @param {DrawableObject} mo - The flipped object
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Shows the endboss health bar when approaching.
   */
  checkEndbossAppearance() {
    let endboss = this.findEndboss();
    if (endboss && this.character.x >= endboss.x - 400) {
      this.endbossBar.isVisible = true;
    }
  }

  /**
   * Cleans up all intervals and sounds.
   */
  rewrite() {
    this.clearIntervals();
    this.stopCharacterSounds();
    this.stopWorldSounds();
    this.clearAllObjectIntervals();
  }

  /**
   * Clears all intervals.
   */
  clearIntervals() {
    if (this.runInterval) {
      clearInterval(this.runInterval);
      this.runInterval = null;
    }
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Stops character sounds.
   */
  stopCharacterSounds() {
    if (this.character) {
      this.stopSound(this.character.snoreSound);
      this.stopSound(this.character.walkingSound);
    }
  }

  /**
   * Stops world sounds.
   */
  stopWorldSounds() {
    [this.hurtSound, this.coinSound, this.bottleSound, this.chickenDeathSound].forEach((s) => {
      this.stopSound(s);
    });
  }

  /**
   * Stops a single sound.
   */
  stopSound(sound) {
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  /**
   * Clears all object intervals.
   */
  clearAllObjectIntervals() {
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
