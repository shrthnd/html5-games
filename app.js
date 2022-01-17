const SPACER = 25; 
const FPS = 15; 
let TIMESTAMP = 0; 

const Vector = (x, y) => {
  return {
    x: x,
    y: y
  }
}

const player = {
  maxLength: 1,
  position: Vector(10, 10),
  velocity: Vector(0,0),
  body: [],
  collisions: () => {
    // check collision with self 
    for (let i = world.player.body.length - 1; i > 0; i--) {
      if (
        world.player.position.x == world.player.body[i].x &&
        world.player.position.y == world.player.body[i].y
      ) {
        world.playing = false; 
        canvas.style.backgroundColor = 'red'; 
      }
    }
  },
  draw: (world) => {
    // draw leading node
    context.fillStyle = 'white'; 
    context.fillRect(world.player.position.x, world.player.position.y, SPACER, SPACER);

    // draw remaining nodes
    let j = 0; 
    for (let i = world.player.body.length - 1; i > -1; i--) {
      if (j >= world.player.maxLength) {
        break;
      }
      context.fillRect(world.player.body[i].x, world.player.body[i].y, SPACER, SPACER); 
      j++;      
    }

    // check collisions and draw new chips
    player.collisions();
    chips.draw(); 
    chips.collisions(); 

    // paint context
    context.fill();

    // boundary check
    const nextPositionX = world.player.position.x + (world.player.velocity.x * SPACER);
    const nextPositionY = world.player.position.y + (world.player.velocity.y * SPACER); 
    if (
      nextPositionX < world.canvas.width - SPACER &&
      nextPositionY < world.canvas.height - SPACER && 
      nextPositionX > 0 &&
      nextPositionY > 0
    ) {
      world.player.body.push({
        x: world.player.position.x, 
        y: world.player.position.y
      });

      world.player.body = world.player.body.slice(
        world.player.body.length - world.player.maxLength, 
        world.player.body.length
      );
      
      world.player.position.x = nextPositionX;
      world.player.position.y = nextPositionY;
    }
    world.keypressed = false; 
  }
}


const chips = {
  collisions: () => {
    // check collision with chips
    for (let i = 0; i < world.chips.length; i++) {
      if (
        world.chips[i].x == world.player.position.x &&
        world.chips[i].y == world.player.position.y
      ) {
        world.player.maxLength++;
        world.chips.splice(i, 1); 
        for (let i = 0; i < 2; i++) {
          world.chips.push(
            Vector(
              10 + SPACER * (Math.floor(Math.random() * Math.floor((world.canvas.width - 10) / SPACER))), 
              10 + SPACER * (Math.floor(Math.random() * Math.floor((world.canvas.height - 10) / SPACER)))
            )
          );
        }
      }
    }
  },
  draw: () => {
    // draw chips
    for (let i = 0; i < world.chips.length; i++) {
      context.fillStyle = 'darkblue'; 
      context.fillRect(world.chips[i].x, world.chips[i].y, SPACER, SPACER); 
    }
  }
}

// game world
const world = {
  playing: false, 
  canvas: {
    width: window.innerWidth - 1,
    height: window.innerHeight - 4,
  },
  keypressed: false,
  chips: [Vector(10+SPACER*2, 10+SPACER*2)], 
  player: player
}

// create canvas
const body = document.getElementsByTagName("body")[0];
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

body.style.overflow = 'hidden';
canvas.id = 'canvas';
canvas.style.backgroundColor = 'blue';
canvas.width = world.canvas.width;
canvas.height = world.canvas.height;
body.append(canvas);

// keyboard and mouse events
const handleKeys = (e) => {
    const KEY = e.key;
    world.keypressed = true; 
    switch (KEY) {
      case ' ':
        // spacer to reset
        world.player.position = Vector(10,10);
        world.player.velocity = Vector(0,0);
        world.player.body = []; 
        world.player.maxLength = 0; 
        world.chips = [Vector(10+SPACER*2, 10+SPACER*2)]; 
        canvas.style.backgroundColor = 'blue'; 
        world.playing = true; 
        break;
      case 'ArrowUp':
        if (world.player.velocity.y != 1) {
          world.player.velocity = Vector(0, -1);
        }
        break;
      case 'ArrowDown':
        if (world.player.velocity.y != -1) {
          world.player.velocity = Vector(0, 1);
        }
        break;
      case 'ArrowLeft':
        if (world.player.velocity.x != 1) {
          world.player.velocity = Vector(-1, 0);
        }
        break;
      case 'ArrowRight':
        if (world.player.velocity.x != -1) {
          world.player.velocity = Vector(1, 0);
        }
        break;
      default: 
    }
}
window.addEventListener('keydown', handleKeys);

const scoreboard = () => {
  context.font = '30px Comic Sans MS'; 
  context.fillStyle = 'white';
  context.textAlign = 'right'; 
  context.fillText(world.player.maxLength, world.canvas.width - 10, 35); 
}

const startScreen = () => {
  if (!world.playing) {
    context.font = '30px Comic Sans MS'; 
    context.fillStyle = 'white';
    context.textAlign = 'center'; 
    context.fillText('Space to start. Arrow keys to move.', world.canvas.width / 2, world.canvas.height / 2 + 15);  
  }
}

// game loop
const draw = (now) => {
  requestAnimationFrame(draw);
  
  if (now - TIMESTAMP < 1000 / FPS || !world.playing) return; 
  
  context.clearRect(0, 0, world.canvas.width, world.canvas.height);
  scoreboard();
  world.player.draw(world);
  startScreen();
  
  TIMESTAMP = now;
}

startScreen(); 
draw(); 