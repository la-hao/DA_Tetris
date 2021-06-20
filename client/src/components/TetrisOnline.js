import { message } from 'antd';
import axios from 'axios';
import { React, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL, STAGE_HEIGHT, STAGE_WIDTH } from '../constants';
import { checkCollision, createStage, onlineHardLevel } from '../gameHelpers';
import { useGameStatus } from '../hooks/useGameStatus';
// Custom Hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import Button from './Button';
import DisabledProfile from './collectionsPage/DisabledProfile';
import LoginPage from './collectionsPage/LoginPage';
import ProfileMenu from './collectionsPage/ProfileMenu';
import RankBoard from './collectionsPage/RankBoard';
import Display from './Display';
import NextTetromino from './NextTetromino';
// Components
import Stage from './Stage';
import { StyledTetris, StyledTetrisWrapper } from './styles/StyledTetris';


const TetrisOnline = () => {
    //Set game
    const stageHeight = STAGE_HEIGHT;
    const stageWidth = STAGE_WIDTH;
    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer(stageWidth);
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer, stageWidth, stageHeight);

    //Init game
    const [isFirsttime, setIsFirsttime] = useState(true);
    const [presentHardLevel, setPresentHardLevel] = useState(onlineHardLevel);
    const [score, setScore, level, setLevel] = useGameStatus(
        rowsCleared, presentHardLevel);

    //User
    const localUser = localStorage.getItem('user') ?
        JSON.parse(localStorage.getItem('user')) : null;
    const [user, setUser] = useState(localUser);

    //Down Speed
    const [dropTime, setDropTime] = useState(null);
    const [currentDropTime, setCurrentDropTime] = useState(presentHardLevel.baseSpeed);
    const [scoreSub, setScoreSub] = useState(200);
    const passedSecond = useRef(0);
    const downSpeedNum = useRef(0);

    //Game status
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    console.log('re-render');

    useEffect(() => {
        const interval = setInterval(() => {
            if (isPlaying) {
                passedSecond.current += 1;
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isPlaying, setIsPlaying]);

    useEffect(() => {
        if (isFirsttime) {
            setIsFirsttime(false);
        }
        else {
            startGame();
        }
    }, [stageWidth, stageHeight, presentHardLevel, setPresentHardLevel]);

    const movePlayer = dir => {
        if (!checkCollision(player, stage, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0 });
        }
    };

    const startGame = () => {
        // Reset everything
        setStage(createStage(stageWidth, stageHeight));

        //Droptime
        setDropTime(presentHardLevel.baseSpeed);
        setCurrentDropTime(presentHardLevel.baseSpeed)

        //Status
        resetPlayer();
        setScore(0);
        setScoreSub(200);
        setLevel(0);
        setGameOver(false);
        setIsPlaying(true);

        //DownSpeed
        passedSecond.current = 0;
        downSpeedNum.current = 0;
    };

    const drop = () => {
        // Increase level when player has cleared 10 rows
        if (passedSecond.current > presentHardLevel.timeLines[level] && level < presentHardLevel.timeLines.length) {
            setLevel(prev => prev + 1);
            // Also increase speed
            setDropTime(currentDropTime * presentHardLevel.upSpeed);
            setCurrentDropTime(currentDropTime * presentHardLevel.upSpeed);
        }

        if (!checkCollision(player, stage, { x: 0, y: 1 })) {
            updatePlayerPos({ x: 0, y: 1, collided: false });
        } else {
            // Game over!
            if (player.pos.y < 1) {
                console.log('GAME OVER!!!');
                setGameOver(true);
                setIsPlaying(false);
                setDropTime(null);
                saveHistory(user._id, score);
            }
            updatePlayerPos({ x: 0, y: 0, collided: true });
        }
    };

    const dropPlayer = () => {
        // We don't need to run the interval when we use the arrow down to
        // move the tetromino downwards. So deactivate it for now.
        setDropTime(null);
        drop();
    };

    // This one starts the game
    // Custom hook by Dan Abramov
    useInterval(() => {
        drop();
    }, dropTime);

    const downSpeed = () => {

        if (score >= scoreSub && downSpeedNum.current <= 2) {
            setScore(score - scoreSub);
            const newCurrentDropTime = currentDropTime * 1.15;
            setCurrentDropTime(newCurrentDropTime);//tang 15%
            setDropTime(newCurrentDropTime);
            setScoreSub(scoreSub + 200);
            downSpeedNum.current += 1;
            message.success("Down speed succesfully !", 3);
            return;
        }

        if (downSpeedNum.current > 2) {
            message.warning("You only Down speed 3 times", 3);
            return;
        }

        if (score < scoreSub && downSpeedNum.current <= 2) {
            message.warning(`You need ${scoreSub} points to Down speed`, 3);
        }
    }

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
            else if (keyCode === 71) {//G: Giam speed
                downSpeed();
            }//test
            // else if (keyCode === 32) {//Tang score
            //     setScore(score + 200);
            // }
            // else if (keyCode == 84) {
            //     passedSecond.current += 60;
            // }
        }
    };

    const keyUp = ({ keyCode }) => {
        if (!gameOver) {
            // Activate the interval again when user releases down arrow.
            if (keyCode === 40) {
                setDropTime(currentDropTime);
            }
        }
    };

    const onSuccess = (user) => {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
    }

    const pauseGame = () => {
        setDropTime(null);
        setIsPaused(true);
        setIsPlaying(false);
        message.info("Game is paused");
    }

    const resumeGame = () => {
        setDropTime(currentDropTime);
        setIsPaused(false);
        setIsPlaying(true);
    }

    const handleLogOut = () => {
        setUser(null);
        localStorage.removeItem('user');
    }

    const saveHistory = (userId, score) => {
        axios.post(`${BASE_URL}/user/${userId}/history/add`, { score: score })
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }

    return (
        <StyledTetrisWrapper
            role="button"
            tabIndex="0"
            onKeyDown={e => move(e)}
            onKeyUp={keyUp}
        >
            <StyledTetris>
                <aside>
                    {user ?
                        <ProfileMenu
                            userId={user._id}
                            onLogOut={() => handleLogOut()}
                            username={user.username}
                        />
                        :
                        <DisabledProfile />
                    }
                    <RankBoard gameOver={gameOver} />
                </aside>
                <Stage stage={stage} />
                <aside>
                    {gameOver ?
                        <>
                            <Display gameOver={gameOver} text="Game Over" />
                            <Display gameOver={gameOver} text={`Score: ${score}`} />

                        </>
                        :
                        <div>
                            <NextTetromino tetromino={player.nextTetromino} />
                            <Display text={`Score: ${score}`} />
                            <Display text={`Level: ${level + 1}`} />
                        </div>
                    }
                    <Link to="/normal">
                        <Button text="TO NORMAL" />
                    </Link>
                    {
                        user ?
                            <>
                                {isPlaying ?
                                    <Button callback={pauseGame} text="Pause Game" isPlaying={true} /> :
                                    isPaused ?
                                        <Button callback={resumeGame} text="Resume" /> :
                                        <Button callback={startGame} text="Start Game" />
                                }
                            </>
                            : <LoginPage callback={onSuccess} />
                    }
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    );
};

export default TetrisOnline;
