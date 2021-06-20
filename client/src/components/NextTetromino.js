import React from 'react';
import { creatNextTetrominoDisplay } from '../gameHelpers';
import Cell from './Cell';
import { StyledDisplay } from './styles/StyledDisplay';
import { StyledNextTetromino } from './styles/StyledNextTetromino';

const NextTetromino = (props) => {
    const stage = creatNextTetrominoDisplay(props.tetromino);

    return (
        <StyledDisplay className="justify-content-center">
            <StyledNextTetromino width={stage[0].length} height={stage.length}>
                {stage.map(row => row.map((cell, x) => <Cell key={x} type={cell[0]} />))}
            </StyledNextTetromino>
        </StyledDisplay>
    )
}

export default NextTetromino;