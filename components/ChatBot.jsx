import { useState } from "react";
import "../tailwind.config.mjs";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { API_KEY } from "./config.js";

const systemMessage = {
  role: "system",
  content:
    "Explain things like you're talking to a student who is trying to seek career guidance and you have to be that student's personal mental Health companion.",
};

function ChatBot() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Mental Health Bot! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  // async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
  //   // Format messages for chatGPT API
  //   // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
  //   // So we need to reformat

  //   let apiMessages = chatMessages.map((messageObject) => {
  //     let role = "";
  //     if (messageObject.sender === "ChatGPT") {
  //       role = "assistant";
  //     } else {
  //       role = "user";
  //     }
  //     return { role: role, content: messageObject.message}
  //   });

  //   // Get the request body set up with the model we plan to use
  //   // and the messages which we formatted above. We add a system message in the front to'
  //   // determine how we want chatGPT to act.
  //   const apiRequestBody = {
  //     "model": "gpt-3.5-turbo",
  //     "messages": [
  //       systemMessage,  // The system message DEFINES the logic of our chatGPT
  //       ...apiMessages // The messages from our chat with ChatGPT
  //     ]
  //   }

  //   await fetch("https://api.openai.com/v1/chat/completions",
  //   {
  //     method: "POST",
  //     headers: {
  //       "Authorization": "Bearer " + API_KEY,
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify(apiRequestBody)
  //   }).then((data) => {
  //     return data.json();
  //   }).then((data) => {
  //     console.log(data);
  //     setMessages([...chatMessages, {
  //       message: data.choices[0].message.content,
  //       sender: "ChatGPT"
  //     }]);
  //     setIsTyping(false);
  //   });
  // }
  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "llama3-70b-8192", // or any other supported model
      messages: [systemMessage, ...apiMessages],
    };

    await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setIsTyping(false);
      });
  }

  return (
    <MainContainer
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "12px",
        boxShadow: "2px 2px 10px 1px #333",
      }}
    >
      <ChatContainer>
        <MessageList
          scrollBehavior="smooth"
          typingIndicator={
            isTyping ? (
              <TypingIndicator content="Mental Health Bot is typing" />
            ) : null
          }
        >
          {messages.map((message, i) => {
            return <Message key={i} model={message} />;
          })}
        </MessageList>
        <MessageInput placeholder="Type message here" onSend={handleSend} />
      </ChatContainer>
    </MainContainer>
  );
}
export default ChatBot;
