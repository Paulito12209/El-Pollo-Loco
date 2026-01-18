/**
 * Base class for all visible game objects.
 * Handles image loading, caching, canvas drawing, and interval management.
 */
class DrawableObject {
  x = 120;
  y = 220;
  height = 200;
  width = 100;

  imageCache = {};
  currentImage = 0;
  img;
  // Tracks created intervals for cleanup
  _intervals = [];

  /**
   * Loads a single image from the specified path.
   * @param {string} path - Path to the image file
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the current image onto the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas context
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws a debug frame around the object (disabled).
   * @param {CanvasRenderingContext2D} ctx - The canvas context
   */
  drawFrame(ctx) {
    // Debug hitbox visualization (disabled in production)
  }

  /**
   * Loads multiple images and stores them in the cache.
   * @param {string[]} arr - Array of image paths
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
   * @param {Function} callback - Function to execute
   * @param {number} ms - Interval in milliseconds
   * @returns {number} The interval ID
   */
  setGameInterval(callback, ms) {
    const id = setInterval(callback, ms);
    this._intervals.push(id);
    return id;
  }

  /**
   * Clears all intervals created by this object.
   */
  clearAllIntervals() {
    this._intervals.forEach((id) => clearInterval(id));
    this._intervals = [];
  }
}
