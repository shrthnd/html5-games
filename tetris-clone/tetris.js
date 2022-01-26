const Tetris = () => {
    const body = document.body; 
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d'); 
    const fps = 1000;
    const scale = 20; 
    let timestamp = 0;
    let ticker = 0; 

    const heap = {
      x: [0, 1],
      y: [0, 1]
    }
    
    const tetrimino = {
      x: [0, 0, 0, 1],
      y: [0, 1, 2, 2]
    }

    const player = {
      x: 0,
      y: 0,
      t: tetrimino
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
          if (boundary < canvas.width - (scale * 2) ) {
            player.x = player.x + scale;
          }
          break; 
        default:
          break;
      }
    }

    const pixel = (color, position) => {
      context.fillStyle = color; 
      context.fillRect(position[0], position[1], position[2], position[3]);
    }

        
    const resetPlayerState = () => {
      player.y = 0;
      player.x = 0;
      player.t = tetrimino; 
      ticker = 0; 
    }
    
    const checkCollision = () => {
      const heapHeight = heap.y[heap.y.length-1] * scale;
      const heapOffsetY = canvas.height - heapHeight; 
      const playerHeight = player.t.y[player.t.y.length-1] * scale;
      const playerOffsetY = playerHeight + player.y; 
      
      if (playerOffsetY >= heapOffsetY) {
        console.log("collision!");
      }
        
      if (playerOffsetY >= canvas.height) {
        console.log("collision with floor!");
        // heap.x.push(player.t.x); 
        // heap.y.push(player.t.y); 
        // console.log(heap);
        resetPlayerState(); 
      }
    }

    const updateHeap = () => {
      for(var i = 0; i < heap.x.length; i++) {
        // console.log(i, heap.x[i]);
        const x = heap.x[i] * scale;
        const y = canvas.height - scale;
        pixel('orange', [x, y, scale, scale]);
      }
    }

    const updatePlayer = () => {
      for(var i = 0; i < player.t.x.length; i++) {
        const x = player.x + player.t.x[i] * scale;
        const y = (player.t.y[i] * scale) + ticker;
        player.y = y;
        pixel('blue', [x, y, scale, scale]); 
      }
      checkCollision(); 
    }

    const setWindowSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const init = () => {
      setWindowSize();
      window.addEventListener('keydown', handleControls); 
      window.addEventListener('resize', setWindowSize);
      body.style = "overflow: hidden;";
      body.append(canvas);
      paint(); 
    }

    const paint = (now) => {
      requestAnimationFrame(paint);
      // if (now - timestamp < 2000 / fps) return; 
      context.clearRect(0, 0, canvas.width, canvas.height);
      updatePlayer();
      updateHeap();
      ticker += 1;
      // timestamp = now;
    }
 
    init(); 
}
Tetris(); 