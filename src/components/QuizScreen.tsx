import React, { useState } from 'react';
import type { Question } from '../services/api';

interface Props {
  questions: Question[];
  onComplete: (answers: { id: number; answer: string }[]) => void;
}

const QuizScreen: React.FC<Props> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ id: number; answer: string }[]>([]);

  const currentQuestion = questions[currentIndex];
  
  // 使用 DiceBear API 根據題號生成獨特的關主圖片
  const bossUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${currentQuestion.id}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  const handleSelect = (option: string) => {
    const newAnswers = [...answers, { id: currentQuestion.id, answer: option }];
    
    if (currentIndex < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span>STAGE {currentIndex + 1}/{questions.length}</span>
        <span style={{ color: 'var(--pixel-accent)' }}>BOSS LEVEL</span>
      </div>

      <img src={bossUrl} alt="Boss" className="boss-image" />

      <div className="pixel-card">
        <p style={{ minHeight: '80px', marginBottom: '20px', fontSize: '14px' }}>
          {currentQuestion.question}
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {(Object.keys(currentQuestion.options) as Array<keyof typeof currentQuestion.options>).map((key) => (
            <button
              key={key}
              className="pixel-btn"
              onClick={() => handleSelect(key)}
              style={{ textAlign: 'left', fontSize: '12px' }}
            >
              {key}. {currentQuestion.options[key]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
