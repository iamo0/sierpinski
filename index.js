function rotate(x, y, cx, cy, angle) {
  const radius = Math.sqrt(
    Math.pow(x - cx, 2) + Math.pow(y - cy, 2)
  );

  const currentAngle = Math.atan2(y - cy, x - cx);

  const angleRadians = angle * (Math.PI / 180);
  const newAngle = currentAngle + angleRadians;

  const newX = cx + radius * Math.cos(newAngle);
  const newY = cy + radius * Math.sin(newAngle);

  return [newX, newY];
}

function getCenter(x1, y1, x2, y2) {
  return [
    x1 + (x2 - x1) / 2,
    y1 + (y2 - y1) / 2,
  ];
}

function getPolygon(width, height, vertices) {
  const result = [
    [width / 2, 0],
  ];

  while (result.length < vertices) {
    result.push(
      rotate(result.slice(-1)[0][0], result.slice(-1)[0][1], width / 2, height / 2, 360 / vertices)
    );
  }

  return result;
}

function connectPoints(points, ctx, strokeStyle = "black") {
  const pointsLeft = [...points];

  ctx.save(); {
    ctx.beginPath(); {
      ctx.moveTo(...pointsLeft.shift());

      let nextPoint;
      while ((nextPoint = pointsLeft.shift())) {
        ctx.lineTo(...nextPoint);
      }
    }
    ctx.closePath();

    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
  }
  ctx.restore();
}

function drawADot(x, y, ctx, fillStyle = "black") {
  ctx.save(); {
    ctx.fillStyle = fillStyle;
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.restore();
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

(() => {
  const FPS = 60;

  const container = document.querySelector("canvas");
  const ctx = container.getContext("2d");
  const size = [
    parseFloat(container.width), parseFloat(container.height)
  ];

  const renderedPoints = [];
  const maxRenderedPoints = 10240;

  const polygon = getPolygon(size[0], size[1], 3);
  // NB! Not a truly random point
  let lastPoint = [100, 100];

  setInterval(() => {
    const vertice = getRandom(1, 3) - 1;
    const newPoint = getCenter(...lastPoint, ...polygon[vertice]);
    renderedPoints.push(newPoint);

    ctx.clearRect(0, 0, size[0], size[1]); {
      connectPoints(polygon, ctx, "rgba(255, 255, 255, 0.15)");
      const pointsToRender = renderedPoints.slice(-1 * maxRenderedPoints);

      for (let i = 0; i < renderedPoints.length; i++) {
        const point = renderedPoints[i];
        const percent = i / pointsToRender.length;
        drawADot(...point, ctx, `hsla(28, ${parseInt(percent * 100)}%, 50%, ${(percent).toFixed(2)})`);
      }
    }

    lastPoint = [...newPoint];
  }, 1000 / FPS);
})();
