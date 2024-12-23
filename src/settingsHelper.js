export const gameSettings = {
  currentLevel: 1,
  gameOver: false,
  score: 0,
  levels: [
    {
      level: 1,
      isWin: false,
      hasBarrier: false,
      barrierSize: 0,
      bricksSettings: {
        brickRowCount: 2,
        brickColumnCount: 3,
        brickWidth: 110,
        brickHeight: 20,
        brickPadding: 20,
        brickOffsetTop: 30,
        brickOffsetLeft: 50,
      }
    },
    {
      level: 2,
      isWin: false,
      hasBarrier: false,
      barrierSize: 0,
      bricksSettings: {
        brickRowCount: 3,
        brickColumnCount: 5,
        brickWidth: 80,
        brickHeight: 20,
        brickPadding: 10,
        brickOffsetTop: 30,
        brickOffsetLeft: 20,
      },
    },
    {
      level: 3,
      isWin: false,
      hasBarrier: false,
      barrierSize: 0,
      bricksSettings: {
        brickRowCount: 3,
        brickColumnCount: 7,
        brickWidth: 53,
        brickHeight: 20,
        brickPadding: 10,
        brickOffsetTop: 30,
        brickOffsetLeft: 20,
      },
    },
    {
      level: 4,
      isWin: false,
      hasBarrier: true,
      barrierSize: 5,
      bricksSettings: {
        brickRowCount: 2,
        brickColumnCount: 3,
        brickWidth: 110,
        brickHeight: 20,
        brickPadding: 20,
        brickOffsetTop: 30,
        brickOffsetLeft: 50,
      }
    },
    {
      level: 5,
      isWin: false,
      hasBarrier: true,
      barrierSize: 5,
      bricksSettings: {
        brickRowCount: 3,
        brickColumnCount: 5,
        brickWidth: 80,
        brickHeight: 20,
        brickPadding: 10,
        brickOffsetTop: 30,
        brickOffsetLeft: 20,
      },
    },
    {
      level: 6,
      isWin: false,
      hasBarrier: true,
      barrierSize: 5,
      bricksSettings: {
        brickRowCount: 3,
        brickColumnCount: 7,
        brickWidth: 53,
        brickHeight: 20,
        brickPadding: 10,
        brickOffsetTop: 30,
        brickOffsetLeft: 20,
      },
    }
  ]
}


export const colors = {
  main: '#0095DD',
  barrier: '#636163'

}

export function defaultBall(width, height)  {
  return {
    x: width / 2,
    y: height / 2,
    ballRadius: 10,
    dx: 2,
    dy: -2,
  }
}


export function getBricks() {
  let settings = gameSettings.levels[gameSettings.currentLevel - 1].bricksSettings;
  let bricks = [];
  for (let c = 0; c < settings.brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < settings.brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
  return bricks;
}

export function getBrickRowCount() {
  return gameSettings.levels[gameSettings.currentLevel - 1].bricksSettings.brickRowCount;
}

export function getBrickColumnCount() {
  return gameSettings.levels[gameSettings.currentLevel - 1].bricksSettings.brickColumnCount;
}

export function getBrickWidth() {
  return gameSettings.levels[gameSettings.currentLevel - 1].bricksSettings.brickWidth;
}

export function getBrickHeight() {
  return gameSettings.levels[gameSettings.currentLevel - 1].bricksSettings.brickHeight;
}

export function getBrickPadding() {
  return gameSettings.levels[gameSettings.currentLevel - 1].bricksSettings.brickPadding;
}

export function getBrickOffsetTop() {
  return gameSettings.levels[gameSettings.currentLevel - 1].bricksSettings.brickOffsetTop;
}

export function getBrickOffsetLeft() {
  return gameSettings.levels[gameSettings.currentLevel - 1].bricksSettings.brickOffsetLeft;
}

export function getBrickBarrierSize() {
  return gameSettings.levels[gameSettings.currentLevel - 1].barrierSize;
}

export function getCurrentLevelSettings() {
  return gameSettings.levels[gameSettings.currentLevel - 1];
}