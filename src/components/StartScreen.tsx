import React, { useState } from 'react';

interface Props {
  onStart: (id: string) => void;
}

const StartScreen: React.FC<Props> = ({ onStart }) => {
  const [id, setId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id.trim()) {
      onStart(id);
    }
  };

  return (
    <div className="fade-in" style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '40px', color: 'var(--pixel-accent)' }}>
        PIXEL QUIZ CHALLENGE
      </h1>
      
      <div className="pixel-card">
        <p style={{ marginBottom: '20px' }}>INSERT PLAYER ID</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="pixel-input"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="PLAYER 1"
            maxLength={20}
            required
            autoFocus
          />
          <button type="submit" className="pixel-btn">
            START GAME
          </button>
        </form>
      </div>
      
      <p style={{ fontSize: '10px', marginTop: '40px', color: '#666' }}>
        &copy; 2026 RETRO ARCADE SYSTEMS
      </p>
    </div>
  );
};

export default StartScreen;
