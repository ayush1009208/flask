"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const Home: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    axios
      .get<{ message: string }>("http://127.0.0.1:5000/about")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Next.js + Flask</h1>
      <p style={styles.message}>{message}</p>
    </div>
  );
};

// Inline styling
const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f0f4f8",
    fontFamily: "'Roboto', sans-serif",
  },
  header: {
    fontSize: "2.5rem",
    color: "#333",
    marginBottom: "1rem",
  },
  message: {
    fontSize: "1.2rem",
    color: "#555",
    textAlign: "center" as const,
    maxWidth: "600px",
  },
};

export default Home;
