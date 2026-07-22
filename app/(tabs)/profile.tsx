import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView as RNSafeAreaView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Colors } from '@/constants/colors';
import { useHairProfile } from '@/context/HairProfileContext';
import { track } from '@/services/analytics';
import { QUESTIONS } from '@/constants/questions';
import { Question, WashSchedule, GoalCheckIn } from '@/types';

const WASH_SCHEDULE_KEY = 'hbtm_wash_schedule';
const CHECK_INS_KEY = 'hbtm_goal_checkins';
const CHECKIN_INTERVAL_DAYS = 7;
const FREQUENCY_OPTIONS = [5, 7, 10, 14];

const ANSWER_DISPLAY: Record<string, Record<string, string>> = {
  porosity: { high_porosity: 'High porosity', medium_porosity: 'Medium porosity', low_porosity: 'Low porosity' },
  elasticity: { low_elasticity: 'Low elasticity', good_elasticity: 'Good elasticity', damaged_elasticity: 'Damaged elasticity' },
  thickness: { fine: 'Fine strands', medium: 'Medium strands', coarse: 'Coarse strands' },
  curl_pattern: { type_3: 'Type 3', type_4ab: 'Type 4A/4B', type_4c: 'Type 4C' },
  styling_goal: { wash_and_go: 'Wash & gos', twist_braid_out: 'Twist/braid-outs', stretched: 'Stretched styles', protective: 'Protective styles' },
  scalp: { dry_scalp: 'Dry scalp', oily_scalp: 'Oily scalp', balanced_scalp: 'Balanced scalp', sensitive_scalp: 'Sensitive scalp' },
};

const QUESTION_LABELS: Record<string, string> = {
  porosity: 'Porosity', elasticity: 'Elasticity', thickness: 'Strand Thickness',
  curl_pattern: 'Curl Pattern', styling_goal: 'Preferred Style', scalp: 'Scalp Type',
};

const QUESTION_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  porosity: 'water-outline', elasticity: 'resize-outline', thickness: 'options-outline',
  curl_pattern: 'refresh-circle-outline', styling_goal: 'color-wand-outline', scalp: 'leaf-outline',
};

const ALL_GOALS = [
  { value: 'moisture', label: 'Moisture & Hydration' },
  { value: 'growth', label: 'Healthy Growth' },
  { value: 'curl_definition', label: 'Curl Definition' },
  { value: 'protective_maintenance', label: 'Protective Style Care' },
  { value: 'strength', label: 'Strength & Repair' },
  { value: 'scalp_health', label: 'Scalp Health' },
];

const CHECKIN_QUESTIONS: Record<string, string> = {
  moisture: 'How is your hair retaining moisture?',
  growth: 'Are you noticing length retention?',
  curl_definition: 'How\'s your curl definition?',
  protective_maintenance: 'How\'s your protective style holding up?',
  strength: 'Are you experiencing less breakage?',
  scalp_health: 'How\'s your scalp feeling?',
};

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDaysUntilWash(schedule: WashSchedule): number {
  const last = new Date(schedule.lastWashDate + 'T00:00:00');
  const next = new Date(last);
  next.setDate(next.getDate() + schedule.frequencyDays);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((next.getTime() - today.getTime()) / 86400000);
}

function getNextWashDate(schedule: WashSchedule): Date {
  const last = new Date(schedule.lastWashDate + 'T00:00:00');
  const next = new Date(last);
  next.setDate(next.getDate() + schedule.frequencyDays);
  return next;
}

function daysSinceLastCheckIn(checkIns: GoalCheckIn[]): number {
  if (checkIns.length === 0) return Infinity;
  const last = new Date(checkIns[checkIns.length - 1].date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - last.getTime()) / 86400000);
}

async function scheduleWashReminder(nextWashDate: Date) {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;
    await Notifications.cancelAllScheduledNotificationsAsync();
    const trigger = new Date(nextWashDate);
    trigger.setHours(9, 0, 0, 0);
    if (trigger > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Wash Day!',
          body: 'Today is your wash day. Open HBTM for your personalized routine.',
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: trigger },
      });
    }
  } catch {
    // notifications unavailable — fail silently
  }
}

function CalendarPicker({
  value,
  onConfirm,
  onClose,
}: {
  value: string;
  onConfirm: (date: string) => void;
  onClose: () => void;
}) {
  const initDate = value ? new Date(value + 'T00:00:00') : new Date();
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());
  const [selected, setSelected] = useState(value || toDateString(new Date()));

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const todayStr = toDateString(todayDate);

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAY_LABELS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const atMaxMonth =
    viewYear > todayDate.getFullYear() ||
    (viewYear === todayDate.getFullYear() && viewMonth >= todayDate.getMonth());

  const goBack = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const goForward = () => {
    if (atMaxMonth) return;
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const cellDateStr = (day: number) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const isFuture = (day: number) => new Date(viewYear, viewMonth, day) > todayDate;

  return (
    <View>
      <View style={styles.calNavRow}>
        <TouchableOpacity onPress={goBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.calMonthLabel}>{MONTHS[viewMonth]} {viewYear}</Text>
        <TouchableOpacity
          onPress={goForward}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          disabled={atMaxMonth}
          style={atMaxMonth ? { opacity: 0.25 } : undefined}
        >
          <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.calDayRow}>
        {DAY_LABELS.map((d) => (
          <Text key={d} style={styles.calDayLabel}>{d}</Text>
        ))}
      </View>

      <View style={styles.calGrid}>
        {weeks.map((week, wi) => (
          <View key={wi} style={styles.calWeekRow}>
            {week.map((day, di) => {
              if (!day) return <View key={di} style={styles.calCell} />;
              const ds = cellDateStr(day);
              const isSel = ds === selected;
              const isToday = ds === todayStr;
              const future = isFuture(day);
              return (
                <TouchableOpacity
                  key={di}
                  style={[styles.calCell, isSel && styles.calCellSelected, !isSel && isToday && styles.calCellToday]}
                  onPress={() => !future && setSelected(ds)}
                  disabled={future}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.calCellText,
                    isSel && styles.calCellTextSelected,
                    !isSel && isToday && styles.calCellTextToday,
                    future && styles.calCellTextFuture,
                  ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {selected !== todayStr && (
        <TouchableOpacity style={styles.calTodayShortcut} onPress={() => setSelected(todayStr)}>
          <Ionicons name="today-outline" size={14} color={Colors.primary} />
          <Text style={styles.calTodayShortcutText}>Jump to today</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[styles.saveBtn, { marginTop: 16 }]} onPress={() => onConfirm(selected)}>
        <Text style={styles.saveBtnText}>Confirm Date</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modalCancel} onPress={onClose}>
        <Text style={styles.modalCancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

function RatingButton({
  label, value, selected, onPress,
}: { label: string; value: -1 | 0 | 1; selected: boolean; onPress: () => void }) {
  const colors: Record<number, string> = { '-1': Colors.error, 0: Colors.textMuted, 1: '#4CAF50' };
  const selectedColor = colors[value];
  return (
    <TouchableOpacity
      style={[styles.ratingBtn, selected && { backgroundColor: selectedColor, borderColor: selectedColor }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.ratingBtnText, selected && { color: Colors.white }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, clearProfile, setQuestionnaireAnswers, setHairGoals } = useHairProfile();
  const { accountInfo, questionnaireAnswers, hairGoals } = profile;

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingGoals, setEditingGoals] = useState(false);
  const [pendingGoals, setPendingGoals] = useState<Set<string>>(new Set());

  const [washSchedule, setWashSchedule] = useState<WashSchedule | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [checkIns, setCheckIns] = useState<GoalCheckIn[]>([]);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [currentRatings, setCurrentRatings] = useState<Record<string, -1 | 0 | 1>>({});

  useEffect(() => {
    (async () => {
      try {
        const ws = await AsyncStorage.getItem(WASH_SCHEDULE_KEY);
        if (ws) setWashSchedule(JSON.parse(ws));
        const ci = await AsyncStorage.getItem(CHECK_INS_KEY);
        if (ci) setCheckIns(JSON.parse(ci));
      } catch { /* ignore */ }
    })();
  }, []);

  const saveWashSchedule = useCallback(async (schedule: WashSchedule) => {
    setWashSchedule(schedule);
    await AsyncStorage.setItem(WASH_SCHEDULE_KEY, JSON.stringify(schedule));
    scheduleWashReminder(getNextWashDate(schedule));
    track('wash_schedule_set', { frequency_days: schedule.frequencyDays, last_wash_date: schedule.lastWashDate });
  }, []);

  const saveCheckIn = useCallback(async () => {
    const entry: GoalCheckIn = { date: toDateString(new Date()), ratings: currentRatings };
    const updated = [...checkIns, entry];
    setCheckIns(updated);
    await AsyncStorage.setItem(CHECK_INS_KEY, JSON.stringify(updated));
    const improving = Object.values(currentRatings).filter((r) => r === 1).length;
    const worsening = Object.values(currentRatings).filter((r) => r === -1).length;
    track('checkin_completed', { goals_count: hairGoals.length, improving, worsening });
    setShowCheckIn(false);
    setCurrentRatings({});
  }, [checkIns, currentRatings, hairGoals.length]);

  const handleAnswerSelect = (questionId: string, value: string) => {
    setQuestionnaireAnswers({ ...questionnaireAnswers, [questionId]: value });
    track('profile_answer_changed', { question: questionId, answer: value });
    setEditingQuestion(null);
  };

  const openGoalsEdit = () => {
    setPendingGoals(new Set(hairGoals));
    setEditingGoals(true);
  };

  const saveGoals = () => {
    setHairGoals(Array.from(pendingGoals));
    track('goals_updated', { goals_count: pendingGoals.size, goals: Array.from(pendingGoals).join(',') });
    setEditingGoals(false);
  };

  const daysUntil = washSchedule ? getDaysUntilWash(washSchedule) : null;
  const daysSinceCi = daysSinceLastCheckIn(checkIns);
  const checkInDue = daysSinceCi >= CHECKIN_INTERVAL_DAYS;
  const recentCheckIns = checkIns.slice(-3).reverse();

  const handleReset = async () => {
    await clearProfile();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Hair</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Account card */}
        {accountInfo && (
          <View style={styles.profileCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{accountInfo.firstName[0]}{accountInfo.lastName[0]}</Text>
            </View>
            <View>
              <Text style={styles.profileName}>{accountInfo.firstName} {accountInfo.lastName}</Text>
              <Text style={styles.profileEmail}>{accountInfo.email}</Text>
            </View>
          </View>
        )}

        {/* Hair Profile */}
        <Text style={styles.sectionLabel}>HAIR PROFILE</Text>
        {Object.keys(QUESTION_LABELS).map((key) => {
          const answer = questionnaireAnswers[key];
          const display = ANSWER_DISPLAY[key]?.[answer] ?? (answer || 'Tap to set');
          return (
            <TouchableOpacity
              key={key}
              style={styles.answerRow}
              onPress={() => setEditingQuestion(QUESTIONS.find((q) => q.id === key) ?? null)}
              activeOpacity={0.7}
            >
              <View style={styles.answerIconContainer}>
                <Ionicons name={QUESTION_ICONS[key] ?? 'ellipse-outline'} size={18} color={Colors.primary} />
              </View>
              <View style={styles.answerTextGroup}>
                <Text style={styles.answerLabel}>{QUESTION_LABELS[key]}</Text>
                <Text style={styles.answerValue}>{display}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          );
        })}

        {/* Hair Goals */}
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionLabel, { marginBottom: 0 }]}>HAIR GOALS</Text>
          <TouchableOpacity onPress={openGoalsEdit}>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.goalsContainer}>
          {hairGoals.length > 0 ? (
            hairGoals.map((goal) => (
              <View key={goal} style={styles.goalChip}>
                <Text style={styles.goalChipText}>{ALL_GOALS.find((g) => g.value === goal)?.label ?? goal}</Text>
              </View>
            ))
          ) : (
            <TouchableOpacity onPress={openGoalsEdit}>
              <Text style={styles.tapToSetText}>Tap Edit to set your goals</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Wash Schedule */}
        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>WASH SCHEDULE</Text>
        <View style={styles.card}>
          <Text style={styles.cardSubLabel}>How often do you wash?</Text>
          <View style={styles.frequencyRow}>
            {FREQUENCY_OPTIONS.map((days) => (
              <TouchableOpacity
                key={days}
                style={[styles.freqPill, washSchedule?.frequencyDays === days && styles.freqPillSelected]}
                onPress={() => saveWashSchedule({ lastWashDate: washSchedule?.lastWashDate ?? toDateString(new Date()), frequencyDays: days })}
              >
                <Text style={[styles.freqPillText, washSchedule?.frequencyDays === days && styles.freqPillTextSelected]}>
                  Every {days}d
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.lastWashRow}>
            <View>
              <Text style={styles.cardSubLabel}>Last wash</Text>
              <Text style={styles.lastWashDate}>
                {washSchedule
                  ? new Date(washSchedule.lastWashDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'Not set'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <TouchableOpacity
                style={styles.todayBtn}
                onPress={() => saveWashSchedule({ lastWashDate: toDateString(new Date()), frequencyDays: washSchedule?.frequencyDays ?? 7 })}
              >
                <Text style={styles.todayBtnText}>Today</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.calendarIconBtn} onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {daysUntil !== null && (
            <View style={[styles.nextWashBanner, daysUntil <= 0 && styles.nextWashBannerUrgent]}>
              <Ionicons
                name={daysUntil <= 0 ? 'water' : 'calendar-outline'}
                size={15}
                color={daysUntil <= 0 ? Colors.white : Colors.primaryMedium}
              />
              <Text style={[styles.nextWashText, daysUntil <= 0 && styles.nextWashTextUrgent]}>
                {daysUntil <= 0
                  ? 'Wash day — time to cleanse!'
                  : daysUntil === 1
                  ? 'Wash day is tomorrow'
                  : `Next wash day in ${daysUntil} days`}
              </Text>
            </View>
          )}
        </View>

        {/* Goals Progress Check-in */}
        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>PROGRESS CHECK-IN</Text>

        {hairGoals.length === 0 ? (
          <Text style={styles.tapToSetText}>Set your hair goals above to track progress.</Text>
        ) : checkInDue ? (
          <TouchableOpacity style={styles.checkInPrompt} onPress={() => setShowCheckIn(true)}>
            <View style={styles.checkInPromptLeft}>
              <Ionicons name="checkmark-circle-outline" size={24} color={Colors.primary} />
              <View>
                <Text style={styles.checkInPromptTitle}>
                  {checkIns.length === 0 ? 'Start tracking your progress' : 'Weekly check-in due'}
                </Text>
                <Text style={styles.checkInPromptSub}>Takes under a minute</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardSubLabel}>
              Next check-in in {CHECKIN_INTERVAL_DAYS - daysSinceCi} day{CHECKIN_INTERVAL_DAYS - daysSinceCi !== 1 ? 's' : ''}
            </Text>
          </View>
        )}

        {recentCheckIns.length > 0 && (
          <View style={{ marginTop: 12, gap: 8 }}>
            {recentCheckIns.map((ci, i) => (
              <View key={i} style={styles.checkInEntry}>
                <Text style={styles.checkInDate}>
                  {new Date(ci.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
                <View style={styles.checkInDots}>
                  {hairGoals.map((goal) => {
                    const r = ci.ratings[goal];
                    const color = r === 1 ? '#4CAF50' : r === -1 ? Colors.error : Colors.textMuted;
                    return <View key={goal} style={[styles.dot, { backgroundColor: color }]} />;
                  })}
                </View>
                <Text style={styles.checkInSummary}>
                  {Object.values(ci.ratings).filter((r) => r === 1).length} improving
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Dev reset */}
        <TouchableOpacity style={styles.devReset} onPress={handleReset}>
          <Text style={styles.devResetText}>DEV: Reset & restart onboarding</Text>
        </TouchableOpacity>

        {/* Legal footer */}
        <View style={styles.legalFooter}>
          <TouchableOpacity onPress={() => router.push('/legal?doc=terms')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.legalLink}>Terms of Service</Text>
          </TouchableOpacity>
          <Text style={styles.legalDot}>·</Text>
          <TouchableOpacity onPress={() => router.push('/legal?doc=privacy')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <RNSafeAreaView style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Last Wash Date</Text>
            <Text style={styles.modalSubtitle}>When did you last wash your hair?</Text>
            <CalendarPicker
              value={washSchedule?.lastWashDate ?? toDateString(new Date())}
              onConfirm={(date) => {
                saveWashSchedule({ lastWashDate: date, frequencyDays: washSchedule?.frequencyDays ?? 7 });
                setShowDatePicker(false);
              }}
              onClose={() => setShowDatePicker(false)}
            />
          </RNSafeAreaView>
        </View>
      </Modal>

      {/* Answer Edit Modal */}
      <Modal visible={!!editingQuestion} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <RNSafeAreaView style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{editingQuestion?.title}</Text>
            <ScrollView style={{ marginTop: 16 }} showsVerticalScrollIndicator={false}>
              {editingQuestion?.options.map((opt) => {
                const selected = questionnaireAnswers[editingQuestion.id] === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.modalOption, selected && styles.modalOptionSelected]}
                    onPress={() => handleAnswerSelect(editingQuestion.id, opt.value)}
                    activeOpacity={0.75}
                  >
                    <View style={styles.modalOptionText}>
                      <Text style={[styles.modalOptionLabel, selected && { color: Colors.white }]}>{opt.label}</Text>
                      <Text style={[styles.modalOptionDesc, selected && { color: 'rgba(255,255,255,0.75)' }]}>{opt.description}</Text>
                    </View>
                    {selected && <Ionicons name="checkmark" size={18} color={Colors.white} />}
                  </TouchableOpacity>
                );
              })}
              <View style={{ height: 32 }} />
            </ScrollView>
            <TouchableOpacity style={styles.modalCancel} onPress={() => setEditingQuestion(null)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </RNSafeAreaView>
        </View>
      </Modal>

      {/* Goals Edit Modal */}
      <Modal visible={editingGoals} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <RNSafeAreaView style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Your Hair Goals</Text>
            <Text style={styles.modalSubtitle}>Select everything that applies</Text>
            <ScrollView style={{ marginTop: 16 }} showsVerticalScrollIndicator={false}>
              {ALL_GOALS.map((goal) => {
                const selected = pendingGoals.has(goal.value);
                return (
                  <TouchableOpacity
                    key={goal.value}
                    style={[styles.modalOption, selected && styles.modalOptionSelected]}
                    onPress={() => {
                      const next = new Set(pendingGoals);
                      next.has(goal.value) ? next.delete(goal.value) : next.add(goal.value);
                      setPendingGoals(next);
                    }}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.modalOptionLabel, selected && { color: Colors.white }]}>{goal.label}</Text>
                    {selected && <Ionicons name="checkmark" size={18} color={Colors.white} />}
                  </TouchableOpacity>
                );
              })}
              <View style={{ height: 16 }} />
            </ScrollView>
            <TouchableOpacity style={[styles.saveBtn, pendingGoals.size === 0 && styles.saveBtnDisabled]} onPress={saveGoals} disabled={pendingGoals.size === 0}>
              <Text style={styles.saveBtnText}>Save Goals</Text>
            </TouchableOpacity>
          </RNSafeAreaView>
        </View>
      </Modal>

      {/* Goals Check-in Modal */}
      <Modal visible={showCheckIn} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <RNSafeAreaView style={[styles.modalSheet, { maxHeight: '90%' }]}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>How's your hair journey?</Text>
            <Text style={styles.modalSubtitle}>Rate each goal compared to last week</Text>
            <ScrollView style={{ marginTop: 16 }} showsVerticalScrollIndicator={false}>
              {hairGoals.map((goal) => (
                <View key={goal} style={styles.checkInGoalRow}>
                  <Text style={styles.checkInGoalLabel}>{ALL_GOALS.find((g) => g.value === goal)?.label}</Text>
                  <Text style={styles.checkInGoalQuestion}>{CHECKIN_QUESTIONS[goal]}</Text>
                  <View style={styles.ratingRow}>
                    {([[-1, 'Worse'], [0, 'Same'], [1, 'Better']] as [(-1 | 0 | 1), string][]).map(([val, label]) => (
                      <RatingButton
                        key={val}
                        label={label}
                        value={val}
                        selected={currentRatings[goal] === val}
                        onPress={() => setCurrentRatings((prev) => ({ ...prev, [goal]: val }))}
                      />
                    ))}
                  </View>
                </View>
              ))}
              <View style={{ height: 16 }} />
            </ScrollView>
            <TouchableOpacity
              style={[styles.saveBtn, Object.keys(currentRatings).length < hairGoals.length && styles.saveBtnDisabled]}
              onPress={saveCheckIn}
              disabled={Object.keys(currentRatings).length < hairGoals.length}
            >
              <Text style={styles.saveBtnText}>Save Check-in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancel} onPress={() => { setShowCheckIn(false); setCurrentRatings({}); }}>
              <Text style={styles.modalCancelText}>Not now</Text>
            </TouchableOpacity>
          </RNSafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.screenBg },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 24,
    borderWidth: 1, borderColor: Colors.border,
  },
  avatarCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.white, fontSize: 20, fontWeight: '700' },
  profileName: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  profileEmail: { fontSize: 13, color: Colors.textMuted },

  sectionLabel: { fontSize: 11, fontWeight: '700', color: Colors.primaryLight, letterSpacing: 1.5, marginBottom: 12 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 24 },
  editLink: { fontSize: 13, fontWeight: '600', color: Colors.primary },

  answerRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.border,
  },
  answerIconContainer: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.overlay, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  answerTextGroup: { flex: 1 },
  answerLabel: { fontSize: 11, fontWeight: '600', color: Colors.textMuted, letterSpacing: 0.3, marginBottom: 2 },
  answerValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },

  goalsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  goalChip: { backgroundColor: Colors.primary, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  goalChipText: { color: Colors.white, fontSize: 13, fontWeight: '600' },
  tapToSetText: { fontSize: 13, color: Colors.textMuted, fontStyle: 'italic' },

  card: { backgroundColor: Colors.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.border },
  cardSubLabel: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, letterSpacing: 0.5, marginBottom: 10, textTransform: 'uppercase' },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 14 },

  frequencyRow: { flexDirection: 'row', gap: 8 },
  freqPill: {
    flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center', backgroundColor: Colors.white,
  },
  freqPillSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  freqPillText: { fontSize: 13, fontWeight: '600', color: Colors.textMuted },
  freqPillTextSelected: { color: Colors.white },

  lastWashRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lastWashDate: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginTop: 2 },
  todayBtn: { backgroundColor: Colors.overlay, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  todayBtnText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  calendarIconBtn: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.overlay,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border,
  },

  calNavRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, marginBottom: 16 },
  calMonthLabel: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  calDayRow: { flexDirection: 'row', marginBottom: 6 },
  calDayLabel: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600', color: Colors.textMuted },
  calGrid: { gap: 4 },
  calWeekRow: { flexDirection: 'row' },
  calCell: { flex: 1, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  calCellSelected: { backgroundColor: Colors.primary },
  calCellToday: { backgroundColor: Colors.overlay, borderWidth: 1.5, borderColor: Colors.primary },
  calCellText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  calCellTextSelected: { color: Colors.white, fontWeight: '700' },
  calCellTextToday: { color: Colors.primary, fontWeight: '700' },
  calCellTextFuture: { color: Colors.border },
  calTodayShortcut: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 12, paddingVertical: 6 },
  calTodayShortcutText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },

  nextWashBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 14, backgroundColor: Colors.overlay, borderRadius: 10, padding: 10,
  },
  nextWashBannerUrgent: { backgroundColor: Colors.primary },
  nextWashText: { fontSize: 13, fontWeight: '600', color: Colors.primaryMedium },
  nextWashTextUrgent: { color: Colors.white },

  checkInPrompt: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, borderRadius: 14, padding: 16,
    borderWidth: 1.5, borderColor: Colors.primary,
  },
  checkInPromptLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkInPromptTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  checkInPromptSub: { fontSize: 12, color: Colors.textMuted },

  checkInEntry: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: 12, padding: 14, borderWidth: 1, borderColor: Colors.border, gap: 12,
  },
  checkInDate: { fontSize: 13, fontWeight: '600', color: Colors.textMuted, width: 48 },
  checkInDots: { flexDirection: 'row', gap: 5, flex: 1 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  checkInSummary: { fontSize: 12, color: Colors.textMuted },

  checkInGoalRow: { marginBottom: 20 },
  checkInGoalLabel: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  checkInGoalQuestion: { fontSize: 12, color: Colors.textMuted, marginBottom: 10 },
  ratingRow: { flexDirection: 'row', gap: 8 },
  ratingBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5,
    borderColor: Colors.border, alignItems: 'center',
  },
  ratingBtnText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },

  /* Modals */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 8 : 20,
    maxHeight: '80%',
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  modalSubtitle: { fontSize: 13, color: Colors.textMuted, marginTop: 4 },
  modalOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.screenBg, borderRadius: 12, padding: 14, marginBottom: 8,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  modalOptionSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  modalOptionText: { flex: 1, marginRight: 8 },
  modalOptionLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  modalOptionDesc: { fontSize: 12, color: Colors.textMuted },
  modalCancel: { alignItems: 'center', paddingVertical: 14 },
  modalCancelText: { fontSize: 14, color: Colors.textMuted, fontWeight: '500' },

  saveBtn: {
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', marginTop: 4,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  saveBtnDisabled: { backgroundColor: Colors.textMuted, shadowOpacity: 0, elevation: 0 },
  saveBtnText: { color: Colors.white, fontSize: 15, fontWeight: '700' },

  devReset: {
    alignSelf: 'center', marginTop: 32, paddingVertical: 10, paddingHorizontal: 16,
    borderRadius: 8, backgroundColor: Colors.errorLight, borderWidth: 1, borderColor: Colors.error,
  },
  devResetText: { color: Colors.error, fontSize: 12, fontWeight: '600' },

  legalFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24 },
  legalLink: { fontSize: 12, color: Colors.primaryMedium, fontWeight: '600' },
  legalDot: { fontSize: 12, color: Colors.primaryLight },
});
