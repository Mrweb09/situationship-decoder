import { useState } from "react";
import "./App.css";

export default function App() {
  const [conversation, setConversation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyseConversation = async () => {
    if (!conversation.trim()) {
      alert("Paste a conversation first!");
      return;
    }
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "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",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: `You are the Situationship Decoder. Analyse this conversation and respond ONLY with a valid JSON object, no extra text, no markdown, no backticks. Use exactly this format:
{"verdict":"one punchy sentence","status":"one of: Ghosting Incoming / Breadcrumbing / Lowkey Interested / Catching Feelings / Rizz Detected","confidence":72,"explanation":"2-3 sentences of brutal honest analysis","replies":["safe reply","bold reply","unhinged reply"]}

Conversation to analyse:
${conversation}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "API error");
      }

      const data = await response.json();
      const text = data.content[0].text.trim();
      const parsed = JSON.parse(text);
      setResult(parsed);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Check your API key.");
    }

    setLoading(false);
  };

  const statusColors = {
    "Ghosting Incoming": "#ff4444",
    Breadcrumbing: "#ff8800",
    "Lowkey Interested": "#ffcc00",
    "Catching Feelings": "#44bbff",
    "Rizz Detected": "#44ff88",
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>💀 Situationship Decoder</h1>
          <p style={styles.subtitle}>Find out where you actually stand</p>
        </div>

        {!result && !loading && (
          <div style={styles.inputSection}>
            <textarea
              style={styles.textarea}
              placeholder="Paste your conversation here..."
              value={conversation}
              onChange={(e) => setConversation(e.target.value)}
            />
            {error && <p style={styles.errorText}>⚠️ {error}</p>}
            <button style={styles.button} onClick={analyseConversation}>
              Decode My Situation 💀
            </button>
          </div>
        )}

        {loading && (
          <div style={styles.loadingSection}>
            <div className="spinner" />
            <p style={styles.loadingText}>Reading between the lines... 👀</p>
          </div>
        )}

        {result && (
          <div style={styles.resultsSection}>
            <div
              style={{
                ...styles.statusBadge,
                backgroundColor: (statusColors[result.status] || "#888") + "22",
                border: `1px solid ${statusColors[result.status] || "#888"}`,
                color: statusColors[result.status] || "#888",
              }}
            >
              {result.status}
            </div>

            <div style={styles.verdictBox}>
              <p style={styles.verdictLabel}>THE VERDICT</p>
              <h2 style={styles.verdict}>"{result.verdict}"</h2>
            </div>

            <div style={styles.confidenceSection}>
              <div style={styles.confidenceHeader}>
                <span style={styles.confidenceLabel}>Interest Level</span>
                <span style={styles.confidenceNumber}>{result.confidence}%</span>
              </div>
              <div style={styles.confidenceTrack}>
                <div
                  style={{
                    ...styles.confidenceFill,
                    width: `${result.confidence}%`,
                    backgroundColor:
                      result.confidence > 60
                        ? "#44ff88"
                        : result.confidence > 30
                        ? "#ffcc00"
                        : "#ff4444",
                  }}
                />
              </div>
            </div>

            <p style={styles.explanation}>{result.explanation}</p>

            <div style={styles.repliesSection}>
              <p style={styles.repliesHeading}>🔥 How to Reply</p>
              {Array.isArray(result.replies) &&
                result.replies.map((reply, i) => (
                  <div
                    key={i}
                    style={styles.replyCard}
                    onClick={() => {
                      navigator.clipboard.writeText(reply);
                      alert("Copied to clipboard!");
                    }}
                  >
                    <span style={styles.replyTag}>
                      {i === 0 ? "😇 Safe" : i === 1 ? "😏 Bold" : "💀 Unhinged"}
                    </span>
                    <p style={styles.replyText}>{reply}</p>
                    <span style={styles.tapToCopy}>tap to copy</span>
                  </div>
                ))}
            </div>

            <button
              style={styles.resetButton}
              onClick={() => {
                setResult(null);
                setConversation("");
                setError(null);
              }}
            >
              Decode Another 🔄
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0a0a1f 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "28px",
    padding: "40px 36px",
    maxWidth: "580px",
    width: "100%",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "2.4rem",
    fontWeight: "900",
    background: "linear-gradient(135deg, #ff6eb4, #a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 8px 0",
  },
  subtitle: {
    color: "rgba(255,255,255,0.35)",
    margin: "0",
    fontSize: "0.95rem",
    letterSpacing: "0.03em",
  },
  inputSection: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  textarea: {
    width: "100%",
    minHeight: "200px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "14px",
    padding: "16px",
    color: "white",
    fontSize: "0.95rem",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
    lineHeight: "1.6",
  },
  errorText: {
    color: "#ff6b6b",
    margin: "0",
    fontSize: "0.9rem",
    textAlign: "center",
  },
  button: {
    width: "100%",
    padding: "17px",
    background: "linear-gradient(135deg, #ff6eb4, #a855f7)",
    border: "none",
    borderRadius: "14px",
    color: "white",
    fontSize: "1.1rem",
    fontWeight: "800",
    cursor: "pointer",
    letterSpacing: "0.02em",
  },
  loadingSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    padding: "40px 0",
  },
  loadingText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "1rem",
    margin: "0",
  },
  resultsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },
  statusBadge: {
    display: "inline-block",
    padding: "8px 18px",
    borderRadius: "999px",
    fontSize: "0.82rem",
    fontWeight: "800",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    alignSelf: "flex-start",
  },
  verdictBox: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "20px",
  },
  verdictLabel: {
    color: "rgba(255,255,255,0.3)",
    fontSize: "0.7rem",
    fontWeight: "800",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    margin: "0 0 8px 0",
  },
  verdict: {
    color: "white",
    fontSize: "1.25rem",
    fontWeight: "700",
    margin: "0",
    lineHeight: "1.5",
  },
  confidenceSection: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  confidenceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  confidenceLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "0.88rem",
  },
  confidenceNumber: {
    color: "white",
    fontWeight: "800",
    fontSize: "1rem",
  },
  confidenceTrack: {
    height: "10px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "999px",
    overflow: "hidden",
  },
  confidenceFill: {
    height: "100%",
    borderRadius: "999px",
  },
  explanation: {
    color: "rgba(255,255,255,0.65)",
    lineHeight: "1.7",
    margin: "0",
    fontSize: "0.97rem",
  },
  repliesSection: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  repliesHeading: {
    color: "white",
    fontWeight: "800",
    margin: "0 0 4px 0",
    fontSize: "1rem",
  },
  replyCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "14px 16px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  replyTag: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.35)",
    fontWeight: "700",
    letterSpacing: "0.04em",
  },
  replyText: {
    color: "white",
    margin: "0",
    fontSize: "0.95rem",
    lineHeight: "1.5",
  },
  tapToCopy: {
    fontSize: "0.7rem",
    color: "rgba(255,255,255,0.2)",
  },
  resetButton: {
    width: "100%",
    padding: "15px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
    color: "rgba(255,255,255,0.7)",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
  },
};