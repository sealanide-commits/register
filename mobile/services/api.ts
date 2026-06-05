import { getOrCreateDeviceId } from './storage';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Bir hata oluştu' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function createUser(data: {
  name: string;
  birthDate: string;
  birthTime?: string;
  birthCity?: string;
  pushToken?: string;
}) {
  const deviceId = await getOrCreateDeviceId();
  return request('/user/create', {
    method: 'POST',
    body: JSON.stringify({
      device_id: deviceId,
      name: data.name,
      birth_date: data.birthDate,
      birth_time: data.birthTime,
      birth_city: data.birthCity,
      push_token: data.pushToken,
    }),
  });
}

export async function getUserProfile() {
  const deviceId = await getOrCreateDeviceId();
  return request(`/user/profile/${deviceId}`);
}

export async function getNumerology() {
  const deviceId = await getOrCreateDeviceId();
  return request(`/user/numerology/${deviceId}`);
}

export async function getAstrology() {
  const deviceId = await getOrCreateDeviceId();
  return request(`/user/astrology/${deviceId}`);
}

export async function askQuestion(question: string) {
  const deviceId = await getOrCreateDeviceId();
  return request('/reading/ask', {
    method: 'POST',
    body: JSON.stringify({ device_id: deviceId, question }),
  });
}

export async function getReadingHistory() {
  const deviceId = await getOrCreateDeviceId();
  return request(`/reading/history/${deviceId}`);
}

export async function getDailyTarot() {
  const deviceId = await getOrCreateDeviceId();
  return request(`/reading/tarot?device_id=${deviceId}`);
}

export async function uploadPalmImage(imageUri: string) {
  const deviceId = await getOrCreateDeviceId();
  const formData = new FormData();
  formData.append('device_id', deviceId);
  formData.append('file', {
    uri: imageUri,
    name: 'palm.jpg',
    type: 'image/jpeg',
  } as any);

  const response = await fetch(`${API_BASE}/upload/palm`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Yükleme hatası' }));
    throw new Error(err.detail);
  }
  return response.json();
}

export async function uploadFaceImage(imageUri: string) {
  const deviceId = await getOrCreateDeviceId();
  const formData = new FormData();
  formData.append('device_id', deviceId);
  formData.append('file', {
    uri: imageUri,
    name: 'face.jpg',
    type: 'image/jpeg',
  } as any);

  const response = await fetch(`${API_BASE}/upload/face`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Yükleme hatası' }));
    throw new Error(err.detail);
  }
  return response.json();
}

export async function getPackages() {
  return request('/payment/packages');
}

export async function verifyPurchase(packageId: string, paymentRef?: string) {
  const deviceId = await getOrCreateDeviceId();
  return request('/payment/verify', {
    method: 'POST',
    body: JSON.stringify({ device_id: deviceId, package_id: packageId, payment_ref: paymentRef }),
  });
}

export async function getPaymentStatus() {
  const deviceId = await getOrCreateDeviceId();
  return request(`/payment/status/${deviceId}`);
}
