const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export interface Question {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

export interface QuizResult {
  score: number;
  correct: number;
  total: number;
  status: 'PASS' | 'FAIL';
}

async function gasRequest<T>(params: object): Promise<T> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      const { action, answers, count } = params as any;
      setTimeout(() => {
        if (action === 'getQuestions') {
          const mockQuestions: Question[] = Array.from({ length: count || 5 }, (_, i) => ({
            id: i + 1,
            question: `這是一題模擬測試題目 #${i + 1}，請問 1 + ${i} 等於多少？`,
            options: { A: `${1 + i}`, B: `${2 + i}`, C: `${3 + i}`, D: `${4 + i}` }
          }));
          resolve(mockQuestions as unknown as T);
        } else if (action === 'submitAnswers') {
          // 模擬計算：假設所有題目答案都是 'A'
          let correct = 0;
          answers.forEach((ua: any) => {
            if (ua.answer === 'A') correct++;
          });
          const total = answers.length;
          const score = Math.round((correct / total) * 100);
          const threshold = parseInt(import.meta.env.VITE_PASS_THRESHOLD || '70');
          
          resolve({
            score,
            correct,
            total,
            status: score >= threshold ? 'PASS' : 'FAIL'
          } as unknown as T);
        }
      }, 800);
    });
  }

  const response = await fetch(GAS_URL, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('GAS Request Failed');
  }

  return response.json();
}

export const api = {
  fetchQuestions: async (count: number): Promise<Question[]> => {
    return gasRequest<Question[]>({ action: 'getQuestions', count });
  },

  submitAnswers: async (id: string, answers: { id: number; answer: string }[]): Promise<QuizResult> => {
    return gasRequest<QuizResult>({ action: 'submitAnswers', id, answers });
  },
};
