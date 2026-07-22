import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Question, UserAnswers } from '@/types';
import { OptionButton } from '@/components/OptionButton';

const QUESTION_IMAGES: Record<string, ReturnType<typeof require>> = {
  porosity: require('@/assets/images/questions/porosity.jpg'),
  elasticity: require('@/assets/images/questions/elasticity.jpg'),
  thickness: require('@/assets/images/questions/thickness.jpg'),
  curl_pattern: require('@/assets/images/questions/curl_pattern.jpg'),
  styling_goal: require('@/assets/images/questions/styling_goal.jpg'),
  scalp: require('@/assets/images/questions/scalp.jpg'),
};


interface QuestionCardProps {
  question: Question;
  answers: UserAnswers;
  onSelect: (questionId: string, value: string) => void;
}

export function QuestionCard({ question, answers, onSelect }: QuestionCardProps) {
  const selectedValue = answers[question.id];
  const image = QUESTION_IMAGES[question.id];

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {image ? (
        <Image source={image} style={styles.questionImage} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={36} color={Colors.textMuted} />
          <Text style={styles.imagePlaceholderText}>Photo coming soon</Text>
        </View>
      )}

      <Text style={styles.category}>{question.category.toUpperCase()}</Text>
      <Text style={styles.title}>{question.title}</Text>
      <Text style={styles.question}>{question.question}</Text>

      <View style={styles.subtitleRow}>
        <Ionicons name="information-circle-outline" size={15} color={Colors.primaryLight} />
        <Text style={styles.subtitle}>{question.subtitle}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {question.options.map((option) => (
          <OptionButton
            key={option.id}
            option={option}
            selected={selectedValue === option.value}
            onSelect={(value) => onSelect(question.id, value)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  questionImage: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    marginBottom: 24,
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.border,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
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
    marginBottom: 10,
    lineHeight: 28,
  },
  question: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 24,
    backgroundColor: Colors.overlay,
    padding: 10,
    borderRadius: 10,
  },
  subtitle: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  optionsContainer: {
    gap: 10,
  },
});
