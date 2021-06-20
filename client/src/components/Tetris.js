import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { basicHardLevelList, checkCollision, createStage, getHardLevelById } from '../gameHelpers';
import { useGameStatus } from '../hooks/useGameStatus';
// Custom Hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import Button from './Button';
import Display from './Display';
import NextTetromino from './NextTetromino';
import OptionPage from './OptionPage';
// Components
import Stage from './Stage';
import { StyledTetris, StyledTetrisWrapper } from './styles/StyledTetris';

const Tetris = () => {
  //Init Stage Size
  const localStageWidth = parseInt(localStorage.getItem('stageWidth')) || 12;
  const localStageHeight = parseInt(localStorage.getItem('stageHeight')) || 20;
  const [stageWidth, setstageWidth] = useState(localStageWidth);
  const [stageHeight, setstageHeight] = useState(localStageHeight);

  //Init game
  const [dropTime, setDropTime] = useState(null);
  const [isFirsttime, setIsFirsttime] = useState(true);
  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer(stageWidth);
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer, stageWidth, stageHeight);


  //Init hard levels
  const localPresentHardLevel = localStorage.getItem('presentHardLevel') ?
    JSON.parse(localStorage.getItem('presentHardLevel')) : basicHardLevelList[0];
  const [presentHardLevel, setPresentHardLevel] = useState(localPresentHardLevel);

  const localCustomHardLevelList = localStorage.getItem('customHardLevelList') ?
    JSON.parse(localStorage.getItem('customHardLevelList')) : [];
  const [customHardLevelList, setCustomHardLevelList] = useState(localCustomHardLevelList);

  // Score
  const [score, setScore, level, setLevel] = useGameStatus(rowsCleared, presentHardLevel);
  const [currentDropTime, setCurrentDropTime] = useState(presentHardLevel.baseSpeed);
  const [scoreSub, setScoreSub] = useState(200);

  //Game status
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isWin, setIsWin] = useState(false);

  //Down Speed
  const passedSecond = useRef(0);
  const downSpeedNum = useRef(0);
  console.log('re-render');

  useEffect(() => {
    if (isFirsttime) {
      setIsFirsttime(false);
    }
    else {
      startGame();
    }
  }, [stageWidth, stageHeight, presentHardLevel, setPresentHardLevel, customHardLevelList, setCustomHardLevelList]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        passedSecond.current += 1;
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, setIsPlaying]);

  //Change Size Stage
  const changeOptions = async (width, height, hardLevelId, newCustomHardLevelList) => {
    //Set and save size
    setstageWidth(width);
    setstageHeight(height);
    localStorage.setItem('stageWidth', width);
    localStorage.setItem('stageHeight', height);

    if (newCustomHardLevelList) {//Save hard level to local Storage
      setCustomHardLevelList(newCustomHardLevelList);
      localStorage.setItem('customHardLevelList', JSON.stringify(newCustomHardLevelList));
    }

    //Get hardlevel from hard level lists
    const hardLevel = await getHardLevelById(hardLevelId, newCustomHardLevelList, basicHardLevelList);
    if (hardLevel) {
      localStorage.setItem('presentHardLevel', JSON.stringify(hardLevel));
      setPresentHardLevel(hardLevel);
    }
    //test
    console.log("hard:", hardLevel);
  }

  const movePlayer = dir => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
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
    setIsWin(false);

    //DownSpeed
    passedSecond.current = 0;
    downSpeedNum.current = 0;
  };

  const handleWin = () => {
    message.success({
      content: 'Congratulation! You win !',
      className: 'custom-class',
      style: {
        marginTop: '20vh',
      },
    });
    setDropTime(null);
    setIsWin(true);
    setGameOver(true);
    setIsPlaying(false);
  }

  const drop = () => {
    if (score >= presentHardLevel.target) {
      handleWin();
    }
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
    if (!gameOver && !isPaused) {
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
      //   setScore(score + 200);
      // }
      // else if (keyCode == 84) {
      //   passedSecond.current += 60;
      // }
    }
  };

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

  return (
    <StyledTetrisWrapper
      role="button"
      tabIndex="0"
      onKeyDown={e => move(e)}
      onKeyUp={keyUp}
    >
      <StyledTetris>
        <Stage stage={stage} />
        <aside>
          {gameOver ?
            (
              <>
                <Display gameOver={gameOver} text={isWin ? "You Win" : "Game Over"} isWin={isWin} />
                <Display gameOver={gameOver} text={`Score: ${score}`} isWin={isWin} />
              </>
            ) :
            (
              <div>
                <NextTetromino tetromino={player.nextTetromino} />
                <Display text={`Target: ${presentHardLevel.target}`} />
                <Display text={`Score: ${score}`} />
                <Display text={`Level: ${level + 1}`} />
              </div>
            )}

          {/* <CollectionsPage /> */}
          <OptionPage stageWidth={stageWidth} stageHeight={stageHeight} onOK={changeOptions}
            basicHardLevelList={basicHardLevelList} presentHardLevel={presentHardLevel}
            customHardLevelList={customHardLevelList}
          />
          {isPlaying ?
            <Button callback={pauseGame} text="Pause Game" isPlaying={true} /> :
            isPaused ?
              <Button callback={resumeGame} text="Resume" /> :
              <Button callback={startGame} text="Start Game" />
          }
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
};

export default Tetris;
