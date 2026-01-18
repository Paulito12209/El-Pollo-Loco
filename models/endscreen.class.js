/**
 * Represents an end screen (win or lose).
 * Displays a full-screen image overlay.
 * @extends DrawableObject
 */
class Endscreen extends DrawableObject {
  width = 720;
  height = 480;
  x = 0;
  y = 0;

  /**
   * Creates a new end screen.
   * @param {string} imagePath - Path to the end screen image
   */
  constructor(imagePath) {
    super().loadImage(imagePath);
  }
}
