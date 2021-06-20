import styled from 'styled-components';

export const StyledNextTetromino = styled.div`
  display: grid;
  grid-template-rows: repeat(
    ${props => props.height},
    calc(calc(60vw/${props => props.height}) /12)
  );
  grid-template-columns: repeat(${props => props.width}, 1fr);
  grid-gap: 1px;
  
  border: 0px solid #333;
  width: 100%;
  max-width: calc(calc(calc(60vw/${props => props.height})*${props => props.width})/12);
  background: #000;
`;