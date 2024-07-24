import React from 'react';

function ScoreBoard({ bestTime, bestRollCount }) {
  return (
    <div className="score status">
      <h3>Best Time: {bestTime !== null ? (bestTime / 1000).toFixed(2) + 's' : 'N/A'}</h3>
      <h3>Best Roll Count: {bestRollCount !== null ? bestRollCount : 'N/A'}</h3>
    </div>
  );
}

export default ScoreBoard;
