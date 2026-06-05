import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  DEVICE_ID: 'mistikai_device_id',
  USER_PROFILE: 'mistikai_user_profile',
  ONBOARDING_DONE: 'mistikai_onboarding_done',
  QUESTIONS_REMAINING: 'mistikai_questions_remaining',
  STREAK: 'mistikai_streak',
  LAST_ACTIVE: 'mistikai_last_active',
};

export interface UserProfile {
  deviceId: string;
  name: string;
  birthDate: string;
  birthTime?: string;
  birthCity?: string;
  palmImageUri?: string;
  faceImageUri?: string;
}

function generateDeviceId(): string {
  return 'dev_' + Math.random().toString(36).substr(2, 16) + '_' + Date.now();
}

export async function getOrCreateDeviceId(): Promise<string> {
  let id = await AsyncStorage.getItem(KEYS.DEVICE_ID);
  if (!id) {
    id = generateDeviceId();
    await AsyncStorage.setItem(KEYS.DEVICE_ID, id);
  }
  return id;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  await AsyncStorage.setItem(KEYS.ONBOARDING_DONE, 'true');
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(KEYS.USER_PROFILE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export async function isOnboardingDone(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEYS.ONBOARDING_DONE);
  return val === 'true';
}

export async function setQuestionsRemaining(count: number): Promise<void> {
  await AsyncStorage.setItem(KEYS.QUESTIONS_REMAINING, String(count));
}

export async function getQuestionsRemaining(): Promise<number> {
  const val = await AsyncStorage.getItem(KEYS.QUESTIONS_REMAINING);
  return val ? parseInt(val, 10) : 0;
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
