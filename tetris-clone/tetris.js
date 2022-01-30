const Utils = {
  largest: (array) => {
    let max = { index: 0, value: array[0] };
    for (let index = 0; index < array.length; index++) {
      const value = array[index];  
      if (value > max.value) {
        max = { index, value };
      }
    }
    return max; 
  }
}

const Tetris = () => {
    const body = document.body; 
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d'); 
    const fps = 60;
    const scale = 20; 
    let MAX_HEIGHT = Math.floor(window.innerHeight / scale);
    let MAX_WIDTH = Math.floor(window.innerHeight / scale);

    let playing = true;
    let timestamp = 0;
    let ticker = 0; 

    const heap = {
      x: [0, 1, 2, 2],
      y: [0, 0, 0, 1]
    }

    const tetrimino = () => {
      const xymino = [
        {
          x: [0,0,0,0],
          y: [0,1,2,3]
        },
        {
          x: [0,1,1,2],
          y: [0,0,1,0],
        },
        {
          x: [0,1,2,2],
          y: [0,0,0,1],
        },
        {
          x: [0,0,1,2],
          y: [1,0,0,0],
        }, 
      ]

      const s = Math.floor(Math.random() * xymino.length); 
      const t = {
        x: xymino[s].x,
        y: xymino[s].y
      }; 

      return t; 
    }

    const player = {
      x: 0,
      y: 0,
      t: tetrimino()
    }

    const pixel = (color, position) => {
      context.fillStyle = color; 
      context.fillRect(position[0], position[1], position[2], position[3]);
    }
    
    const handleControls = (e) => {
      switch(e.key) {
        case "ArrowUp": 
          if (player.y > 0) {
            player.y--;
          }
          break;
        case "ArrowDown":
          player.y++;
          break;
        case "ArrowLeft":
          if (player.x > 0) {
            player.x--;
          }
          break;
        case "ArrowRight":
          // const boundary = player.x - 1 - Utils.largest(player.t.x).value; 
          // if (boundary < MAX_WIDTH + 1) {
            player.x++;
          // }
          break;
        case "P":
        case "p":
          // set play/pause
          playing = !playing; 
          break;
        case "R":
        case "r":
          resetPlayerState();
          context.clearRect(0, 0, canvas.width, canvas.height);
          updatePlayer();  
          updateHeap();
          break;
        default:
          break;
      }
    }
        
    const resetPlayerState = () => {
      player.y = 0;
      player.x = 0;
      player.t = tetrimino(); 
      ticker = 0;
    }
    
    const checkCollision = () => {
      const py = player.t.y; // vertical player coords
      const px = player.t.x; // horizontal player coords
      const ph = Utils.largest(py); // max player height

      const hy = heap.y; // vertical heap coords
      const hx = heap.x; // horizontal heap coords
      const hh = Utils.largest(hy); // max heap height

      // if max player height + player Y position is GTE max height of world...
      const bottomCollision = ph.value + player.y >= MAX_HEIGHT;
      
      // if max player height + next player Y position is GTE max height of world - max heap height...
      const rowCollision = ph.value + player.y + 1 >= MAX_HEIGHT - hh.value;

      let collision = bottomCollision;

      // if player has collided with row space
      // check if any player cells intersect with heap
      if (rowCollision) {
        for (let p = 0; p < px.length; p++) {
          if (collision) {
            continue;
          }

          const pxx = px[p] + player.x;
          const pyy = py[p] + player.y + 1;
          
          for (let h = 0; h < hx.length; h++) {
            const hxx = hx[h];
            const hyy = MAX_HEIGHT - hy[h];

            if (pxx == hxx && pyy == hyy) {
              collision = true; 
              continue; 
            }
          }
        }
      }

      if (collision) {
        for(var p = 0; p < px.length; p++) {
          hx.push(player.x + px[p]);
          hy.push(MAX_HEIGHT - player.y - py[p]);            
        }
        resetPlayerState(); 
      }
    }

    const updateHeap = () => {
      for(var i = 0; i < heap.x.length; i++) {
        const x = heap.x[i] * scale;
        const y = scale * (heap.y[i] + 1);
        pixel('orange', [x, MAX_HEIGHT * scale - y, scale, scale]);
      }
    }

    const updatePlayer = (now) => {
      checkCollision(); 
      const playerPositionX = player.x*scale; 
      const playerPositionY = player.y*scale; 
      
      // draw player
      for(var i = 0; i < player.t.x.length; i++) {  
        const blockWidth = player.t.x[i] * scale;
        const blockHeight = player.t.y[i] * scale; 
        const x = playerPositionX + blockWidth;
        const y = playerPositionY + blockHeight;
        pixel('blue', [x, y, scale, scale]);  
      }

      if (ticker > 15) {
        player.y++;
        ticker = 0; 
      }
    }

    const setWindowSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      MAX_HEIGHT = Math.floor(window.innerHeight / scale);
      MAX_WIDTH = Math.floor(window.innerHeight / scale);
    }

    const paint = (now) => {
      requestAnimationFrame(paint);
      if (playing) {
        // if (now - timestamp < 1000 / fps) return; 
        context.clearRect(0, 0, canvas.width, canvas.height);
        updatePlayer(now);
        updateHeap();
        ticker += 1;
        // timestamp = now;
      }
    }
    
    const init = () => {
      setWindowSize();
      window.addEventListener('keydown', handleControls); 
      window.addEventListener('resize', setWindowSize);
      body.style.overflow = "hidden";
      canvas.style.backgroundColor = "#f5f5f5";
      body.append(canvas);
      paint();
    }
 
    init(); 
}
Tetris(); 