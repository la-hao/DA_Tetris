import React from 'react';
import { StyledDisplay } from './styles/StyledDisplay';

const Display = ({ gameOver, text, isWin }) => (
  <StyledDisplay gameOver={gameOver} isWin={isWin}>{text}</StyledDisplay>
)

export default Display;