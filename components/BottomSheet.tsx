import React, { useRef, useEffect, ReactNode } from 'react';
import {
  Modal,
  View,
  Animated,
  PanResponder,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

const USE_NATIVE = Platform.OS !== 'web';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  maxHeightPct?: number;
}

// A bottom sheet you can swipe down (via the grab handle) or tap the backdrop
// to dismiss. Replaces the plain Modal sheets so the handle actually works.
export function BottomSheet({ visible, onClose, children, maxHeightPct = 0.85 }: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const screenH = Dimensions.get('window').height;
  const translateY = useRef(new Animated.Value(screenH)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(screenH);
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 260, useNativeDriver: USE_NATIVE }),
        Animated.timing(backdrop, { toValue: 1, duration: 260, useNativeDriver: USE_NATIVE }),
      ]).start();
    }
  }, [visible, screenH, translateY, backdrop]);

  const close = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: screenH, duration: 200, useNativeDriver: USE_NATIVE }),
      Animated.timing(backdrop, { toValue: 0, duration: 200, useNativeDriver: USE_NATIVE }),
    ]).start(() => onClose());
  };

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 4 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 110 || g.vy > 0.8) {
          close();
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: USE_NATIVE, bounciness: 2 }).start();
        }
      },
    }),
  ).current;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={close}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={close}>
          <Animated.View style={[styles.backdrop, { opacity: backdrop }]} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            styles.sheet,
            { maxHeight: screenH * maxHeightPct, paddingBottom: insets.bottom + 12, transform: [{ translateY }] },
          ]}
        >
          <View {...pan.panHandlers} style={styles.handleArea}>
            <View style={styles.handle} />
          </View>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  handleArea: { alignItems: 'center', paddingTop: 8, paddingBottom: 12 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border },
});
