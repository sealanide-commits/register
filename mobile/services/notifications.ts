import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const DAILY_MESSAGES = [
  { title: '🌟 Kozmik Mesajın Hazır', body: 'Bugün Venüs seni etkiliyor. Okumanı şimdi al!' },
  { title: '🔮 Tarot Kartın Çekildi', body: 'Günlük tarot okumanı kaçırma, harika bir kart bekliyorsun.' },
  { title: '⭐ Yıldızlar Seni Çağırıyor', body: 'Bugün özel bir enerji var. Soruyu sor, cevabı bul.' },
  { title: '🌙 Ay Dolunayı Yakın', body: 'Ay enerjisi zirveye ulaşıyor. En güçlü okuma zamanı şimdi!' },
  { title: '✨ Spiritüel Rehberin Burada', body: 'Bugünkü mesajın hazır. Kaderin ne söylüyor?' },
  { title: '🪐 Jüpiter Enerjisi', body: 'Bolluğun kapısı aralandı. Okumanı yap, fırsatı yakala!' },
  { title: '🌸 Güzel Haberler Yolda', body: 'Kartlar olumlu bir dönemin başladığını gösteriyor.' },
];

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('mistikai', {
      name: 'MistikAI Bildirimleri',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#C9A84C',
    });
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch {
    return null;
  }
}

export async function scheduleDailyNotification(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const msg = DAILY_MESSAGES[Math.floor(Math.random() * DAILY_MESSAGES.length)];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: msg.title,
      body: msg.body,
      data: { screen: 'reading' },
      sound: true,
    },
    trigger: {
      hour: 10,
      minute: 0,
      repeats: true,
    } as any,
  });
}

export async function sendStreakNotification(days: number): Promise<void> {
  if (days > 0 && days % 7 === 0) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🔥 ${days} Günlük Seri!`,
        body: `Harika! ${days} gündür okuma yapıyorsun. Altın rozet kazandın!`,
        sound: true,
      },
      trigger: null,
    });
  }
}

export async function sendScarcityNotification(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⏳ Son Şans!',
      body: 'Bugünkü ücretsiz sorun son saatlerinde. Kaçırma!',
      sound: true,
    },
    trigger: {
      seconds: 6 * 3600,
    } as any,
  });
}
