import React from 'react';
import type { QuizResult } from '../services/api';

interface Props {
  result: QuizResult;
  userId: string;
  onRestart: () => void;
}

const ResultScreen: React.FC<Props> = ({ result, userId, onRestart }) => {
  const isPass = result.status === 'PASS';

  return (
    <div className="fade-in" style={{ textAlign: 'center' }}>
      <h2 style={{ 
        fontSize: '32px', 
        marginBottom: '20px', 
        color: isPass ? 'var(--pixel-success)' : 'var(--pixel-danger)' 
      }}>
        {isPass ? 'MISSION COMPLETE' : 'GAME OVER'}
      </h2>

      <div className="pixel-card">
        <p style={{ marginBottom: '10px' }}>PLAYER: {userId}</p>
        <p style={{ marginBottom: '10px', fontSize: '24px' }}>SCORE: {result.score}</p>
        <p style={{ color: '#aaa', fontSize: '12px' }}>
          CORRECT: {result.correct} / {result.total}
        </p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <button className="pixel-btn" onClick={onRestart}>
          PLAY AGAIN
        </button>
      </div>

      <p style={{ marginTop: '20px', fontSize: '10px' }}>
        {isPass ? 'YOU ARE A PIXEL MASTER!' : 'BETTER LUCK NEXT TIME!'}
      </p>
    </div>
  );
};

export default ResultScreen;
