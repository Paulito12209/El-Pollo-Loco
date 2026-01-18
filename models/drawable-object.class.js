/**
 * Base class for all visible game objects.
 * Handles image loading, caching, drawing to canvas, and interval management.
 */
class DrawableObject {
  x = 120;
  y = 220;
  height = 200;
  width = 100;

  imageCache = {};
  currentImage = 0;
  img;
  // Track intervals created by this object for proper cleanup
  _intervals = [];

  /**
   * Loads a single image from the given path.
   * @param {string} path - Path to the image file
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the object's current image on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws a debug frame around the object (currently disabled).
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  drawFrame(ctx) {
    // Debug hitbox visualization (disabled in production)
    // if (
    //   this instanceof Character ||
    //   this instanceof Chicken ||
    //   this instanceof Bottle ||
    //   this instanceof Coin ||
    //   this instanceof Endboss
    // ) {
    //   ctx.beginPath();
    //   ctx.lineWidth = "1";
    //   ctx.strokeStyle = "blue";
    //   ctx.rect(this.x, this.y, this.width, this.height);
    //   ctx.stroke();
    // }
  }

  /**
   * Loads multiple images and caches them for animation use.
   * @param {string[]} arr - Array of image paths to load
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      img.style = "transform: scaleX(-1)";
      this.imageCache[path] = img;
    });
  }

  /**
   * Creates an interval and tracks it for later cleanup.
   * @param {Function} callback - Function to execute at each interval
   * @param {number} ms - Interval duration in milliseconds
   * @returns {number} The interval ID
   */
  setGameInterval(callback, ms) {
    const id = setInterval(callback, ms);
    this._intervals.push(id);
    return id;
  }

  /**
   * Clears all intervals created by this object.
   * Should be called when object is destroyed or game ends.
   */
  clearAllIntervals() {
    this._intervals.forEach((id) => clearInterval(id));
    this._intervals = [];
  }
}
