import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
} from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useHairProfile } from '@/context/HairProfileContext';
import { generateHairRoutine } from '@/services/gemini';
import * as tracking from '@/services/tracking';
import { track } from '@/services/analytics';
import { HairRoutine, RoutineStep, WeeklyTreatment, ProductRecommendation, WashSchedule, DailyLog, TreatmentEntry } from '@/types';

const TODAY = new Date().toISOString().split('T')[0];

function getDaysUntilWash(schedule: WashSchedule): number {
  const last = new Date(schedule.lastWashDate + 'T00:00:00');
  const next = new Date(last);
  next.setDate(next.getDate() + schedule.frequencyDays);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((next.getTime() - today.getTime()) / 86400000);
}

function daysSinceLastTreatment(history: TreatmentEntry[]): number {
  if (history.length === 0) return Infinity;
  const last = new Date(history[history.length - 1].date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - last.getTime()) / 86400000);
}

// ---------- Sub-components ----------

function CheckButton({ checked, onPress }: { checked: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.checkBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      <Ionicons
        name={checked ? 'checkmark-circle' : 'ellipse-outline'}
        size={26}
        color={checked ? '#4CAF50' : Colors.border}
      />
    </TouchableOpacity>
  );
}

function RoutineStepCard({
  step,
  index,
  showCheck,
  checked,
  onCheck,
}: {
  step: RoutineStep;
  index: number;
  showCheck?: boolean;
  checked?: boolean;
  onCheck?: () => void;
}) {
  return (
    <View style={[styles.stepCard, checked && styles.stepCardDone]}>
      <View style={[styles.stepNumber, checked && styles.stepNumberDone]}>
        <Text style={styles.stepNumberText}>{index + 1}</Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={[styles.stepName, checked && styles.stepNameDone]}>{step.name}</Text>
        <Text style={styles.stepDescription}>{step.description}</Text>
        {step.tip ? <Text style={styles.stepTip}>{step.tip}</Text> : null}
      </View>
      {showCheck && onCheck && (
        <CheckButton checked={!!checked} onPress={onCheck} />
      )}
    </View>
  );
}

function TreatmentCard({
  treatment,
  isDone,
  onMarkDone,
}: {
  treatment: WeeklyTreatment;
  isDone: boolean;
  onMarkDone: () => void;
}) {
  return (
    <View style={[styles.treatmentCard, isDone && styles.treatmentCardDone]}>
      <View style={styles.treatmentHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.treatmentName}>{treatment.name}</Text>
          <Text style={styles.treatmentFrequency}>{treatment.frequency}</Text>
        </View>
        <TouchableOpacity
          style={[styles.markDoneBtn, isDone && styles.markDoneBtnDone]}
          onPress={onMarkDone}
          disabled={isDone}
        >
          {isDone ? (
            <Ionicons name="checkmark" size={14} color={Colors.white} />
          ) : null}
          <Text style={[styles.markDoneBtnText, isDone && { color: Colors.white }]}>
            {isDone ? 'Done' : 'Mark done'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.treatmentDescription}>{treatment.description}</Text>
    </View>
  );
}

function ProductChip({
  name,
  using,
  onToggle,
}: {
  name: string;
  using: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.productChip, using && styles.productChipUsing]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      {using && <Ionicons name="checkmark" size={12} color={Colors.white} style={{ marginRight: 4 }} />}
      <Text style={[styles.productChipText, using && styles.productChipTextUsing]}>{name}</Text>
    </TouchableOpacity>
  );
}

function CollapsibleSection({
  icon,
  title,
  badge,
  badgeUrgent,
  onBadgePress,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  badge?: string;
  badgeUrgent?: boolean;
  onBadgePress?: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((prev) => !prev);
  };

  const BadgeEl = onBadgePress ? TouchableOpacity : View;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <TouchableOpacity style={[styles.sectionHeaderLeft, { flex: 1 }]} onPress={toggle} activeOpacity={0.7}>
          <Ionicons name={icon} size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </TouchableOpacity>
        {badge && (
          <BadgeEl
            style={[styles.badge, badgeUrgent && styles.badgeUrgent]}
            {...(onBadgePress ? { onPress: onBadgePress } : {})}
          >
            <Text style={[styles.badgeText, badgeUrgent && styles.badgeTextUrgent]}>{badge}</Text>
          </BadgeEl>
        )}
        <TouchableOpacity onPress={toggle} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
      {open && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
}

// ---------- Main screen ----------

export default function HomeScreen() {
  const { profile } = useHairProfile();
  const [routine, setRoutine] = useState<HairRoutine | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [washSchedule, setWashSchedule] = useState<WashSchedule | null>(null);
  const [dailyLog, setDailyLog] = useState<DailyLog>({ date: TODAY, completedSteps: [], completedTreatments: [], washedToday: false });
  const [treatmentHistory, setTreatmentHistory] = useState<TreatmentEntry[]>([]);
  const [usedProducts, setUsedProducts] = useState<Set<string>>(new Set());

  const firstName = profile.accountInfo?.firstName ?? 'there';

  // Reload all persistent state when tab is focused (picks up changes from My Hair tab)
  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const [stale, cached, ws, dl, th, pu] = await Promise.all([
            tracking.isRoutineStale(),
            tracking.getRoutine(),
            tracking.getWashSchedule(),
            tracking.getDailyLog(TODAY),
            tracking.getTreatmentHistory(),
            tracking.getProductUsage(),
          ]);
          if (ws) setWashSchedule(ws);
          setTreatmentHistory(th);
          setUsedProducts(new Set(pu));
          // getDailyLog is keyed to TODAY, so it's already day-scoped
          setDailyLog(dl ?? { date: TODAY, completedSteps: [], completedTreatments: [], washedToday: false });

          if (stale) {
            // Profile/goals changed on the My Hair tab — regenerate the routine.
            await tracking.clearRoutineStale();
            setRoutine(null);
            setLoading(true);
            setError(null);
            try {
              const result = await generateHairRoutine();
              setRoutine(result);
              track('routine_generated', { reason: 'profile_changed' });
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Something went wrong.');
            } finally {
              setLoading(false);
            }
          } else if (cached) {
            setRoutine(cached);
          }
        } catch { /* ignore */ }
      })();
    }, [])
  );

  const saveDailyLog = async (updated: DailyLog) => {
    setDailyLog(updated);
    await tracking.saveDailyLog(updated);
  };

  const toggleDailyStep = (stepName: string) => {
    const already = dailyLog.completedSteps.includes(stepName);
    const completedSteps = already
      ? dailyLog.completedSteps.filter((s) => s !== stepName)
      : [...dailyLog.completedSteps, stepName];
    saveDailyLog({ ...dailyLog, completedSteps });
    track('daily_step_toggled', { step: stepName, completed: !already });
  };

  const markTreatmentDone = async (treatmentName: string) => {
    if (dailyLog.completedTreatments.includes(treatmentName)) return;
    const updated = { ...dailyLog, completedTreatments: [...dailyLog.completedTreatments, treatmentName] };
    saveDailyLog(updated);
    track('treatment_marked_done', { treatment: treatmentName });

    // Persist to history for Cassi context, then refresh from the source of truth
    await tracking.recordTreatment(TODAY, treatmentName);
    setTreatmentHistory(await tracking.getTreatmentHistory());
  };

  const confirmWashDay = () => {
    Alert.alert(
      'Wash Day',
      'Did you wash your hair today?',
      [
        { text: 'Not yet', style: 'cancel' },
        {
          text: 'Yes, I washed!',
          onPress: async () => {
            saveDailyLog({ ...dailyLog, washedToday: true });
            track('wash_logged');
            if (washSchedule) {
              const updated = { ...washSchedule, lastWashDate: TODAY };
              setWashSchedule(updated);
              await tracking.saveWashSchedule(updated);
            }
          },
        },
      ]
    );
  };

  const toggleProduct = async (productName: string) => {
    const adding = !usedProducts.has(productName);
    const next = new Set(usedProducts);
    adding ? next.add(productName) : next.delete(productName);
    setUsedProducts(next);
    await tracking.saveProductUsage(Array.from(next));
    track('product_toggled', { product: productName, using: adding });
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      // The edge function saves the routine to the DB; we just use what it returns.
      const result = await generateHairRoutine();
      setRoutine(result);
      track('routine_generated');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRoutine(null);
    handleGenerate();
  };

  const daysUntil = washSchedule ? getDaysUntilWash(washSchedule) : null;
  const washBadge = dailyLog.washedToday
    ? 'Done today!'
    : daysUntil === null
    ? undefined
    : daysUntil <= 0
    ? 'Wash day! Tap to log'
    : daysUntil === 1
    ? 'Tomorrow'
    : `In ${daysUntil} days`;

  const treatmentDaysSince = daysSinceLastTreatment(treatmentHistory);
  const treatmentBadge = treatmentDaysSince >= 7 ? 'Due' : undefined;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hey, {firstName}!</Text>
          <Text style={styles.subGreeting}>Your personalized hair routine</Text>
        </View>
        {routine && (
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshBtn} disabled={loading}>
            <Ionicons name="refresh-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {!routine && !loading && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="sparkles-outline" size={40} color={Colors.primaryLight} />
            </View>
            <Text style={styles.emptyTitle}>Ready to build your routine?</Text>
            <Text style={styles.emptySubtitle}>
              Cassi will create a personalized hair care plan based on your unique hair profile.
            </Text>
            <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
              <Ionicons name="sparkles" size={18} color={Colors.white} style={{ marginRight: 8 }} />
              <Text style={styles.generateBtnText}>Generate My Routine</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading && (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Cassi is crafting your routine…</Text>
            <Text style={styles.loadingSubtext}>This takes about 10-15 seconds</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorState}>
            <Ionicons name="alert-circle-outline" size={32} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={handleGenerate}>
              <Text style={styles.retryBtnText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {routine && !loading && (
          <>
            <View style={styles.frequencyCard}>
              <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.frequencyLabel}>Wash Day</Text>
                <Text style={styles.frequencyValue}>{routine.washDayFrequency}</Text>
              </View>
            </View>

            <CollapsibleSection
              icon="water-outline"
              title="Wash Day Steps"
              badge={washBadge}
              badgeUrgent={!dailyLog.washedToday && daysUntil !== null && daysUntil <= 0}
              onBadgePress={!dailyLog.washedToday && daysUntil !== null && daysUntil <= 0 ? confirmWashDay : undefined}
            >
              {routine.washDaySteps.map((step, i) => (
                <RoutineStepCard key={i} step={step} index={i} />
              ))}
            </CollapsibleSection>

            {routine.dailySteps.length > 0 && (
              <CollapsibleSection icon="sunny-outline" title="Daily Maintenance">
                {routine.dailySteps.map((step, i) => (
                  <RoutineStepCard
                    key={i}
                    step={step}
                    index={i}
                    showCheck
                    checked={dailyLog.completedSteps.includes(step.name)}
                    onCheck={() => toggleDailyStep(step.name)}
                  />
                ))}
              </CollapsibleSection>
            )}

            {routine.weeklyTreatments.length > 0 && (
              <CollapsibleSection
                icon="flask-outline"
                title="Weekly Treatments"
                badge={treatmentBadge}
                badgeUrgent
              >
                {routine.weeklyTreatments.map((treatment: WeeklyTreatment, i) => (
                  <TreatmentCard
                    key={i}
                    treatment={treatment}
                    isDone={dailyLog.completedTreatments.includes(treatment.name)}
                    onMarkDone={() => markTreatmentDone(treatment.name)}
                  />
                ))}
              </CollapsibleSection>
            )}

            {routine.productRecommendations.length > 0 && (
              <CollapsibleSection icon="bag-outline" title="Product Recommendations">
                <Text style={styles.productHint}>Tap a product to mark it as one you use</Text>
                {routine.productRecommendations.map((rec: ProductRecommendation, i) => (
                  <View key={i} style={styles.productCard}>
                    <Text style={styles.productType}>{rec.type}</Text>
                    <View style={styles.productSuggestions}>
                      {rec.suggestions.map((s, j) => (
                        <ProductChip
                          key={j}
                          name={s}
                          using={usedProducts.has(s)}
                          onToggle={() => toggleProduct(s)}
                        />
                      ))}
                    </View>
                  </View>
                ))}
              </CollapsibleSection>
            )}

            {routine.tips.length > 0 && (
              <CollapsibleSection icon="bulb-outline" title="Pro Tips">
                <View style={styles.tipsCard}>
                  {routine.tips.map((tip, i) => (
                    <View key={i} style={styles.tipItem}>
                      <View style={styles.tipDot} />
                      <Text style={styles.tipItemText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              </CollapsibleSection>
            )}

            <View style={{ height: 16 }} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.screenBg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16,
  },
  greeting: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
  subGreeting: { fontSize: 14, color: Colors.textMuted, marginTop: 2 },
  refreshBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24, flexGrow: 1 },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingHorizontal: 16 },
  emptyIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.overlay, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center', marginBottom: 10 },
  emptySubtitle: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', lineHeight: 20, marginBottom: 32 },
  generateBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary,
    paddingHorizontal: 28, paddingVertical: 16, borderRadius: 16,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5,
  },
  generateBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },

  loadingState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  loadingText: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  loadingSubtext: { fontSize: 13, color: Colors.textMuted },

  errorState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  errorText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: 16 },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: Colors.primary, borderRadius: 12, marginTop: 4 },
  retryBtnText: { color: Colors.white, fontWeight: '600', fontSize: 14 },

  frequencyCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.overlay, borderRadius: 14, padding: 16, marginBottom: 20 },
  frequencyLabel: { fontSize: 11, fontWeight: '700', color: Colors.primaryLight, letterSpacing: 1, textTransform: 'uppercase' },
  frequencyValue: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, marginTop: 2 },

  section: { marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12 },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  sectionContent: { gap: 10, paddingBottom: 4 },

  badge: { backgroundColor: Colors.overlay, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  badgeUrgent: { backgroundColor: Colors.primary },
  badgeText: { fontSize: 11, fontWeight: '700', color: Colors.primaryMedium },
  badgeTextUrgent: { color: Colors.white },

  stepCard: {
    flexDirection: 'row', backgroundColor: Colors.white, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: Colors.border,
    shadowColor: Colors.shadowColor, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  stepCardDone: { borderColor: '#4CAF50', backgroundColor: '#F0FAF0' },
  stepNumber: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 1, flexShrink: 0 },
  stepNumberDone: { backgroundColor: '#4CAF50' },
  stepNumberText: { color: Colors.white, fontSize: 13, fontWeight: '700' },
  stepContent: { flex: 1 },
  stepName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  stepNameDone: { color: '#2E7D32' },
  stepDescription: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },
  stepTip: { fontSize: 12, color: Colors.primaryMedium, fontStyle: 'italic', marginTop: 5 },
  checkBtn: { justifyContent: 'center', paddingLeft: 8 },

  treatmentCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.border },
  treatmentCardDone: { borderColor: '#4CAF50', backgroundColor: '#F0FAF0' },
  treatmentHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  treatmentName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  treatmentFrequency: { fontSize: 11, fontWeight: '600', color: Colors.primaryMedium, textTransform: 'uppercase', letterSpacing: 0.5 },
  treatmentDescription: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },
  markDoneBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  markDoneBtnDone: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  markDoneBtnText: { fontSize: 12, fontWeight: '600', color: Colors.textMuted },

  productHint: { fontSize: 12, color: Colors.textMuted, fontStyle: 'italic', marginBottom: 4 },
  productCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.border },
  productType: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  productSuggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  productChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.overlay, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1.5, borderColor: 'transparent' },
  productChipUsing: { backgroundColor: Colors.primary, borderColor: Colors.primaryDark },
  productChipText: { fontSize: 12, fontWeight: '600', color: Colors.primaryMedium },
  productChipTextUsing: { color: Colors.white },

  tipsCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.border, gap: 12, marginBottom: 8 },
  tipItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  tipDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary, marginTop: 6, flexShrink: 0 },
  tipItemText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
});
