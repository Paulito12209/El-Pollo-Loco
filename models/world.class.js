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

  lastHitTime = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.hurtSound = new Audio(
      "https://cdn.freesound.org/previews/262/262279_4902403-lq.mp3"
    ); // Sound bei Berührung mit Chicken ✅
    this.hurtSound.volume = 0.5;
    this.coinSound = new Audio(
      "https://cdn.freesound.org/previews/779/779239_15068221-lq.mp3"
    ); // Sound beim Einsammeln von Münzen ✅
    this.coinSound.volume = 0.5;
    this.bottleSound = new Audio(
      "https://cdn.freesound.org/previews/326/326039_8238-lq.mp3"
    ); // Sound beim Einsammeln von Flaschen
    this.bottleSound.volume = 0.5;
    this.chickenDeathSound = new Audio(
      "https://cdn.freesound.org/previews/667/667601_2971579-lq.mp3"
    ); // Sound von sterbende Chickens
    this.chickenDeathSound.volume = 0.5;

    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      // this.checkCollisions(); <- Ist jetzt in draw()
      this.checkThrowableObjects();
      this.checkCoinCollisions(); // ✅
      this.checkBottleCollisions(); // ✅
    }, 200);
  }

  checkThrowableObjects() {
    //                     ↓ Nur, wenn mindestens 1 Flasche gesammelt wurde
    if (this.keyboard.D && this.collectedBottles > 0) {
      let bottle = new ThrowableObject(
        this.character.x + 60,
        this.character.y + 80
      );
      this.throwableObjects.push(bottle);

      // Anzahl der Flasche muss reduziert werden, wenn eine geworfen wurde
      this.collectedBottles--;

      this.updateBottleBar();
    }
  }

  updateBottleBar() {
    let totalBottles = 4; // Gesamtanzahl der Bottles im Level
    let percentage = (this.collectedBottles / totalBottles) * 100;
    this.bottleBar.setPercentage(percentage);
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        // Prüfen: Von oben?
        if (this.character.isJumpingOnEnemy(enemy)) {
          // Von oben → Chicken stirbt
          if (!enemy.isDead) {
            enemy.isDead = true;
            this.chickenDeathSound.currentTime = 1; // Zurückspulen ✅
            this.chickenDeathSound.play(); // Sound abspielen ✅
          }

          this.character.jump();
        } else if (!enemy.isDead) {
          // Nur Schaden von der Seite, wenn Chicken noch lebt ✅
          this.character.hit();
          this.healthBar.setPercentage(this.character.energy);

          let currentTime = new Date().getTime();
          if (currentTime - this.lastHitTime > 500) {
            this.hurtSound.play();
            this.lastHitTime = currentTime;
          }
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

    // Kollisionen HIER prüfen (60x pro Sekunde!) ✅
    this.checkCollisions();

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
        this.updateBottleBar();

        //Sound abspielen
        this.bottleSound.currentTime = 0; // Zurückspulen auf Anfang
        this.bottleSound.play();
      }
    });
  }

  checkCoinCollisions() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        // Münze aus dem Level entfernen
        this.level.coins.splice(index, 1);

        // Coin Bar aktualisieren
        let totalCoins = 14; // <-- Hier die Gesamtzahl der Münzen definieren (In Lv1.js konfigurierbar)
        let coinsCollected = totalCoins - this.level.coins.length;
        let percentage = (coinsCollected / totalCoins) * 100;
        this.coinBar.setPercentage(percentage);

        // Sound abspielen ✅
        this.coinSound.currentTime = 0.6;
        this.coinSound.play();
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
