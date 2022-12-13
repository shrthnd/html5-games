const SPACER = 25; 
const FPS = 1000; 
const MAX_VELOCITY = 5;
const TWO_PI = 2*Math.PI;  
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
  rotation: 0,
  body: [],
  collisions: () => {
    // check collision with self 
    // for (let i = world.player.body.length - 1; i > 0; i--) {
    //   if (
    //     world.player.position.x == world.player.body[i].x &&
    //     world.player.position.y == world.player.body[i].y
    //   ) {
    //     world.playing = false; 
    //     canvas.style.backgroundColor = 'red'; 
    //   }
    // }
  },
  draw: (world) => {
    // context.save(); 
    const radius = SPACER + player.body.length;

    // draw leading node
    context.save();
    // console.log(player.rotation);
    // context.translate(world.player.position.x + SPACER / 2, world.player.position.y + SPACER / 2);
    // context.scale(1, 1.25);
    // context.transform(1, 0, 1, 0, 1, 0);
    context.translate(world.player.position.x, world.player.position.y);
    // context.rotate(player.rotation * Math.floor(Math.PI * 180));
    // context.fillRect(-SPACER / 2, -SPACER / 2, radius, radius);
    context.arc(-radius, -radius, radius, 0, TWO_PI, false);
    context.fillStyle = '#fff';
    // context.fill();
    context.clearRect(0,0,window.innerWidth,window.innerHeight)
    context.strokeStyle = ' #fff';
    context.stroke();
    // context.fillRect(world.player.position.x, world.player.position.y, SPACER, SPACER);
    context.restore();

    // paint context
    // context.restore(); 

    // boundary check
    const nextPositionX = world.player.position.x + (world.player.velocity.x);
    const nextPositionY = world.player.position.y + (world.player.velocity.y); 
    if (
      nextPositionX < world.canvas.width - radius &&
      nextPositionY < world.canvas.height - radius && 
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
    } else {
        if (nextPositionX < -radius) {
            world.player.position.x = world.canvas.width; 
        } else if (nextPositionX > world.canvas.width + radius) {
            world.player.position.x = 0;
        } else {
            world.player.position.x = nextPositionX;
        }
        if (nextPositionY < -radius) {
            world.player.position.y = world.canvas.height;
        } else if (nextPositionY > world.canvas.height + radius) {
            world.player.position.y = 0;
        } else {
            world.player.position.y = nextPositionY;
        }
    }
    world.keypressed = false; 
  }
}


const chips = {
  collisions: () => {
    // check collision with chips
    for (let i = 0; i < world.chips.length; i++) {
        // console.log(world.chips[i].x, world.player.position.x);
        // console.log(world.chips[i].y, world.player.position.y);
      if (
        (world.chips[i].x > world.player.position.x - SPACER && world.chips[i].x < world.player.position.x + SPACER) &&
        (world.chips[i].y > world.player.position.y - SPACER && world.chips[i].y < world.player.position.y + SPACER)
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
        canvas.style.backgroundColor = 'black'; 
        world.playing = true; 
        break;
      case 'ArrowUp':
        if (world.player.rotation < MAX_VELOCITY)
            world.player.rotation = world.player.rotation - .25;

        if (world.player.velocity.y > -MAX_VELOCITY) {
          world.player.velocity = Vector(world.player.velocity.x, world.player.velocity.y-2);
        }
        break;
      case 'ArrowDown':
        if (world.player.rotation < MAX_VELOCITY)
            world.player.rotation = world.player.rotation + .25;
    
        if (world.player.velocity.y < MAX_VELOCITY) {
          world.player.velocity = Vector(world.player.velocity.x, world.player.velocity.y+2);
        }
        break;
      case 'ArrowLeft':
        if (world.player.rotation < MAX_VELOCITY)
            world.player.rotation = world.player.rotation - .25;

        if (world.player.velocity.x > -MAX_VELOCITY) {
            world.player.velocity = Vector(world.player.velocity.x-2, world.player.velocity.y);
        }
        break;
      case 'ArrowRight':
        if (world.player.rotation < MAX_VELOCITY)
            world.player.rotation = world.player.rotation + .25;
            
        if (world.player.velocity.x < MAX_VELOCITY) {
            world.player.velocity = Vector(world.player.velocity.x+2, world.player.velocity.y);
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
  chips.collisions();
  chips.draw();
  player.collisions();
  world.player.draw(world);
  
//   startScreen();
  
  TIMESTAMP = now;
}

startScreen(); 
draw();     