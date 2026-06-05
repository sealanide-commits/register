import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import StarBackground from '../../components/StarBackground';
import { uploadPalmImage } from '../../services/api';
import { getUserProfile, saveUserProfile } from '../../services/storage';

export default function PalmUploadScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Galeri erişimi için izin vermeniz gerekiyor.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [3, 4],
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      await handleUpload(uri);
    }
  };

  const handleUpload = async (uri: string) => {
    setUploading(true);
    try {
      const data = await uploadPalmImage(uri) as any;
      setAnalysis(data.analysis);
      const profile = await getUserProfile();
      if (profile) {
        await saveUserProfile({ ...profile, palmImageUri: uri });
      }
    } catch (e: any) {
      Alert.alert('Hata', e.message || 'Yükleme başarısız.');
    } finally {
      setUploading(false);
    }
  };

  const handleNext = () => {
    router.replace('/onboarding/face-upload');
  };

  return (
    <StarBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.emoji}>✋</Text>
          <Text style={styles.title}>Avuç İzi Analizi</Text>
          <Text style={styles.subtitle}>
            Sağ elinizin avuç içini açık tutarak fotoğrafını çekin veya galeriden seçin.
            Bu analiz okumanıza derinlik katacak.
          </Text>
        </View>

        <TouchableOpacity onPress={pickImage} style={styles.uploadArea} disabled={uploading}>
          <LinearGradient
            colors={['#1A0035', '#0A0014']}
            style={styles.uploadGradient}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Text style={styles.uploadIcon}>📸</Text>
                <Text style={styles.uploadText}>Galeriden Seç</Text>
                <Text style={styles.uploadHint}>veya kameradan çek</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {uploading && (
          <View style={styles.uploadingBox}>
            <ActivityIndicator color={COLORS.primary} />
            <Text style={styles.uploadingText}>Avuç izin analiz ediliyor...</Text>
          </View>
        )}

        {analysis && (
          <View style={styles.analysisBox}>
            <Text style={styles.analysisTitle}>✨ Avuç İzi Okundu</Text>
            <Text style={styles.analysisText}>{analysis.heart_line}</Text>
            <Text style={styles.analysisText}>{analysis.fate_line}</Text>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <LinearGradient
              colors={[COLORS.primary, '#A07830']}
              style={styles.nextGradient}
            >
              <Text style={styles.nextText}>
                {imageUri ? 'Devam Et →' : 'Şimdilik Atla'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </StarBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  emoji: {
    fontSize: 56,
    marginBottom: SPACING.sm,
  },
  title: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  uploadArea: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  uploadGradient: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  uploadText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  uploadHint: {
    color: COLORS.textDim,
    fontSize: 13,
    marginTop: 4,
  },
  previewImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  uploadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  uploadingText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  analysisBox: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  analysisTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  analysisText: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
  },
  actions: {
    marginTop: 'auto',
    paddingBottom: SPACING.xl,
  },
  nextBtn: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  nextGradient: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  nextText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '700',
  },
});
