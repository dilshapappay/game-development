import Paddle from "/src/paddle.js";
import InputHandler from "/src/input.js";
import Ball from "/src/ball.js";
import Brick from "/src/brick.js";
import { buildLevel, level1 } from "/src/levels.js";

const GAME_STATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAME_OVER: 3,
};

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
  }

  start() {
    this.gameState = GAME_STATE.RUNNING;
    this.paddle = new Paddle(this);
    this.ball = new Ball(this);

    let bricks = buildLevel(level1, this); // Correct order of arguments

    this.gameObjects = [this.paddle, this.ball, ...bricks];
    new InputHandler(this.paddle, this);
  }

  update(deltaTime) {
    if (this.gameState == GAME_STATE.PAUSED) return;
    this.gameObjects.forEach((object) => object.update(deltaTime));
    this.gameObjects = this.gameObjects.filter(
      (object) => !object.markedForDeletion
    );
  }

  draw(ctx) {
    this.gameObjects.forEach((object) => object.draw(ctx));
    if (this.gameState == GAME_STATE.PAUSED) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fill();
    }
  }

  togglePause() {
    if (this.gameState == GAME_STATE.PAUSED) {
      this.gameState = GAME_STATE.RUNNING;
    } else {
      this.gameState = GAME_STATE.PAUSED;
    }
  }
}
