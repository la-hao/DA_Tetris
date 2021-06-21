import { useCallback, useRef, useState } from 'react';
import { checkCollision } from '../gameHelpers';
import { randomTetromino, TETROMINOS } from '../tetrominos';


export const usePlayer = (STAGE_WIDTH) => {

  const [nextTetromino, setNextTetromino] = useState(randomTetromino().shape);
  const presentTetromino = useRef(nextTetromino);
  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    nextTetromino: nextTetromino,
    collided: false,
  });

  const initPlayer = () => {
    setPlayer(
      {
        tetromino: TETROMINOS[0].shape,
        nextTetromino: nextTetromino,
        collided: false,
      }
    )
  }

  const rotate = (matrix, dir) => {
    // Make the rows to become cols (transpose)
    const rotatedTetro = matrix.map((_, index) =>
      matrix.map(col => col[index]),
    );
    // Reverse each row to get a rotated matrix
    if (dir > 0) return rotatedTetro.map(row => row.reverse());
    return rotatedTetro.reverse();
  };

  const playerRotate = (stage, dir) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino, -dir);
        clonedPlayer.pos.x = pos;
        return;
      }
    }
    setPlayer(clonedPlayer);
  };

  const updatePlayerPos = ({ x, y, collided }) => {
    setPlayer(prev => ({
      ...prev,
      pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
      collided,
    }));
  };

  const resetPlayer = useCallback(() => {
    const nextTetrominoValue = randomTetromino().shape;

    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: presentTetromino.current,
      nextTetromino: nextTetrominoValue,
      collided: false,
    });
    setNextTetromino(nextTetrominoValue);
    presentTetromino.current = nextTetrominoValue;
  }, [STAGE_WIDTH]);

  return [player, updatePlayerPos, resetPlayer, playerRotate, initPlayer];
};
