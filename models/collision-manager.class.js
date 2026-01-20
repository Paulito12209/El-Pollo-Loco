/**
 * Verwaltet alle Kollisionen und Sammel-Aktionen im Spiel.
 * Extrahiert aus World-Klasse für bessere Code-Organisation.
 */
class CollisionManager {
    /**
     * Erstellt einen neuen CollisionManager.
     * @param {World} world - Die World-Instanz
     */
    constructor(world) {
        this.world = world;
    }

    // ==================== MÜNZEN SAMMELN ====================

    /**
     * Prüft Kollisionen mit Münzen.
     */
    checkCoinCollisions() {
        this.world.level.coins.forEach((coin, index) => {
            if (this.world.character.isColliding(coin)) {
                this.collectCoin(index);
            }
        });
    }

    /**
     * Sammelt eine Münze ein.
     */
    collectCoin(index) {
        this.world.level.coins.splice(index, 1);
        let totalCoins = this.world.level?.initialCoinsCount || 0;
        let coinsCollected = totalCoins - this.world.level.coins.length;
        let percentage = totalCoins > 0 ? (coinsCollected / totalCoins) * 100 : 0;
        this.world.coinBar.setPercentage(percentage);
        this.playCoinSound();
    }

    /**
     * Spielt den Münz-Sound ab.
     */
    playCoinSound() {
        try {
            this.world.coinSound.currentTime = 0.6;
            this.world.coinSound.play().catch(() => { });
        } catch (e) { }
    }

    // ==================== FLASCHEN SAMMELN ====================

    /**
     * Prüft Kollisionen mit Flaschen.
     */
    checkBottleCollisions() {
        this.world.level.bottles.forEach((bottle, index) => {
            if (this.world.character.isColliding(bottle)) {
                this.collectBottle(index);
            }
        });
    }

    /**
     * Sammelt eine Flasche ein.
     */
    collectBottle(index) {
        this.world.level.bottles.splice(index, 1);
        this.world.collectedBottles++;
        this.updateBottleBar();
        this.playBottleSound();
    }

    /**
     * Spielt den Flaschen-Sound ab.
     */
    playBottleSound() {
        try {
            this.world.bottleSound.currentTime = 0;
            this.world.bottleSound.play().catch(() => { });
        } catch (e) { }
    }

    // ==================== FLASCHEN WERFEN ====================

    /**
     * Behandelt das Werfen von Flaschen.
     */
    checkThrowableObjects() {
        let currentTime = Date.now();
        let timeSinceLastThrow = currentTime - this.world.lastThrowTime;
        if (!this.canThrowBottle(timeSinceLastThrow)) return;
        this.throwBottle();
        this.world.lastThrowTime = currentTime;
    }

    /**
     * Prüft ob eine Flasche geworfen werden kann.
     */
    canThrowBottle(timeSinceLastThrow) {
        return this.world.keyboard.D && this.world.collectedBottles > 0 && timeSinceLastThrow > 400;
    }

    /**
     * Wirft eine Flasche.
     */
    throwBottle() {
        let direction = this.world.character.otherDirection ? -1 : 1;
        let spawnX = this.world.character.otherDirection
            ? this.world.character.x + (-20)
            : this.world.character.x + 60;
        let bottle = new ThrowableObject(spawnX, this.world.character.y + 80, direction);
        this.world.throwableObjects.push(bottle);
        this.world.collectedBottles--;
        this.updateBottleBar();
        this.world.character.lastActivity = Date.now();
    }

    /**
     * Aktualisiert die Flaschen-Statusleiste.
     */
    updateBottleBar() {
        let totalBottles = this.world.level?.initialBottlesCount || 0;
        let percentage = totalBottles > 0 ? (this.world.collectedBottles / totalBottles) * 100 : 0;
        this.world.bottleBar.setPercentage(percentage);
    }

    // ==================== FLASCHE TRIFFT GEGNER ====================

    /**
     * Prüft Kollisionen zwischen Flaschen und Gegnern.
     */
    checkBottleEnemyCollisions() {
        this.world.throwableObjects.forEach((bottle) => {
            this.world.level.enemies.forEach((enemy) => {
                this.checkSingleBottleEnemyCollision(bottle, enemy);
            });
        });
    }

    /**
     * Prüft eine einzelne Flasche-Gegner Kollision.
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
     * Behandelt Flaschentreffer auf Endboss.
     */
    handleBottleHitsEndboss(enemy) {
        enemy.energy -= 20;
        enemy.lastHit = new Date().getTime();
        if (enemy.energy <= 0) {
            enemy.energy = 0;
            enemy.isDead = true;
        } else {
            enemy.performCounterAttack(this.world.character);
        }
        this.world.endbossBar.setPercentage(enemy.energy);
        this.playChickenDeathSound();
        if (typeof enemy.playHurtSound === "function") {
            enemy.playHurtSound();
        }
    }

    /**
     * Behandelt Flaschentreffer auf Huhn.
     */
    handleBottleHitsChicken(enemy) {
        enemy.isDead = true;
        this.playChickenDeathSound();
    }

    // ==================== CHARAKTER-GEGNER KOLLISION ====================

    /**
     * Prüft Kollisionen zwischen Charakter und Gegnern.
     */
    checkAllEnemyCollisions() {
        const isVictory = this.world.findEndboss()?.isDead;
        this.world.level.enemies.forEach((enemy) => {
            this.checkSingleEnemyCollision(enemy, isVictory);
        });
    }

    /**
     * Prüft eine einzelne Gegner-Kollision.
     */
    checkSingleEnemyCollision(enemy, isVictory) {
        if (!this.world.character.isColliding(enemy)) return;
        if (this.world.character.isJumpingOnEnemy(enemy)) {
            this.handleJumpOnEnemy(enemy);
        } else {
            this.handleEnemyHitsCharacter(enemy, isVictory);
        }
    }

    /**
     * Behandelt Sprung auf Gegner.
     */
    handleJumpOnEnemy(enemy) {
        if (enemy instanceof Endboss) {
            this.handleJumpOnEndboss(enemy);
        } else {
            this.handleJumpOnChicken(enemy);
        }
    }

    /**
     * Behandelt Sprung auf Endboss.
     */
    handleJumpOnEndboss(enemy) {
        if (enemy.isDead) {
            this.bounceCharacter();
            return;
        }
        if (this.world.character.consecutiveBossJumps >= 1) {
            this.damageCharacterFromBossJump();
        } else {
            this.damageBossFromJump(enemy);
        }
        this.bounceCharacter();
    }

    /**
     * Schadet dem Charakter bei aufeinanderfolgendem Boss-Sprung.
     */
    damageCharacterFromBossJump() {
        this.world.character.hit();
        this.world.healthBar.setPercentage(this.world.character.energy);
        this.playHurtSound();
    }

    /**
     * Schadet dem Boss durch Sprung.
     */
    damageBossFromJump(enemy) {
        enemy.hit();
        if (enemy.energy <= 0) {
            enemy.energy = 0;
            enemy.isDead = true;
        } else {
            enemy.performCounterAttack(this.world.character);
        }
        this.world.endbossBar.setPercentage(enemy.energy);
        this.playChickenDeathSound();
        if (typeof enemy.playHurtSound === "function") {
            enemy.playHurtSound();
        }
        this.world.character.consecutiveBossJumps++;
    }

    /**
     * Behandelt Sprung auf Huhn.
     */
    handleJumpOnChicken(enemy) {
        if (!enemy.isDead) {
            enemy.isDead = true;
            this.playChickenDeathSound();
        }
        this.bounceCharacter();
    }

    /**
     * Lässt den Charakter abprallen.
     */
    bounceCharacter() {
        this.world.character.jump();
        this.world.character.lastBounceTime = Date.now();
    }

    /**
     * Behandelt Gegner trifft Charakter.
     */
    handleEnemyHitsCharacter(enemy, isVictory) {
        if (!this.canEnemyDamageCharacter(enemy, isVictory)) return;
        this.world.character.hit();
        this.world.healthBar.setPercentage(this.world.character.energy);
        this.playHurtSoundWithCooldown();
    }

    /**
     * Prüft ob Gegner dem Charakter schaden kann.
     */
    canEnemyDamageCharacter(enemy, isVictory) {
        return !enemy.isDead &&
            !this.world.character.isHurt() &&
            !this.world.character.isDead() &&
            !isVictory &&
            Date.now() - this.world.character.lastBounceTime > 300;
    }

    // ==================== SOUNDS ====================

    /**
     * Spielt den Hühner-Tod-Sound ab.
     */
    playChickenDeathSound() {
        try {
            this.world.chickenDeathSound.currentTime = 1;
            this.world.chickenDeathSound.play().catch(() => { });
        } catch (e) { }
    }

    /**
     * Spielt den Schmerz-Sound mit Cooldown ab.
     */
    playHurtSoundWithCooldown() {
        let currentTime = new Date().getTime();
        if (currentTime - this.world.lastHitTime > 500) {
            this.playHurtSound();
            this.world.lastHitTime = currentTime;
        }
    }

    /**
     * Spielt den Schmerz-Sound ab.
     */
    playHurtSound() {
        try {
            this.world.hurtSound.play().catch(() => { });
        } catch (e) { }
    }
}
