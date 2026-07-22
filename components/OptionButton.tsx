import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { QuestionOption } from '@/types';

interface OptionButtonProps {
  option: QuestionOption;
  selected: boolean;
  onSelect: (value: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function OptionButton({ option, selected, onSelect, icon }: OptionButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.containerSelected]}
      onPress={() => onSelect(option.value)}
      activeOpacity={0.75}
    >
      {icon && (
        <View style={[styles.iconContainer, selected && styles.iconContainerSelected]}>
          <Ionicons name={icon} size={22} color={selected ? Colors.white : Colors.primary} />
        </View>
      )}
      <View style={styles.textGroup}>
        <Text style={[styles.label, selected && styles.labelSelected]}>{option.label}</Text>
        <Text style={[styles.description, selected && styles.descriptionSelected]}>
          {option.description}
        </Text>
      </View>
      <View style={[styles.checkCircle, selected && styles.checkCircleSelected]}>
        {selected && <Ionicons name="checkmark" size={13} color={Colors.white} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.optionBorder,
    borderRadius: 14,
    padding: 16,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  containerSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconContainerSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  textGroup: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  labelSelected: {
    color: Colors.white,
  },
  description: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  descriptionSelected: {
    color: 'rgba(255,255,255,0.75)',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.optionBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSelected: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderColor: 'rgba(255,255,255,0.5)',
  },
});
