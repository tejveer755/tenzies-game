import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import './App.css';
import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';
import Confetti from 'react-confetti';

function App() {
  const [dice, setDice] = useState(() => {
    const savedDice = localStorage.getItem('dice');
    if (savedDice) {
      return JSON.parse(savedDice);
    }
    return generateNewDice();
  });

  const [tenzies, setTenzies] = useState(() => {
    const savedTenzies = localStorage.getItem('tenzies');
    return savedTenzies ? JSON.parse(savedTenzies) : false;
  });

  const [startGame, setStartGame] = useState(() => {
    const savedStartGame = localStorage.getItem('startGame');
    return savedStartGame ? JSON.parse(savedStartGame) : false;
  });

  const [rollCount, setRollCount] = useState(() => {
    const savedRollCount = localStorage.getItem('rollCount');
    return savedRollCount ? JSON.parse(savedRollCount) : 0;
  });

  const [time, setTime] = useState(() => {
    const savedTime = localStorage.getItem('time');
    return savedTime ? JSON.parse(savedTime) : 0;
  });

  const [startTimer, setStartTimer] = useState(() => {
    const savedStartTimer = localStorage.getItem('startTimer');
    return savedStartTimer ? JSON.parse(savedStartTimer) : false;
  });

  const [bestTime, setBestTime] = useState(() => {
    const savedBestTime = localStorage.getItem('bestTime');
    return savedBestTime ? JSON.parse(savedBestTime) : null;
  });

  const [bestRollCount, setBestRollCount] = useState(() => {
    const savedBestRollCount = localStorage.getItem('bestRollCount');
    return savedBestRollCount ? JSON.parse(savedBestRollCount) : null;
  });

  useEffect(() => {
    localStorage.setItem('dice', JSON.stringify(dice));
  }, [dice]);

  useEffect(() => {
    localStorage.setItem('tenzies', JSON.stringify(tenzies));
  }, [tenzies]);

  useEffect(() => {
    localStorage.setItem('startGame', JSON.stringify(startGame));
  }, [startGame]);

  useEffect(() => {
    localStorage.setItem('rollCount', JSON.stringify(rollCount));
  }, [rollCount]);

  useEffect(() => {
    localStorage.setItem('time', JSON.stringify(time));
  }, [time]);

  useEffect(() => {
    localStorage.setItem('startTimer', JSON.stringify(startTimer));
  }, [startTimer]);

  useEffect(() => {
    if (checkWin()) {
      setTenzies(true);
      setStartTimer(false);
      updateBestScores();
    }
  }, [dice]);

  useEffect(() => {
    let interval = null;
    if (startTimer) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [startTimer]);

  function generateNewDice() {
    return Array(10).fill().map(() => ({
      value: Math.ceil(Math.random() * 6),
      id: nanoid(),
      isFixed: false,
    }));
  }

  function rollDice() {
    setRollCount(prevCount => prevCount + 1);
    setDice(oldDice => oldDice.map(die =>
      die.isFixed ? die : { ...die, value: Math.ceil(Math.random() * 6) }
    ));
  }

  function hold(id) {
    setDice(oldDice =>
      oldDice.map(die =>
        die.id === id ? { ...die, isFixed: !die.isFixed } : die
      )
    );
  }

  function checkWin() {
    const firstValue = dice[0].value;
    return dice.every(die => die.value === firstValue && die.isFixed);
  }

  function resetGame() {
    setTime(0);
    setStartTimer(true);
    setTenzies(false);
    setDice(generateNewDice());
    setRollCount(0);
  }

  function startNewGame() {
    setStartTimer(true);
    setStartGame(true);
    setDice(generateNewDice());
    setRollCount(0);
    setTime(0);
  }

  function updateBestScores() {
    let newBestTime = bestTime;
    let newBestRollCount = bestRollCount;

    if (bestTime === null || time < bestTime) {
      newBestTime = time;
      setBestTime(time);
      localStorage.setItem('bestTime', JSON.stringify(time));
    }

    if (bestRollCount === null || rollCount < bestRollCount) {
      newBestRollCount = rollCount;
      setBestRollCount(rollCount);
      localStorage.setItem('bestRollCount', JSON.stringify(rollCount));
    }

    return { newBestTime, newBestRollCount };
  }
  const { width } = window.innerWidth

  return (
    <main>
      <h1 className="title">Tenzies</h1>
      {tenzies ? (
        <>
          <h2 className='won-msg'>Congratulations You Won!</h2>
          <Confetti
            width={width}
          />
        </>
      ) : (
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
        </p>
      )}
      {startGame ? (
        <GameBoard
          dice={dice}
          hold={hold}
          rollDice={rollDice}
          tenzies={tenzies}
          resetGame={resetGame}
          rollCount={rollCount}
          time={time}
        />
      ) : (
        <button className="start-btn" onClick={startNewGame}>Start Game</button>
      )}
      {startGame && <ScoreBoard bestTime={bestTime} bestRollCount={bestRollCount} />}
    </main>
  );
}

export default App;
