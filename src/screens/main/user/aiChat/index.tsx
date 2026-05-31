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
} from "react-native";

const BRAND = {
  primary: "#0F766E",
  secondary: "#1E3A8A",
  accent: "#22C55E",

  bg: "#04060F",
  card: "#080D1C",

  text: "#F0F4FF",
  muted: "rgba(240,244,255,0.5)",

  border: "rgba(255,255,255,0.08)",
};

export default function AbibekaChatScreen() {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "ai",
      text: "Hi, I'm Abibeka. How are you feeling today?",
    },
  ]);

  const pulse = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.5,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "ai",
          text: "Thank you for sharing that with me. Tell me more.",
        },
      ]);
    }, 1000);
  };

  const renderMessage = ({ item }: any) => {
    const isUser = item.sender === "user";

    return (
      <View
        style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}
      >
        <Text style={styles.bubbleText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🤖 Abibeka AI</Text>

          <View style={styles.statusRow}>
            <Animated.View
              style={[
                styles.liveDot,
                {
                  opacity: pulse,
                },
              ]}
            />

            <Text style={styles.statusText}>Always Available</Text>
          </View>
        </View>
      </View>

      {/* INSIGHT CARD */}

      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>Today's Insight</Text>

        <Text style={styles.insightText}>
          Your stress appears lower than yesterday. Keep going 💚
        </Text>
      </View>

      {/* CHAT */}

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
      />

      {/* QUICK MOODS */}

      <View style={styles.quickMoodRow}>
        {["😊", "😌", "😤", "😔", "😰"].map((m) => (
          <TouchableOpacity
            key={m}
            style={styles.moodChip}
            onPress={() => setInput(m)}
          >
            <Text style={{ fontSize: 20 }}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* INPUT */}

      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Talk to Abibeka..."
          placeholderTextColor={BRAND.muted}
          style={styles.input}
        />

        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendText}>➜</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.bg,
  },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  headerTitle: {
    color: BRAND.text,
    fontSize: 24,
    fontWeight: "800",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BRAND.accent,
    marginRight: 6,
  },

  statusText: {
    color: BRAND.muted,
    fontSize: 12,
  },

  insightCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 16,
    borderRadius: 18,
    backgroundColor: BRAND.card,
    borderWidth: 1,
    borderColor: BRAND.border,
  },

  insightTitle: {
    color: BRAND.primary,
    fontWeight: "700",
    marginBottom: 8,
  },

  insightText: {
    color: BRAND.text,
    lineHeight: 20,
  },

  bubble: {
    maxWidth: "80%",
    padding: 14,
    borderRadius: 18,
    marginVertical: 6,
  },

  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: BRAND.card,
    borderWidth: 1,
    borderColor: BRAND.border,
  },

  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: BRAND.primary,
  },

  bubbleText: {
    color: "#fff",
    lineHeight: 20,
  },

  quickMoodRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },

  moodChip: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: BRAND.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BRAND.border,
  },

  inputRow: {
    flexDirection: "row",
    padding: 20,
    gap: 10,
  },

  input: {
    flex: 1,
    backgroundColor: BRAND.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    color: BRAND.text,
    borderWidth: 1,
    borderColor: BRAND.border,
  },

  sendBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: BRAND.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  sendText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
