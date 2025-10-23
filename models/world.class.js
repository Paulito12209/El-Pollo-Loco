class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  healthBar = new HealthBar();
  coinBar = new CoinBar(); // Münzen ✅
  bottleBar = new BottleBar(); // Flaschen ✅
  throwableObjects = [];
  collectedBottles = 0; // Gesammelte Flaschen ✅

  hurtSound = new Audio(
    "https://cdn.freesound.org/previews/262/262279_4902403-lq.mp3"
  );
  lastHitTime = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.hurtSound.volume = 0.3; // Lautstärke bei Berührung mit Chicken
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowableObjects();
      this.checkCoinCollisions(); // ✅
      this.checkBottleCollisions(); // ✅
    }, 200);
  }

  checkThrowableObjects() {
    if (this.keyboard.D) {
      let bottle = new ThrowableObject(
        this.character.x + 60,
        this.character.y + 80
      );
      this.throwableObjects.push(bottle);
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.healthBar.setPercentage(this.character.energy);

        // Sound nur abspielen, wenn seit letztem Hit halbe Sekunde vergangen
        let currentTime = new Date().getTime();
        if (currentTime - this.lastHitTime > 500) {
          this.hurtSound.play(); // Sound wenn Berührung mit Chicken
          this.lastHitTime = currentTime;
        }
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    // Mit Kamera (bewegen sich mit der Welt)
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins); // Münzen ✅
    this.addObjectsToMap(this.level.bottles); // Flaschen ✅
    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);

    // Ohne Kamera (bleiben fix auf dem Bildschirm)
    this.addToMap(this.healthBar);
    this.addToMap(this.coinBar); // Coin Bar ✅
    this.addToMap(this.bottleBar); // Bottle Bar ✅

    this.ctx.translate(this.camera_x, 0);
    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  checkBottleCollisions() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        // Bottle aus dem Level entfernen
        this.level.bottles.splice(index, 1);

        // Counter erhöhen
        this.collectedBottles++;

        // Bottle Bar aktualisieren
        let totalBottles = 4; // Gesamtanzahl der Bottles im Level
        let percentage = (this.collectedBottles / totalBottles) * 100;
        this.bottleBar.setPercentage(percentage);
      }
    });
  }

  checkCoinCollisions() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        // Münze aus dem Level entfernen
        this.level.coins.splice(index, 1);

        // Coin Bar aktualisieren
        let totalCoins = 14; // <-- Hier die Gesamtzahl der Münzen definieren (14 Coins im Level = 100%)
        let coinsCollected = totalCoins - this.level.coins.length;
        let percentage = (coinsCollected / totalCoins) * 100;
        this.coinBar.setPercentage(percentage);
      }
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

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

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  // === NACHTRAG aus PL2 - Lektion 10.2 ===
  // verwirrte mich!
}
