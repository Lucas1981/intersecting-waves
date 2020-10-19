(function() {
  'use strict';

  const	radToDeg = radians => radians * 180 / Math.PI;
  const degToRad = degrees => degrees * Math.PI / 180;
  const framesPerSecond = 50 / 1000;
  const width = 800;
  const height = 800;
  const canvas = document.getElementById('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const centerX = width / 2;
  const centerY = height / 2;
  const waves = [
    { x: centerX / 2, y: centerY / 2, r: 128, g: 128, b: 0, f: 10 },
    { x: centerX * 1.5, y: centerY / 2, r: 128, g: 0, b: 128, f: 20 },
    { x: centerX, y: centerY * 1.5, r: 0, g: 128, b: 128, f: 30 },
    // { x: centerX * 1.5, y: centerY / 2, r: 128, g: 0, b: 0, f: 11 }
  ];
  let shift = 0;
  let lastTime = new Date();

  const plotPixel = (x, y, { r, g, b } = { r: 0, g: 0, b: 0 }) => {
      const base = (x * 4) + (width * y * 4);
      data[base + 0] = r;
      data[base + 1] = g;
      data[base + 2] = b;
      data[base + 3] = 255;
  }

  const interpolatePixel = (x, y, { r, g, b }) => {
    const base = (x * 4) + (width * y * 4);
    data[base + 0] += r;
    data[base + 1] += g;
    data[base + 2] += b;
    data[base + 3] = 255;
  }

  const drawFrame = () => {
    ctx.putImageData(imageData, 0, 0);
  }

  const resetPlane = () => {
    for(let i = 0; i < width * height * 4; i += 4) {
      data[i + 0] = 128;
      data[i + 1] = 128;
      data[i + 2] = 128;
      data[i + 3] = 255;
    }
  }

  const main = () => {
    const now = new Date();
    const elapsedTime = now - lastTime;
    shift = (shift + framesPerSecond * elapsedTime) % 360;
    resetPlane();
    for (const wave of waves) {
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          const dx = i - wave.x;
          const dy = j - wave.y;
          const r = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
          const a = Math.sin(degToRad(shift + (r * wave.f)));
          interpolatePixel(i, j, {
            r: parseInt(wave.r * a),
            g: parseInt(wave.g * a),
            b: parseInt(wave.b * a)
          });
        }
      }
    }
    drawFrame();
    lastTime = now;
    window.requestAnimationFrame(main);
  }

  main();

})();
