import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import type { Question, QuizResult } from './services/api';
import { api } from './services/api';

type GameState = 'START' | 'LOADING' | 'QUIZ' | 'SUBMITTING' | 'RESULT';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('START');
  const [userId, setUserId] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [, setUserAnswers] = useState<{ id: number; answer: string }[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startGame = async (id: string) => {
    try {
      setUserId(id);
      setGameState('LOADING');
      setError(null);
      
      const count = parseInt(import.meta.env.VITE_QUESTION_COUNT || '10');
      const data = await api.fetchQuestions(count);
      
      setQuestions(data);
      setGameState('QUIZ');
    } catch (err) {
      console.error(err);
      setError('無法讀取題目，請檢查 GAS URL 設定');
      setGameState('START');
    }
  };

  const finishQuiz = async (answers: { id: number; answer: string }[]) => {
    try {
      setUserAnswers(answers);
      setGameState('SUBMITTING');
      setError(null);
      
      const res = await api.submitAnswers(userId, answers);
      setResult(res);
      setGameState('RESULT');
    } catch (err) {
      console.error(err);
      setError('提交失敗，請重新整理頁面');
      setGameState('START');
    }
  };

  const restart = () => {
    setGameState('START');
    setQuestions([]);
    setUserAnswers([]);
    setResult(null);
  };

  return (
    <div className="game-container">
      {error && <div style={{ color: 'var(--pixel-danger)', marginBottom: '10px' }}>[!] {error}</div>}
      
      {gameState === 'START' && <StartScreen onStart={startGame} />}
      
      {gameState === 'LOADING' && (
        <div className="loading-screen">
          <h2 className="loading-text">PRELOADING STAGES...</h2>
        </div>
      )}
      
      {gameState === 'QUIZ' && (
        <QuizScreen questions={questions} onComplete={finishQuiz} />
      )}
      
      {gameState === 'SUBMITTING' && (
        <div className="loading-screen">
          <h2 className="loading-text">CALCULATING SCORE...</h2>
        </div>
      )}
      
      {gameState === 'RESULT' && result && (
        <ResultScreen result={result} userId={userId} onRestart={restart} />
      )}
    </div>
  );
};

export default App;
