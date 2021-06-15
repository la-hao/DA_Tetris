import styled from 'styled-components';

export const StyledStage = styled.div`
  display: grid;
  grid-template-rows: repeat(
    ${props => props.height},
    calc(calc(500vw/${props => props.height}) /12)
  );
  grid-template-columns: repeat(${props => props.width}, 1fr);
  grid-gap: 1px;
  border: 2px solid #333;
  width: 100%;
  max-width: calc(calc(calc(500vw/${props => props.height})*${props => props.width})/12);
  background: #111;
`;