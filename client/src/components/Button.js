import React from 'react';
import { StyledButton } from './styles/StyledStartButton';

const Button = ({ callback, text, isPlaying }) => (
  <StyledButton onClick={callback} onKeyUp={e => e.preventDefault()} isPlaying={isPlaying}>{text}</StyledButton>
)

export default Button;