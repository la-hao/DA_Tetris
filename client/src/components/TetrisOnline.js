import React, { useEffect, useState } from 'react';

import { createStage, checkCollision, basicHardLevelList, getHardLevelById } from '../gameHelpers';
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

// Custom Hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';

// Components
import Stage from './Stage';
import Display from './Display';
import Button from './Button';
import LoginPage from './collectionsPage/LoginPage';
import OptionOnlinePage from './collectionsPage/OptionOnlinePage';
import ProfileMenu from './collectionsPage/ProfileMenu';
import DisabledProfile from './collectionsPage/DisabledProfile';
import RankBoard from './collectionsPage/RankBoard';
const TetrisOnline = () => {
    const localStageWidth = parseInt(localStorage.getItem('stageWidth')) || 12;
    const localStageHeight = parseInt(localStorage.getItem('stageHeight')) || 20;
    const [stageWidth, setstageWidth] = useState(localStageWidth);
    const [stageHeight, setstageHeight] = useState(localStageHeight);

    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer(stageWidth);
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer, stageWidth, stageHeight);

    const [isFirsttime, setIsFirsttime] = useState(true);

    const localPresentHardLevel = localStorage.getItem('presentHardLevel') ?
        JSON.parse(localStorage.getItem('presentHardLevel')) : basicHardLevelList[0];
    const [presentHardLevel, setPresentHardLevel] = useState(localPresentHardLevel);

    const localCustomHardLevelList = localStorage.getItem('customHardLevelList') ?
        JSON.parse(localStorage.getItem('customHardLevelList')) : [];
    const [customHardLevelList, setCustomHardLevelList] = useState(localCustomHardLevelList);

    const [score, setScore, level, setLevel] = useGameStatus(
        rowsCleared, presentHardLevel);

    const localUser = localStorage.getItem('user') ?
        JSON.parse(localStorage.getItem('user')) : null;
    const [user, setUser] = useState(localUser);
    console.log('user: ', user);
    console.log('re-render');

    useEffect(() => {
        if (isFirsttime) {
            setIsFirsttime(false);
        }
        else {
            startGame();
        }
    }, [stageWidth, stageHeight, presentHardLevel, setPresentHardLevel, customHardLevelList, setCustomHardLevelList]);

    //Change Size Stage
    const changeOptions = async (width, height) => {
        setstageWidth(width);
        setstageHeight(height);

        localStorage.setItem('stageWidth', width);
        localStorage.setItem('stageHeight', height);
    }

    const movePlayer = dir => {
        if (!checkCollision(player, stage, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0 });
        }
    };

    const startGame = () => {
        // Reset everything
        setStage(createStage(stageWidth, stageHeight));
        setDropTime(presentHardLevel.baseSpeed);
        resetPlayer();
        setScore(0);
        setLevel(0);
        setGameOver(false);
    };

    const drop = () => {
        // Increase level when player has cleared 10 rows
        if (score >= presentHardLevel.linePoints[level] && level < presentHardLevel.linePoints.length) {
            setLevel(prev => prev + 1);
            // Also increase speed
            setDropTime(presentHardLevel.baseSpeed * Math.pow(presentHardLevel.upSpeed, level));
        }

        if (!checkCollision(player, stage, { x: 0, y: 1 })) {
            updatePlayerPos({ x: 0, y: 1, collided: false });
        } else {
            // Game over!
            if (player.pos.y < 1) {
                console.log('GAME OVER!!!');
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({ x: 0, y: 0, collided: true });
        }
    };

    const dropPlayer = () => {
        // We don't need to run the interval when we use the arrow down to
        // move the tetromino downwards. So deactivate it for now.
        //setDropTime(null);
        drop();
    };

    // This one starts the game
    // Custom hook by Dan Abramov
    useInterval(() => {
        drop();
    }, dropTime);

    const move = ({ keyCode }) => {
        if (!gameOver) {
            if (keyCode === 37) {
                movePlayer(-1);
            } else if (keyCode === 39) {
                movePlayer(1);
            } else if (keyCode === 40) {
                dropPlayer();
            } else if (keyCode === 38) {
                playerRotate(stage, 1);
            }
        }
    };

    const onSuccess = (user) => {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('getUser from login', user);
    }

    const handleLogOut = () => {
        setUser(null);
        localStorage.removeItem('user');
    }

    return (
        <StyledTetrisWrapper
            role="button"
            tabIndex="0"
            onKeyDown={e => move(e)}
        //onKeyUp={keyUp}
        >
            <StyledTetris>
                <aside>
                    {user ?
                        <ProfileMenu
                            userId={user._id}
                            onLogOut={() => handleLogOut()}
                            username={user.username}
                        />
                        : <DisabledProfile />
                    }
                    <RankBoard gameOver={gameOver} />
                </aside>
                <Stage stage={stage} />
                <aside>
                    {gameOver ? (
                        <Display gameOver={gameOver} text="Game Over" />
                    ) : (
                        <div>
                            <Display text={`Target: ${presentHardLevel.target}`} />
                            <Display text={`Score: ${score}`} />
                            <Display text={`Level: ${level + 1}`} />
                        </div>
                    )}
                    <OptionOnlinePage stageWidth={stageWidth} stageHeight={stageHeight} onOK={changeOptions}
                    />
                    {/* <HistoryListPage userId={user._id} /> */}
                    {
                        user ?
                            <>
                                <Button callback={startGame} text="Start Game" />
                            </> :
                            <LoginPage callback={onSuccess} />
                    }

                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    );
};

export default TetrisOnline;
