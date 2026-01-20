/**
 * Haupt-Spielwelt die alle Spielobjekte, Rendering und Spielstatus verwaltet.
 * Kollisionslogik wurde in CollisionManager ausgelagert.
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
  collisionManager;

  /**
   * Erstellt eine neue World-Instanz.
   * @param {HTMLCanvasElement} canvas - Das Canvas-Element
   * @param {Keyboard} keyboard - Der Keyboard-Handler
   */
  constructor(canvas, keyboard) {
    this.initializeCanvas(canvas, keyboard);
    this.initializeSounds();
    this.collisionManager = new CollisionManager(this);
    this.draw();
    this.setWorld();
    this.run();
  }

  /**
   * Initialisiert Canvas und Keyboard.
   */
  initializeCanvas(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
  }

  /**
   * Initialisiert alle Sound-Effekte.
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
   * Verknüpft den Charakter mit dieser Welt.
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Startet die Haupt-Game-Loop.
   */
  run() {
    this.runInterval = setInterval(() => {
      if (isPaused) return;
      this.collisionManager.checkCoinCollisions();
      this.collisionManager.checkBottleCollisions();
      this.collisionManager.checkBottleEnemyCollisions();
      this.checkEndbossAppearance();
      this.updateEndbossDirection();
      this.checkEndGame();
    }, 200);
  }

  /**
   * Prüft ob das Spiel enden soll.
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
   * Findet den Endboss im Level.
   * @returns {Endboss|undefined} Der Endboss oder undefined
   */
  findEndboss() {
    return this.level.enemies.find((e) => e instanceof Endboss);
  }

  /**
   * Aktualisiert die Blickrichtung des Endboss.
   */
  updateEndbossDirection() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss && !enemy.isDead) {
        enemy.lookAtCharacter(this.character);
      }
    });
  }

  /**
   * Haupt-Draw-Loop.
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
   * Zeichnet alle Spielobjekte.
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
   * Zeichnet die UI-Elemente.
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
   * Zeichnet die Endbildschirme.
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
   * Prüft Spiellogik in der Draw-Loop.
   */
  checkGameLogic() {
    if (!isPaused) {
      this.collisionManager.checkAllEnemyCollisions();
      this.collisionManager.checkThrowableObjects();
    }
  }

  /**
   * Fordert den nächsten Frame an.
   */
  requestNextFrame() {
    let self = this;
    this.animationId = requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Fügt mehrere Objekte zur Map hinzu.
   * @param {DrawableObject[]} objects - Array von Objekten
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  /**
   * Fügt ein einzelnes Objekt zur Map hinzu.
   * @param {DrawableObject} mo - Das zu zeichnende Objekt
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
   * Spiegelt das Canvas für gespiegelte Sprites.
   * @param {DrawableObject} mo - Das zu spiegelnde Objekt
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Stellt das Canvas nach dem Spiegeln wieder her.
   * @param {DrawableObject} mo - Das gespiegelte Objekt
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Zeigt die Endboss-Lebensleiste wenn man sich nähert.
   */
  checkEndbossAppearance() {
    let endboss = this.findEndboss();
    if (endboss && this.character.x >= endboss.x - 400) {
      this.endbossBar.isVisible = true;
    }
  }

  /**
   * Räumt alle Intervalle und Sounds auf.
   */
  rewrite() {
    this.clearIntervals();
    this.stopCharacterSounds();
    this.stopWorldSounds();
    this.clearAllObjectIntervals();
  }

  /**
   * Löscht alle Intervalle.
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
   * Stoppt Charakter-Sounds.
   */
  stopCharacterSounds() {
    if (this.character) {
      this.stopSound(this.character.snoreSound);
      this.stopSound(this.character.walkingSound);
    }
  }

  /**
   * Stoppt World-Sounds.
   */
  stopWorldSounds() {
    [this.hurtSound, this.coinSound, this.bottleSound, this.chickenDeathSound].forEach((s) => {
      this.stopSound(s);
    });
  }

  /**
   * Stoppt einen einzelnen Sound.
   */
  stopSound(sound) {
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  /**
   * Löscht alle Objekt-Intervalle.
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
