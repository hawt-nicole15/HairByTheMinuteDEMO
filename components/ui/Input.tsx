import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  Platform,
} from 'react-native';

// On web, react-native-web renders TextInput as an <input> that shows the
// browser's default blue focus outline, which overflows the styled container.
// We indicate focus on the container instead, so remove that outline.
const webNoOutline = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null;
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export function Input({ label, error, isPassword = false, style, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          focused && styles.focused,
          !!error && styles.errored,
        ]}
      >
        <TextInput
          style={[styles.input, webNoOutline, style]}
          secureTextEntry={isPassword && !visible}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={Colors.textMuted}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setVisible(!visible)} style={styles.eyeBtn}>
            <Ionicons
              name={visible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
  },
  focused: {
    borderColor: Colors.inputFocusBorder,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  errored: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: 4,
    marginLeft: 8,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.error,
  },
});
