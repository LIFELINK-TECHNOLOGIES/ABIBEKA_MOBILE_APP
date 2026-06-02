import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from "react-native";

const { width, height } = Dimensions.get("window");

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "user" | "ai";

interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────
const TypingIndicator: React.FC = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -6,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(600),
        ]),
      );

    Animated.parallel([
      animateDot(dot1, 0),
      animateDot(dot2, 180),
      animateDot(dot3, 360),
    ]).start();
  }, []);

  return (
    <View style={styles.typingBubble}>
      <View style={styles.avatarSmall}>
        <Text style={styles.avatarSmallText}>A</Text>
      </View>
      <View style={styles.dotRow}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            style={[styles.dot, { transform: [{ translateY: dot }] }]}
          />
        ))}
      </View>
    </View>
  );
};

// ─── Message Bubble ───────────────────────────────────────────────────────────
const MessageBubble: React.FC<{ message: Message; index: number }> = ({
  message,
  index,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isUser = message.role === "user";
  const timeStr = message.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Animated.View
      style={[
        styles.messageRow,
        isUser ? styles.messageRowUser : styles.messageRowAi,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      {!isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
          <View style={styles.avatarPulse} />
        </View>
      )}

      <View
        style={[
          styles.bubbleWrapper,
          isUser ? styles.bubbleWrapperUser : styles.bubbleWrapperAi,
        ]}
      >
        <View
          style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAi]}
        >
          <Text
            style={[
              styles.bubbleText,
              isUser ? styles.bubbleTextUser : styles.bubbleTextAi,
            ]}
          >
            {message.text}
          </Text>
        </View>
        <Text
          style={[
            styles.timestamp,
            isUser ? styles.timestampUser : styles.timestampAi,
          ]}
        >
          {timeStr}
        </Text>
      </View>

      {isUser && (
        <View style={styles.avatarUser}>
          <Text style={styles.avatarText}>U</Text>
        </View>
      )}
    </Animated.View>
  );
};

// ─── Send Button ──────────────────────────────────────────────────────────────
const SendButton: React.FC<{ onPress: () => void; disabled: boolean }> = ({
  onPress,
  disabled,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.88,
      useNativeDriver: true,
      tension: 200,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
    }).start();
    if (!disabled) onPress();
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.sendBtn,
          disabled && styles.sendBtnDisabled,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.sendIcon}>↑</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─── Quick Suggestions ────────────────────────────────────────────────────────
const SUGGESTIONS = [
  "Tell me something interesting",
  "Help me brainstorm ideas",
  "Write a short poem",
  "Explain quantum computing",
];

const QuickSuggestions: React.FC<{ onSelect: (text: string) => void }> = ({
  onSelect,
}) => (
  <View style={styles.suggestionsContainer}>
    <Text style={styles.suggestionsLabel}>Try asking…</Text>
    <View style={styles.suggestionsRow}>
      {SUGGESTIONS.map((s, i) => (
        <TouchableOpacity
          key={i}
          style={styles.suggestionChip}
          onPress={() => onSelect(s)}
          activeOpacity={0.7}
        >
          <Text style={styles.suggestionText}>{s}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// ─── Mock AI Response ─────────────────────────────────────────────────────────
const AI_RESPONSES: Record<string, string> = {
  default:
    "That's a fascinating question! I'd love to explore this topic with you further. What aspect interests you most?",
  hello:
    "Hello! I'm Abibeka, your AI companion. I'm here to think, create, and explore ideas with you. What's on your mind?",
  poem: "Here's one for you:\n\n*Words fall like rain at dusk,\nSilver threads on quiet glass—\nThoughts become the husk.*",
  quantum:
    "Quantum computing harnesses quantum mechanics — superposition and entanglement — to process information in fundamentally different ways than classical computers. Instead of bits (0 or 1), it uses qubits that can exist in multiple states simultaneously, enabling certain calculations at extraordinary speed.",
  brainstorm:
    "Great! Let's ideate. What's the domain? A product, a story, a solution to a problem? Give me a seed and I'll help you grow a forest of ideas.",
};

const getMockResponse = (input: string): string => {
  const lower = input.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi"))
    return AI_RESPONSES.hello;
  if (lower.includes("poem")) return AI_RESPONSES.poem;
  if (lower.includes("quantum")) return AI_RESPONSES.quantum;
  if (lower.includes("brainstorm")) return AI_RESPONSES.brainstorm;
  return AI_RESPONSES.default;
};

// ─── Header ───────────────────────────────────────────────────────────────────
const ChatHeader: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.35,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>A</Text>
          <Animated.View
            style={[
              styles.headerOnlineDot,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
        </View>
        <View>
          <Text style={styles.headerName}>Abibeka</Text>
          <Text style={styles.headerStatus}>AI · Always ready</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.headerMenuBtn} activeOpacity={0.7}>
        <Text style={styles.headerMenuIcon}>⋯</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const AbibekaChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "ai",
      text: "Hi there! I'm Abibeka. Ask me anything — I'm here to help, create, and explore with you.",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(headerSlide, {
        toValue: 0,
        tension: 80,
        friction: 12,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text ?? inputText).trim();
      if (!content) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        text: content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputText("");
      setIsTyping(true);
      scrollToBottom();

      // Simulate AI thinking delay
      const delay = 1200 + Math.random() * 1000;
      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: getMockResponse(content),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
        scrollToBottom();
      }, delay);
    },
    [inputText],
  );

  const showSuggestions = messages.length <= 1 && !isTyping;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />

      {/* Background gradient layers */}
      <View style={styles.bgLayer1} />
      <View style={styles.bgLayer2} />
      <View style={styles.bgOrb1} />
      <View style={styles.bgOrb2} />

      <Animated.View
        style={[
          styles.container,
          { opacity: headerOpacity, transform: [{ translateY: headerSlide }] },
        ]}
      >
        <ChatHeader />
      </Animated.View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <MessageBubble message={item} index={index} />
          )}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <>
              {isTyping && <TypingIndicator />}
              {showSuggestions && (
                <QuickSuggestions onSelect={(s) => sendMessage(s)} />
              )}
            </>
          }
          onContentSizeChange={scrollToBottom}
        />

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <View style={styles.inputWrapper}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Message Abibeka…"
              placeholderTextColor="#4a4a6a"
              multiline
              maxLength={1000}
              returnKeyType="send"
              onSubmitEditing={() => sendMessage()}
              blurOnSubmit={false}
            />
            <SendButton
              onPress={() => sendMessage()}
              disabled={!inputText.trim() || isTyping}
            />
          </View>
          <Text style={styles.inputHint}>
            Abibeka can make mistakes. Verify important info.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const ACCENT = "#7c6aff";
const ACCENT2 = "#ff6ac1";
const BG = "#0a0a0f";
const SURFACE = "#13131f";
const SURFACE2 = "#1c1c2e";
const TEXT = "#eeeef5";
const TEXT_MUTED = "#6b6b8a";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
    paddingTop: 23,
  },
  flex: { flex: 1 },

  // Background layers
  bgLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BG,
  },
  bgLayer2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(124, 106, 255, 0.03)",
  },
  bgOrb1: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(124,106,255,0.07)",
    top: -80,
    right: -80,
  },
  bgOrb2: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(255,106,193,0.05)",
    bottom: 200,
    left: -60,
  },

  // Header
  container: { zIndex: 10 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
    backgroundColor: "rgba(10,10,15,0.95)",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  headerAvatarText: { color: "#fff", fontWeight: "700", fontSize: 17 },
  headerOnlineDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4ade80",
    bottom: 1,
    right: 1,
    borderWidth: 2,
    borderColor: BG,
  },
  headerName: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  headerStatus: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginTop: 1,
  },
  headerMenuBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: SURFACE2,
    alignItems: "center",
    justifyContent: "center",
  },
  headerMenuIcon: { color: TEXT_MUTED, fontSize: 18, lineHeight: 20 },

  // Messages
  messageList: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 12,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
    gap: 8,
  },
  messageRowUser: { justifyContent: "flex-end" },
  messageRowAi: { justifyContent: "flex-start" },
  bubbleWrapper: { maxWidth: width * 0.72 },
  bubbleWrapperUser: { alignItems: "flex-end" },
  bubbleWrapperAi: { alignItems: "flex-start" },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleUser: {
    backgroundColor: ACCENT,
    borderBottomRightRadius: 4,
  },
  bubbleAi: {
    backgroundColor: SURFACE2,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(124,106,255,0.15)",
  },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  bubbleTextUser: { color: "#fff" },
  bubbleTextAi: { color: TEXT },
  timestamp: { fontSize: 10, marginTop: 4, color: TEXT_MUTED },
  timestampUser: { textAlign: "right" },
  timestampAi: { textAlign: "left" },

  // Avatar
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  avatarPulse: {
    position: "absolute",
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: "rgba(124,106,255,0.4)",
  },
  avatarUser: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: SURFACE2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSmallText: { color: "#fff", fontWeight: "700", fontSize: 11 },

  // Typing indicator
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  dotRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: SURFACE2,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(124,106,255,0.15)",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: ACCENT,
  },

  // Suggestions
  suggestionsContainer: { paddingHorizontal: 4, marginTop: 12 },
  suggestionsLabel: {
    color: TEXT_MUTED,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  suggestionsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  suggestionChip: {
    backgroundColor: SURFACE2,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(124,106,255,0.25)",
  },
  suggestionText: { color: TEXT, fontSize: 13 },

  // Input bar
  inputBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
    backgroundColor: "rgba(10,10,15,0.97)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: SURFACE2,
    borderRadius: 28,
    paddingLeft: 18,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(124,106,255,0.2)",
    gap: 8,
  },
  input: {
    flex: 1,
    color: TEXT,
    fontSize: 15,
    lineHeight: 22,
    maxHeight: 120,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  sendBtnDisabled: { backgroundColor: SURFACE, opacity: 0.5 },
  sendIcon: { color: "#fff", fontSize: 18, fontWeight: "700" },
  inputHint: {
    color: TEXT_MUTED,
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
    opacity: 0.7,
  },
});

export default AbibekaChatScreen;
