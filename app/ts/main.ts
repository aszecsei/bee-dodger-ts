import * as config from "./config";
import { game } from "./game";
import { InputManager, Key } from "./input";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = config.CANVAS_WIDTH;
canvas.height = config.CANVAS_HEIGHT;
const ctx = canvas.getContext("2d", {alpha: false});
ctx.imageSmoothingEnabled = false;
ctx.textBaseline = "middle";
canvas.width = config.CANVAS_WIDTH;
canvas.height = config.CANVAS_HEIGHT;
const FPS = 30;

// TODO: Load all resources

let last = -1;
const fpsList = [0];

// add input listeners
window.addEventListener("keyup", (event: KeyboardEvent) => InputManager.onKeyup(event));
window.addEventListener("keydown", (event: KeyboardEvent) => InputManager.onKeydown(event));

function gameloop(ts: number) {
  let inc = 0;
  if (last === -1) {
    last = ts;
  } else {
    inc = ts - last;
    last = ts;
  }

  ctx.clearRect(0, 0, config.CANVAS_WIDTH, config.CANVAS_HEIGHT);

  game.currentScreen.update(inc);
  game.currentScreen.draw(ctx, inc);

  /* FPS Counter */
  if (config.DEBUG) {
    fpsList.push(inc);
    if (fpsList.length > 10) {
      fpsList.shift();
      ctx.fillStyle = "white";
      ctx.font = "1em 'Press Start 2P";
      const avgFPS = fpsList.reduce((x, y) => x + y, 0) / 10;
      ctx.fillText(`FPS: ${(1000 / avgFPS).toFixed(3)}`, 50, 50);
    }
  }

  InputManager.flush();

  window.requestAnimationFrame(gameloop);
}
window.requestAnimationFrame(gameloop);
