import { useState, useEffect, useCallback } from 'react';
import { askQuestion, getUserProfile } from '../services/api';
import { setQuestionsRemaining, getQuestionsRemaining } from '../services/storage';

interface ReadingResult {
  id: number;
  question: string;
  answer: string;
  tarot_cards: any;
  numerology: any;
  astrology: any;
  palm_analysis: any;
  face_analysis: any;
  questions_remaining: number;
  created_at: string;
}

export function useReadingSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [questionsRemaining, setQuestionsRemainingState] = useState(0);
  const [needsPremium, setNeedsPremium] = useState(false);

  useEffect(() => {
    getQuestionsRemaining().then(setQuestionsRemainingState);
    getUserProfile().then((p: any) => {
      if (p?.questions_remaining !== undefined) {
        setQuestionsRemainingState(p.questions_remaining);
        setQuestionsRemaining(p.questions_remaining);
      }
    }).catch(() => {});
  }, []);

  const ask = useCallback(async (question: string) => {
    if (!question.trim()) {
      setError('Lütfen bir soru gir.');
      return;
    }

    setLoading(true);
    setError(null);
    setNeedsPremium(false);
    setResult(null);

    try {
      const data = await askQuestion(question) as ReadingResult;
      setResult(data);
      setQuestionsRemainingState(data.questions_remaining);
      await setQuestionsRemaining(data.questions_remaining);
    } catch (e: any) {
      if (e.message?.includes('402') || e.message?.includes('kalmadı')) {
        setNeedsPremium(true);
        setError('Soru hakkınız bitti. Devam etmek için paket satın alın.');
      } else {
        setError(e.message || 'Bir hata oluştu. Tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setNeedsPremium(false);
  }, []);

  return {
    ask,
    reset,
    loading,
    error,
    result,
    questionsRemaining,
    needsPremium,
  };
}
