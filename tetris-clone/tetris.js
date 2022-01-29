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
    let playing = true;
    let timestamp = 0;
    let ticker = 0; 

    const heap = {
      x: [0, 1, 2, 2],
      y: [0, 0, 0, 1]
    }

    const tetrimino = () => {
      console.log("generating tetrimino"); 
      const xmino = [
        [0,0,0,0],
        [0,1,1,2],
        [0,1,2,2],
        [0,0,1,2],
        [0,0,1,1]
      ];
      const ymino = [
        [0,1,2,3],
        [0,0,1,0],
        [0,0,0,1],
        [1,0,0,0],
        [1,0,1,0]
      ];
      const s = Math.floor(Math.random() * xmino.length); 
      const t = {
        x: xmino[s],
        y: ymino[s]
      }; 
      console.log(t);
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
          player.y = player.y - scale;
          ticker = ticker - scale;
          break;
        case "ArrowDown":
          player.y = player.y + scale;
          ticker = ticker + scale;
          break;
        case "ArrowLeft":
          if (player.x > 0) {
            player.x = player.x - scale;
          }
          break;
        case "ArrowRight":
          const boundary = player.x + player.t.x[player.t.x.length-1] * scale; 
          if (boundary < canvas.width - scale * 2) {
            player.x = player.x + scale;
          }
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
      const y = player.t.y;
      const x = player.t.x;
      const playerHeight = player.t.y[player.t.y.length-1] * scale;
      const playerOffsetY = playerHeight + player.y;
      const largestX = Utils.largest(x); 
      const largestY = Utils.largest(y); 
      console.log("X: ", largestX.value, y[largestX.index]); 
      console.log("Y: ", x[largestY.index], largestY.value); 
      console.log("...");
      if (playerOffsetY >= canvas.height) {
        for (let i = 0; i < player.t.x.length; i++) {
          const playerX = player.t.x[i];
          const playerY = player.t.x[i];
          for (let j = 0; j < heap.x.length; j++) {
            const heapX = heap.x[j];
            const heapY = heap.y[j];
          }
        }
        resetPlayerState(); 
      }
    }

    const updateHeap = () => {
      for(var i = 0; i < heap.x.length; i++) {
        const x = heap.x[i] * scale;
        const y = scale * (heap.y[i] + 1);
        pixel('orange', [x, canvas.height - y, scale, scale]);
      }
    }

    const updatePlayer = (now) => {
      checkCollision(); 

      // draw player
      for(var i = 0; i < player.t.x.length; i++) {
        const x = player.x + player.t.x[i] * scale;
        const y = (player.t.y[i] * scale) + ticker;
        player.y = y;
        pixel('blue', [x, y, scale, scale]); 
      }
    }

    const setWindowSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const paint = (now) => {
      requestAnimationFrame(paint);
      if (playing) {
        // if (now - timestamp < 1000 / fps) return; 
        context.clearRect(0, 0, canvas.width, canvas.height);
        updatePlayer();
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