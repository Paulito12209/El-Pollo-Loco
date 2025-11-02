class World {
  character = new Character();
  level = level1;
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

  Endscreens;
  gameOverWin = new Endscreen(
    "img/9_intro_outro_screens/game_over/game over.png"
  );
  gameOverLost = new Endscreen(
    "img/9_intro_outro_screens/game_over/you lost.png"
  );

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;

    this.hurtSound = new Audio(
      "https://cdn.freesound.org/previews/262/262279_4902403-lq.mp3"
    );
    this.hurtSound.volume = 0.3;
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

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      if (isPaused) return;

      this.checkThrowableObjects();
      this.checkCoinCollisions();
      this.checkBottleCollisions();
      this.checkBottleEnemyCollisions();
      this.checkEndbossAppearance();
      this.updateEndbossDirection();
      this.checkEndGame();
    }, 200);
  }

  checkEndGame() {
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);

    if (this.character.endGame || (endboss && endboss.endGame)) {
      setTimeout(() => {
        document.location.reload();
      }, 2000);
    }
  }

  updateEndbossDirection() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss && !enemy.isDead) {
        enemy.lookAtCharacter(this.character);
      }
    });
  }

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
            this.chickenDeathSound.currentTime = 1;
            this.chickenDeathSound.play();
          } else {
            enemy.isDead = true;
            this.chickenDeathSound.currentTime = 1;
            this.chickenDeathSound.play();
          }
        }
      });
    });
  }

  checkThrowableObjects() {
    if (this.keyboard.D && this.collectedBottles > 0) {
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
    }
  }

  updateBottleBar() {
    let totalBottles = 7;
    let percentage = (this.collectedBottles / totalBottles) * 100;
    this.bottleBar.setPercentage(percentage);
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        if (this.character.isJumpingOnEnemy(enemy)) {
          if (enemy instanceof Endboss) {
            if (!enemy.isDead) {
              enemy.hit();
              if (enemy.energy <= 0) {
                enemy.energy = 0;
                enemy.isDead = true;
              } else {
                enemy.performCounterAttack(this.character);
              }
              this.endbossBar.setPercentage(enemy.energy);
              this.chickenDeathSound.currentTime = 1;
              this.chickenDeathSound.play();
            }
          } else {
            if (!enemy.isDead) {
              enemy.isDead = true;
              this.chickenDeathSound.currentTime = 1;
              this.chickenDeathSound.play();
            }
          }
          this.character.jump();
        } else if (
          !enemy.isDead &&
          !this.character.isHurt() &&
          !this.character.isDead()
        ) {
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

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);

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
    }

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  checkBottleCollisions() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.level.bottles.splice(index, 1);
        this.collectedBottles++;
        this.updateBottleBar();
        this.bottleSound.currentTime = 0;
        this.bottleSound.play();
      }
    });
  }

  checkCoinCollisions() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.level.coins.splice(index, 1);
        let totalCoins = 14;
        let coinsCollected = totalCoins - this.level.coins.length;
        let percentage = (coinsCollected / totalCoins) * 100;
        this.coinBar.setPercentage(percentage);
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

  checkEndbossAppearance() {
    if (this.character.x >= 600) {
      this.endbossBar.isVisible = true;
    }
  }
}
