import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const BRAND = {
  bg: "#05060A",
  card: "#0E1524",
  primary: "#5F4FEF", // Slightly deepened for premium contrast
  accent: "#22C55E",
  text: "#F1F5F9",
  textMuted: "#94A3B8",
  border: "rgba(255,255,255,0.06)",
};

export default function AbibekaChatScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "ai",
      text: "Hi, I’m Abibeka 🤖\nHow can I help you today?",
    },
  ]);

  const typing = useRef(new Animated.Value(0.4)).current;
  const sendBtnScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(typing, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(typing, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    Animated.spring(sendBtnScale, {
      toValue: input.trim().length > 0 ? 1 : 0.95,
      useNativeDriver: true,
    }).start();
  }, [input]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "ai",
          text: "Got it. Tell me more about that 👀",
        },
      ]);
    }, 800);
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === "user";

    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
        {!isUser && (
          <View style={styles.miniAvatar}>
            <Text style={styles.miniAvatarText}>A</Text>
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
          <Text style={[styles.msgText, isUser ? styles.userMsgText : styles.aiMsgText]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>A</Text>
              </View>
              <Animated.View style={[styles.onlineIndicator, { opacity: typing }]} />
            </View>
            <View>
              <Text style={styles.title}>Abibeka AI</Text>
              <Text style={styles.status}>Enterprise Assistant</Text>
            </View>
          </View>
        </View>

        {/* CHAT PLATFORM */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chat}
          showsVerticalScrollIndicator={false}
        />

        {/* COMPACT INPUT BAR */}
        <View style={styles.inputContainer}>
          <View style={styles.inputBar}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask me anything..."
              placeholderTextColor={BRAND.textMuted}
              style={styles.input}
              multiline={false}
            />

            <Animated.View style={{ transform: [{ scale: sendBtnScale }] }}>
              <TouchableOpacity
                onPress={sendMessage}
                activeOpacity={0.7}
                style={[
                  styles.send,
                  { backgroundColor: input.trim() ? BRAND.primary : "rgba(255,255,255,0.04)" },
                ]}
              >
                <Text style={[styles.sendIcon, { color: input.trim() ? "#FFF" : BRAND.textMuted }]}>
                  ↑
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.bg,
  },

  /* HEADER */
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
    backgroundColor: BRAND.bg,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: BRAND.card,
    borderWidth: 1,
    borderColor: BRAND.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: BRAND.primary,
    fontWeight: "700",
    fontSize: 18,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: BRAND.accent,
    borderWidth: 2,
    borderColor: BRAND.bg,
  },
  title: {
    color: BRAND.text,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  status: {
    color: BRAND.textMuted,
    fontSize: 12,
    marginTop: 2,
  },

  /* CHAT LAYOUT */
  chat: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 110,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 8,
    gap: 10,
  },
  userRow: {
    justifyContent: "flex-end",
  },
  aiRow: {
    justifyContent: "flex-start",
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: BRAND.card,
    borderWidth: 1,
    borderColor: BRAND.border,
    alignItems: "center",
    justifyContent: "center",
  },
  miniAvatarText: {
    color: BRAND.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  aiBubble: {
    backgroundColor: BRAND.card,
    borderWidth: 1,
    borderColor: BRAND.border,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: BRAND.primary,
    borderBottomRightRadius: 4,
  },
  msgText: {
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  aiMsgText: {
    color: BRAND.text,
    fontWeight: "400",
  },
  userMsgText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },

  /* BOTTOM INPUT COMPONENT */
  inputContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 10 : 100,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  inputBar: {
    flexDirection: "row",
    backgroundColor: BRAND.card,
    borderRadius: 16,
    padding: 6,
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: BRAND.border,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  input: {
    flex: 1,
    color: BRAND.text,
    fontSize: 15,
    paddingVertical: 8,
  },
  send: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sendIcon: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 20,
  },
});