const SPACER = 25; 

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

    // draw chips
    for (let i = 0; i < world.chips.length; i++) {
        context.fillStyle = 'darkblue'; 
        context.fillRect(world.chips[i].x, world.chips[i].y, SPACER, SPACER); 
    }
    context.fill();
  }
}

// game world
const world = {
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
    switch (KEY) {
      case 'ArrowUp':
        world.player.position.y -= SPACER;
        world.keypressed = true; 
        break;
      case 'ArrowDown':
        world.player.position.y += SPACER;
        world.keypressed = true; 
        break;
      case 'ArrowLeft':
        world.player.position.x -= SPACER;
        world.keypressed = true; 
        break;
      case 'ArrowRight':
        world.player.position.x += SPACER;
        world.keypressed = true; 
        break;
      default: 
    }
    if (world.keypressed) {

      // check collision with chips
      if (world.chips.length) {
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
      }

      // check collision with self 
      for (let i = world.player.body.length - 1; i >= 0; i--) {
        if (
          world.player.position.x == world.player.body[i].x &&
          world.player.position.y == world.player.body[i].y
        ) {
          canvas.style.backgroundColor = 'red'; 
        }
      }

      world.player.body.push({
        x: world.player.position.x, 
        y: world.player.position.y
      });

      world.player.body = world.player.body.slice(
        world.player.body.length-world.player.maxLength, 
        world.player.body.length
      );

      world.keypressed = false; 
    }
}
window.addEventListener('keydown', handleKeys);

// game loop

const draw = () => {
  context.clearRect(0, 0, world.canvas.width, world.canvas.height);
  world.player.draw(world);
  requestAnimationFrame(draw);
}

draw(); 