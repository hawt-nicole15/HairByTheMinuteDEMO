import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { OptionButton } from '@/components/OptionButton';
import { useHairProfile } from '@/context/HairProfileContext';
import { TOTAL_STEPS } from '@/constants/questions';
import { QuestionOption } from '@/types';

interface Goal extends QuestionOption {
  icon: keyof typeof Ionicons.glyphMap;
}

const GOALS: Goal[] = [
  {
    id: 'moisture',
    icon: 'water-outline',
    label: 'Moisture & Hydration',
    description: 'Keep hair well-moisturized and prevent dryness',
    value: 'moisture',
  },
  {
    id: 'growth',
    icon: 'trending-up-outline',
    label: 'Healthy Growth',
    description: 'Retain length and grow longer, stronger hair',
    value: 'growth',
  },
  {
    id: 'curl_definition',
    icon: 'refresh-circle-outline',
    label: 'Curl Definition',
    description: 'Enhance and show off your natural curl pattern',
    value: 'curl_definition',
  },
  {
    id: 'protective_maintenance',
    icon: 'lock-closed-outline',
    label: 'Protective Style Care',
    description: 'Maintain locs, twists, braids, or other styles',
    value: 'protective_maintenance',
  },
  {
    id: 'strength',
    icon: 'shield-outline',
    label: 'Strength & Repair',
    description: 'Reduce breakage and rebuild damaged strands',
    value: 'strength',
  },
  {
    id: 'scalp_health',
    icon: 'leaf-outline',
    label: 'Scalp Health',
    description: 'Keep your scalp balanced, clean, and healthy',
    value: 'scalp_health',
  },
];

const GRAND_TOTAL = TOTAL_STEPS + 1;

export default function HairGoalsScreen() {
  const router = useRouter();
  const { setHairGoals } = useHairProfile();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (value: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  };

  const handleContinue = () => {
    setHairGoals(Array.from(selected));
    router.push('/account-setup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text style={styles.stepCounter}>{GRAND_TOTAL} of {GRAND_TOTAL}</Text>
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar current={GRAND_TOTAL} total={GRAND_TOTAL} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.category}>YOUR JOURNEY</Text>
        <Text style={styles.title}>What are your hair goals?</Text>
        <Text style={styles.subtitle}>
          Select everything that applies — your routine will be tailored to all of them.
        </Text>

        <View style={styles.goalsContainer}>
          {GOALS.map((goal) => (
            <OptionButton
              key={goal.id}
              option={goal}
              icon={goal.icon}
              selected={selected.has(goal.value)}
              onSelect={toggle}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {selected.size > 0 && (
          <Text style={styles.selectedCount}>
            {selected.size} goal{selected.size > 1 ? 's' : ''} selected
          </Text>
        )}
        <Button
          label="Continue to Account Setup"
          onPress={handleContinue}
          disabled={selected.size === 0}
          style={[
            styles.continueBtn,
            selected.size === 0 ? styles.continueBtnDisabled : undefined,
          ]}
        />
        {selected.size === 0 && (
          <Text style={styles.hintText}>Select at least one goal to continue</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.screenBg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  stepCounter: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryLight,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
    marginBottom: 24,
  },
  goalsContainer: {
    gap: 10,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    paddingTop: 12,
    gap: 8,
  },
  selectedCount: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryMedium,
  },
  continueBtn: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  continueBtnDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  hintText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textMuted,
  },
});
