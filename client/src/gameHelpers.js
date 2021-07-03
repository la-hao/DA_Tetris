// export const STAGE_WIDTH = 12;

import { randomTetromino } from "./tetrominos";

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

export const onlineHardLevel = {
  baseSpeed: 800, //milisecond
  timeLines: [60, 120, 150, 200, 240, 280, 320, 380, 420],
  pointPerRow: [30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130],
  upSpeed: 85 / 100
}

export const basicHardLevelList = [
  {
    id: 4,
    name: "Easy Level",
    baseSpeed: 1000, //milisecond
    target: 1000,
    timeLines: [60, 120, 150, 200],
    pointPerRow: [20, 40, 60, 80, 100],
    upSpeed: 85 / 100
  },
  {
    id: 5,
    name: "Normal Level",
    baseSpeed: 800,
    target: 5000,
    timeLines: [60, 120, 150, 200],
    pointPerRow: [40, 60, 80, 100, 120],
    upSpeed: 85 / 100
  },
  {
    id: 6,
    name: "Heavy Level",
    baseSpeed: 600,
    target: 10000,
    timeLines: [60, 120, 150, 200],
    pointPerRow: [80, 120, 140, 160, 200],
    upSpeed: 85 / 100
  }
];

// const randomCellInStage = (width, height, rowNumber) => {
//   let stage = createStage(width, height);

//   for (let i = height - 1 - rowNumber; i <= height - 1; i++) {
//     for (let j = 0; j < width; j++) {
//       const tetromino = randomTetromino().shape;
//       stage[i][j] = [tetromino[1][0], 'clear'];
//     }
//   }
//   console.log("stageCell", stage)
//   return stage;
// }

export const createStage = (width, height) =>
  Array.from(Array(height), () =>
    new Array(width).fill([0, 'clear']),
  );

// export const createStageHardLevel = (width, height, hardLevelId) => {
//   let stage;
//   console.log("hard Id", hardLevelId);
//   switch (hardLevelId) {
//     case 4://Normal
//       stage = randomCellInStage(width, height, 2);
//       break;
//     case 5:
//       stage = randomCellInStage(width, height, 4);
//       break;
//     default:
//       stage = createStage(width, height);
//       break;
//   }
//   console.log("Stage Helper", stage);
//   return stage;
// }

export const creatNextTetrominoDisplay = (tetromino) => {

  let stage = createStage(tetromino.length, tetromino[0].length);

  for (let i = 0; i < tetromino.length; i++) {
    for (let j = 0; j < tetromino[0].length; j++) {
      stage[i][j] = [tetromino[i][j], 'clear'];
    }
  }

  return stage;
}

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
