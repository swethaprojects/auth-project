import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  reconnection: true,
  reconnectionAttempts: 5, 
  reconnectionDelay: 1000,
});

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  //  Listen for incoming messages
  useEffect(() => {
    socket.on("message", (msg) => {
      console.log(" Message received:", msg);
      setChat((prevChat) => [...prevChat, msg]);
    });

    //  Handle socket connection and disconnection
    socket.on("connect", () => {
      console.log(` Connected to server: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      console.warn(" Disconnected. Trying to reconnect...");
    });

    socket.on("reconnect_attempt", () => {
      console.log("🔁 Attempting to reconnect...");
    });

    //  Cleanup on unmount
    return () => {
      socket.off("message"); // Unsubscribe from 'message' event
      socket.off("connect"); // Unsubscribe from 'connect' event
      socket.off("disconnect"); // Unsubscribe from 'disconnect' event
    };
  }, []);

  //  Send message to backend
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Sending message:", message);
      socket.emit("chatMessage", message);
      setMessage(""); // Clear input
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "10px",
          padding: "10px",
        }}
      >
        {/*  Display chat messages */}
        {chat.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>

      {/*  Message Input Form */}
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatComponent;
