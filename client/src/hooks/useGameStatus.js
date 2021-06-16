import { useState, useEffect, useCallback } from 'react';

export const useGameStatus = (rowsCleared, presentHardLevel) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(0);

  const pointPerRow = presentHardLevel.pointPerRow;

  const calcScore = useCallback(() => {
    // We have score
    if (rowsCleared > 0) {
      // This is how original Tetris score is calculated
      setScore(prev => prev + pointPerRow[level] * rowsCleared);
    }
  }, [level, rowsCleared, pointPerRow]);

  useEffect(() => {
    calcScore();
  }, [calcScore, rowsCleared, score]);

  return [score, setScore, level, setLevel];
};
