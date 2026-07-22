import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useHairProfile } from '@/context/HairProfileContext';
import { sendChatMessage, buildTrackingContext, ChatMessage, NIA_OPENER } from '@/services/gemini';
import { track } from '@/services/analytics';
import { DailyLog, TreatmentEntry } from '@/types';

const DAILY_LOG_KEY = 'hbtm_daily_log';
const TREATMENT_HISTORY_KEY = 'hbtm_treatment_history';
const PRODUCT_USAGE_KEY = 'hbtm_product_usage';
const TODAY = new Date().toISOString().split('T')[0];

const SUGGESTED_PROMPTS = [
  'What products work best for my hair?',
  'How do I keep my hair moisturized?',
  'What is the LOC method?',
  'How do I reduce breakage?',
  'Tips for my wash day?',
];

const NIA_INTRO: ChatMessage = {
  id: 'intro',
  role: 'model',
  text: NIA_OPENER,
};

const markdownStyles = {
  body: { fontSize: 14, lineHeight: 20, color: Colors.textPrimary },
  paragraph: { marginTop: 0, marginBottom: 4 },
  bullet_list: { marginVertical: 4 },
  ordered_list: { marginVertical: 4 },
  list_item: { marginBottom: 2 },
  strong: { fontWeight: '700' as const },
  em: { fontStyle: 'italic' as const },
  code_inline: { backgroundColor: Colors.screenBg, borderRadius: 4, paddingHorizontal: 4 },
};

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowCassi]}>
      {!isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>C</Text>
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleCassi]}>
        {isUser ? (
          <Text style={styles.bubbleTextUser}>{message.text}</Text>
        ) : (
          <Markdown style={markdownStyles}>{message.text}</Markdown>
        )}
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const { profile } = useHairProfile();
  const [messages, setMessages] = useState<ChatMessage[]>([NIA_INTRO]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [treatmentHistory, setTreatmentHistory] = useState<TreatmentEntry[]>([]);
  const [usedProducts, setUsedProducts] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const [dl, th, pu] = await Promise.all([
            AsyncStorage.getItem(DAILY_LOG_KEY),
            AsyncStorage.getItem(TREATMENT_HISTORY_KEY),
            AsyncStorage.getItem(PRODUCT_USAGE_KEY),
          ]);
          if (th) setTreatmentHistory(JSON.parse(th));
          if (pu) setUsedProducts(JSON.parse(pu));
          if (dl) {
            const parsed: DailyLog = JSON.parse(dl);
            setDailyLog(parsed.date === TODAY ? parsed : null);
          }
        } catch { /* ignore */ }
      })();
    }, [])
  );

  const history = messages.filter((m) => m.id !== 'intro');

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || sending) return;
      const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setSending(true);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);

      try {
        track('chat_message_sent', { message_index: history.length });
        const tracking = buildTrackingContext(dailyLog, treatmentHistory, usedProducts);
        const reply = await sendChatMessage(history, text.trim(), profile, tracking);
        const niaMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: reply };
        setMessages((prev) => [...prev, niaMsg]);
      } catch (e) {
        const errMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: e instanceof Error ? e.message : "I'm having trouble connecting right now.",
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setSending(false);
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
      }
    },
    [sending, history, profile, dailyLog, treatmentHistory, usedProducts],
  );

  const showSuggestions = messages.length === 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>C</Text>
        </View>
        <View>
          <Text style={styles.headerName}>Cassi</Text>
          <Text style={styles.headerRole}>Your hair care guide</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          ListFooterComponent={
            showSuggestions ? (
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsLabel}>Try asking:</Text>
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <TouchableOpacity
                    key={prompt}
                    style={styles.suggestionChip}
                    onPress={() => { track('suggestion_tapped', { prompt }); send(prompt); }}
                  >
                    <Text style={styles.suggestionChipText}>{prompt}</Text>
                    <Ionicons name="arrow-forward" size={13} color={Colors.primaryMedium} />
                  </TouchableOpacity>
                ))}
              </View>
            ) : null
          }
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask Cassi anything about your hair…"
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={500}
            submitBehavior="newline"
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || sending) && styles.sendBtnDisabled]}
            onPress={() => send(input)}
            disabled={!input.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Ionicons name="send" size={18} color={Colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.screenBg,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerRole: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  bubbleRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  bubbleRowUser: {
    justifyContent: 'flex-end',
  },
  bubbleRowCassi: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    flexShrink: 0,
  },
  avatarText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleCassi: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextUser: {
    color: Colors.white,
  },
  bubbleTextCassi: {
    color: Colors.textPrimary,
  },

  /* Suggestions */
  suggestionsContainer: {
    marginTop: 16,
    gap: 8,
    paddingHorizontal: 4,
  },
  suggestionsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 4,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  suggestionChipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },

  /* Input bar */
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: 12,
    gap: 10,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.screenBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
});
