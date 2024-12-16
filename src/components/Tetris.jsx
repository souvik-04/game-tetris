import React, { useState, useEffect } from 'react';

import { createStage, checkCollision } from '../gameHelpers';
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

// Custom Hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';

// Components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

const Tetris = () => {
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState(''); // Player name
  const [savedScores, setSavedScores] = useState(
    JSON.parse(localStorage.getItem('savedScores')) || []
  ); // List of saved scores
  const [piecesPlaced, setPiecesPlaced] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(
    rowsCleared
  );

  // Update accuracy whenever rows or pieces are placed
  useEffect(() => {
    if (piecesPlaced > 0) {
      setAccuracy(((rows / piecesPlaced) * 100).toFixed(2));
    }
  }, [rows, piecesPlaced]);

  // Save the scores to localStorage
  useEffect(() => {
    localStorage.setItem('savedScores', JSON.stringify(savedScores));
  }, [savedScores]);

  const movePlayer = dir => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  };

  const keyUp = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 40) {
        setDropTime(1000 / (level + 1));
      }
    }
  };

  const startGame = () => {
    if (!playerName.trim()) {
      alert('Please enter your name before starting the game.');
      return;
    }
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setScore(0);
    setLevel(0);
    setRows(0);
    setGameOver(false);
    setPiecesPlaced(0);
    setAccuracy(0);
  };

  const drop = () => {
    if (rows > (level + 1) * 10) {
      setLevel(prev => prev + 1);
      setDropTime(1000 / (level + 1) + 200);
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      if (player.pos.y < 1) {
        console.log('GAME OVER!!!');
        setGameOver(true);
        setDropTime(null);
        savePlayerScore();
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
      setPiecesPlaced(prev => prev + 1);
    }
  };

  const dropPlayer = () => {
    setDropTime(null);
    drop();
  };

  const savePlayerScore = () => {
    const newScore = { name: playerName, score };
    const updatedScores = [...savedScores, newScore];
    setSavedScores(updatedScores);
  };

  const clearScores = () => {
    setSavedScores([]); // Clear the state
    localStorage.removeItem('savedScores'); // Remove from localStorage
  };

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

  return (
    <StyledTetrisWrapper
      role="button"
      tabIndex="0"
      onKeyDown={e => move(e)}
      onKeyUp={keyUp}
    >
      <div style={{ fontFamily: 'Pixel', color: '#445d85', position: 'absolute', top: '10px', left: '10px', width: '300px' }}>
        <h2>Enter Your Name</h2>
        <input
          type="text"
          value={playerName}
          onChange={e => setPlayerName(e.target.value)}
          placeholder="Player Name"
          style={{ fontSize: 'large', fontFamily: 'Pixel', borderRadius: '8px', border: '3px solid #333', color: '#9999', background: 'black', width: '100%', padding: '10px', marginBottom: '10px' }}
        />
      </div>
      <StyledTetris>
        <Stage stage={stage} />
        <aside>
          {gameOver ? (
            <Display gameOver={gameOver} text="Game Over" />
          ) : (
            <div>
              <Display text={`Score: ${score}`} />
              <Display text={`Rows: ${rows}`} />
              <Display text={`Level: ${level}`} />
              <Display text={`Accuracy: ${accuracy}%`} />
            </div>
          )}
          <StartButton callback={startGame} />
        </aside>
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '380px',
            padding: '10px',
            fontSize: '20px',
            fontFamily: 'monospace',
            background: 'transparent',
            color: '#445d85',
            borderRadius: '20px',
          }}
        >
          <h3>About Tetris</h3>
          <p>
            Tetris is a tile-matching puzzle game where the goal is to clear horizontal rows of blocks.
            The player manipulates tetrominoes (geometric shapes) as they descend the screen. Align
            the blocks to form complete rows to score points and avoid reaching the top of the screen.
          </p>
          <h4>How to Play:</h4>
          <ul>
            <li>Use the Left Arrow to move the piece left.</li>
            <li>Use the Right Arrow to move the piece right.</li>
            <li>Use the Down Arrow to drop the piece faster.</li>
            <li>Use the Up Arrow to rotate the piece.</li>
          </ul>
        </div>
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            background: 'black',
            border: '3px solid #333',
            color: '#999',
            fontSize: '12px',
            fontFamily: 'Pixel',
            borderRadius: '10px',
            maxHeight: '200px',
            width: '30%',
            overflowY: 'auto',
          }}
        >
          
          <h3>Saved Scores</h3>
          {savedScores.length === 0 ? (
            <p>No scores saved yet!</p>
          ) : (
            <ul>
              {savedScores.map((entry, index) => (
                <li key={index}>
                  {entry.name}: {entry.score}
                </li>
              ))}
            </ul>
          )}
          {savedScores.length > 0 && (
            <button
              onClick={clearScores}
              style={{
                marginTop: '10px',
                padding: '10px',
                background: '#333',
                color: 'white',
                fontFamily: 'Pixel',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Clear All Scores
            </button>
          )}
        </div>
      </StyledTetris>
      {/* Footer Section */}
      <footer
        style={{
          textAlign: 'center',
          padding: '10px 0px',
          backgroundColor: '#222',
          color: '#999',
          fontFamily: 'monospace',
          fontSize: '14px',
          position: 'absolute',
          bottom: '0',
          width: '100%',
          borderTop: '3px solid #333',
        }}
      >
        &copy; {new Date().getFullYear()} Souvik Kr Maji. All rights reserved.
      </footer>
    </StyledTetrisWrapper>
  );
  
};

export default Tetris;
