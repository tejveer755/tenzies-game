import React from 'react';

function GameBoard({ dice, hold, rollDice, tenzies, resetGame, rollCount,time }) {
    return (
        <>
            <div className="status">
                <h3>Rolls:{rollCount} </h3>
                <h3>Timer:
                    {("0" + Math.floor((time / 1000) % 60)).slice(-2)}:
                    {("0" + ((time / 10) % 1000)).slice(-2)}
                </h3>
            </div>
            <div className="dice-container">
                {dice.map(die => (
                    <div
                        className={die.isFixed ? "die-face green" : "die-face"}
                        key={die.id}
                        onClick={() => hold(die.id)}
                    >
                        <h2 className="die-num">{die.value}</h2>
                    </div>
                ))}
            </div>
            {!tenzies ? (
                <button className="roll-btn" onClick={rollDice}>Roll</button>
            ) : (
                <button className="reset-btn" onClick={resetGame}>New Game</button>
            )}
        </>
    );
}

export default GameBoard;
