import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { BackButton } from '@/components/ui/BackButton';
import { QUESTIONS, TOTAL_STEPS } from '@/constants/questions';
import { UserAnswers } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { QuestionCard } from '@/components/QuestionCard';
import { useHairProfile } from '@/context/HairProfileContext';

// +1 for the hair goals step that follows the questionnaire
const GRAND_TOTAL = TOTAL_STEPS + 1;

export default function OnboardingScreen() {
  const router = useRouter();
  const { setQuestionnaireAnswers } = useHairProfile();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});

  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  const currentQuestion = QUESTIONS[currentStep];
  const hasAnswer = !!answers[currentQuestion.id];
  const isLastStep = currentStep === TOTAL_STEPS - 1;

  const animateTransition = (direction: 'forward' | 'back', callback: () => void) => {
    const outX = direction === 'forward' ? -24 : 24;
    const inX = direction === 'forward' ? 24 : -24;

    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: outX, duration: 160, useNativeDriver: true }),
    ]).start(() => {
      callback();
      translateX.setValue(inX);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleSelect = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (isLastStep) {
      setQuestionnaireAnswers(answers);
      router.push('/hair-goals');
      return;
    }
    animateTransition('forward', () => setCurrentStep((prev) => prev + 1));
  };

  const handleBack = () => {
    if (currentStep === 0) {
      router.back();
      return;
    }
    animateTransition('back', () => setCurrentStep((prev) => prev - 1));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.stepCounter}>
          {currentStep + 1} of {GRAND_TOTAL}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <ProgressBar current={currentStep + 1} total={GRAND_TOTAL} />
      </View>

      {/* Animated question area */}
      <Animated.View
        style={[styles.cardWrapper, { opacity, transform: [{ translateX }] }]}
      >
        <QuestionCard
          question={currentQuestion}
          answers={answers}
          onSelect={handleSelect}
        />
      </Animated.View>

      {/* Next button */}
      <View style={styles.footer}>
        <Button
          label={isLastStep ? 'Set My Goals' : 'Next'}
          onPress={handleNext}
          disabled={!hasAnswer}
          style={[styles.nextBtn, !hasAnswer ? styles.nextBtnDisabled : undefined]}
        />
        {!hasAnswer && (
          <Text style={styles.hintText}>Select an option above to continue</Text>
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
  cardWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    paddingTop: 16,
    gap: 10,
  },
  nextBtn: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  nextBtnDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  hintText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textMuted,
  },
});
