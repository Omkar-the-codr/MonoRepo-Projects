import { useState, useEffect } from "react";

function App() {
  const [socket, setSocket] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      console.log("✅ Connected to server");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "WELCOME") {
        setClientId(data.clientId);
      } else {
        setLogs((prev) => [...prev, JSON.stringify(data)]);
      }
    };

    ws.onclose = () => {
      console.log("❌ Disconnected from server");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && clientId && message && to) {
      socket.send(JSON.stringify({ message, to }));
      setMessage("");
    }
  };

  return (
    <>
      <p>
        Your client ID: <strong>{clientId}</strong>
      </p>

      <input
        type="text"
        placeholder="Receiver ID (to)"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>SEND</button>

      <h3>Logs:</h3>
      <ul>
        {logs.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
