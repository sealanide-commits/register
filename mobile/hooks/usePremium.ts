import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { getPackages, verifyPurchase, getPaymentStatus } from '../services/api';
import { setQuestionsRemaining } from '../services/storage';

export interface Package {
  id: string;
  name: string;
  description: string;
  price_tl: number;
  questions: number;
  popular: boolean;
}

export function usePremium() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const loadPackages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPackages() as Package[];
      setPackages(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const checkPremiumStatus = useCallback(async () => {
    try {
      const status = await getPaymentStatus() as any;
      setIsPremium(status.is_premium);
      await setQuestionsRemaining(status.questions_remaining);
      return status;
    } catch {
      return null;
    }
  }, []);

  const purchase = useCallback(async (pkg: Package): Promise<boolean> => {
    setPurchasing(true);
    try {
      // In production: integrate with RevenueCat / App Store / Google Play
      // For now: simulate payment verification
      const result = await verifyPurchase(pkg.id, `ref_${Date.now()}`) as any;
      if (result.success) {
        await setQuestionsRemaining(result.questions_remaining);
        setIsPremium(result.questions_remaining >= 100);
        Alert.alert('Başarılı! 🎉', result.message);
        return true;
      }
      return false;
    } catch (e: any) {
      Alert.alert('Hata', e.message || 'Ödeme işlemi başarısız.');
      return false;
    } finally {
      setPurchasing(false);
    }
  }, []);

  return {
    packages,
    loading,
    purchasing,
    isPremium,
    loadPackages,
    checkPremiumStatus,
    purchase,
  };
}
