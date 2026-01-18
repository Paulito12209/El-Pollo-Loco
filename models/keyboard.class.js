/**
 * Tracks the state of keyboard inputs.
 * Used for player controls.
 * @extends MovableObject
 */
class Keyboard extends MovableObject {
  LEFT = false;
  RIGHT = false;
  UP = false;
  DOWN = false;
  SPACE = false;
  D = false;
  F = false;

  /**
   * Creates a new keyboard state tracker.
   */
  constructor() {
    super();
  }
}
