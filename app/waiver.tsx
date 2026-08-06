import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { WaiverDoc } from '@/constants/waiver';
import { useAuth } from '@/context/AuthContext';

export default function WaiverScreen() {
  const router = useRouter();
  const { acceptWaiver } = useAuth();
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onAccept = async () => {
    if (!checked || busy) return;
    setBusy(true);
    setError('');
    try {
      await acceptWaiver();
      router.replace('/(tabs)/home');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save your acceptance. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>{WaiverDoc.title}</Text>
        <Text style={styles.subtitle}>{WaiverDoc.subtitle}</Text>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
      >
        <Text style={styles.intro}>{WaiverDoc.intro}</Text>
        {WaiverDoc.sections.map((s) => (
          <View key={s.heading} style={styles.section}>
            <Text style={styles.sectionHeading}>{s.heading}</Text>
            <Text style={styles.sectionBody}>{s.body}</Text>
          </View>
        ))}
        <Text style={styles.closing}>{WaiverDoc.closing}</Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.checkRow}
          onPress={() => setChecked((c) => !c)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={checked ? 'checkbox' : 'square-outline'}
            size={24}
            color={checked ? Colors.primary : Colors.textMuted}
          />
          <Text style={styles.checkLabel}>
            I have read, understood, and agree to the terms above.
          </Text>
        </TouchableOpacity>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          label={busy ? 'Saving…' : 'Accept & Continue'}
          onPress={onAccept}
          disabled={!checked || busy}
          style={[styles.acceptBtn, (!checked || busy) && styles.acceptBtnDisabled]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.screenBg },
  flex: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: 14, color: Colors.textMuted, marginTop: 2 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  intro: { fontSize: 14, lineHeight: 21, color: Colors.textSecondary, marginBottom: 20 },
  section: { marginBottom: 18 },
  sectionHeading: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  sectionBody: { fontSize: 14, lineHeight: 21, color: Colors.textSecondary },
  closing: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
    gap: 12,
  },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkLabel: { flex: 1, fontSize: 13, lineHeight: 19, color: Colors.textPrimary },
  errorText: { fontSize: 13, color: Colors.error },
  acceptBtn: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  acceptBtnDisabled: { shadowOpacity: 0, elevation: 0 },
});
