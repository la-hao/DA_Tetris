// export const STAGE_WIDTH = 12;
// export const STAGE_HEIGHT = 20;
export const getHardLevelById = (levelId, customHardLevelList, basicHardLevelList) => {
  let result = null;
  let flag = false;
  basicHardLevelList.map((item) => {
    if (item.id === levelId) {
      result = item;
      flag = true;
    }
  });
  if (!flag) {
    customHardLevelList.map((item) => {
      if (item.id === levelId) {
        result = item;
      }
    })
  }
  return result;
};

export const basicHardLevelList = [
  {
    id: 4,
    name: "Easy Level",
    baseSpeed: 1000, //milisecond
    target: 1000,
    linePoints: [200, 400, 600],
    pointPerRow: [40, 50, 60, 80],
    upSpeed: 90 / 100
  },
  {
    id: 5,
    name: "Normal Level",
    baseSpeed: 800,
    target: 5000,
    linePoints: [1000, 2000, 3000],
    pointPerRow: [100, 120, 140, 160],
    upSpeed: 85 / 100
  },
  {
    id: 6,
    name: "Heavy Level",
    baseSpeed: 600,
    target: 10000,
    linePoints: [1000, 4000, 7000],
    pointPerRow: [200, 250, 300, 350],
    upSpeed: 80 / 100
  }
];

export const createStage = (width, height) =>
  Array.from(Array(height), () =>
    new Array(width).fill([0, 'clear']),
  );

export const checkCollision = (player, stage, { x: moveX, y: moveY }) => {
  for (let y = 0; y < player.tetromino.length; y += 1) {
    for (let x = 0; x < player.tetromino[y].length; x += 1) {
      // 1. Check that we're on an actual Tetromino cell
      if (player.tetromino[y][x] !== 0) {
        if (
          // 2. Check that our move is inside the game areas height (y)
          // We shouldn't go through the bottom of the play area
          !stage[y + player.pos.y + moveY] ||
          // 3. Check that our move is inside the game areas width (x)
          !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
          // 4. Check that the cell wer'e moving to isn't set to clear
          stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !==
          'clear'
        ) {
          return true;
        }
      }
    }
  }
};
