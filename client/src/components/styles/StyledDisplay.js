import styled from 'styled-components';

export const StyledDisplay = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center; 
  margin: 0 0 1.6vw 0;
  padding: 16px;
  border: 4px solid #333;
  min-height: 30px;
  max-height: 6vw;
  width: 100%;
  border-radius: 20px;
  color: ${props => (props.gameOver ? props.isWin ? 'green' : 'red' : '#999')};
  background: #000;
  font-family: Pixel, Arial, Helvetica, sans-serif;
  font-size: 0.8rem;
`;