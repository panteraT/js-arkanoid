import confetti from "canvas-confetti";

let myConfetti, confettiInterval;

export function random(min, max) {
  return Math.random() * (max - min + 1) + min;
}

export function createConfetti(canvas, isWin) {
  myConfetti = confetti.create(canvas, {
    resize: true,
  });
  
  confettiInterval = setInterval(function(){
    myConfetti(returnParams(isWin))}, 1000)
}

export function clearConfetti() {
  clearInterval(confettiInterval);
  myConfetti.reset();
}

function returnParams(isWin) {
  if (isWin) {
    return {
      colors: ['#dd00a6', '#c1329d', '#6e0854'],
      particleCount: 500,
      startVelocity: 30,
      spread: 360,
    }
  } else {
    let scalar = 2;
    let drops = confetti.shapeFromText({ text: '💧', scalar});
    return {
      shapes: [drops],
      scalar,
      angle: random(55, 125),
      spread: random(40, 90),
      particleCount: 300,
      origin: { y: 0 },
    }
  }
}