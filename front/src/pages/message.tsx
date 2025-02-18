import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  content: string;
  sender: "user" | "other";
  timestamp: Date;
}

const MessageData: Message[] = [
  {
    id: "1",
    content: "Hi there!",
    sender: "other",
    timestamp: new Date(Date.now() - 1000000),
  },
  {
    id: "2",
    content: "Hello! How can I help you today?",
    sender: "user",
    timestamp: new Date(Date.now() - 900000),
  },
  {
    id: "3",
    content: "I was wondering if you could tell me more about your services.",
    sender: "other",
    timestamp: new Date(Date.now() - 800000),
  },
  {
    id: "4",
    content: "Of course! We offer a wide range of services including...",
    sender: "user",
    timestamp: new Date(Date.now() - 700000),
  },
  {
    id: "5",
    content: "That sounds great! Can you provide more details?",
    sender: "other",
    timestamp: new Date(Date.now() - 600000),
  },
  {
    id: "6",
    content: "Sure, I'd be happy to. What specifically are you interested in?",
    sender: "user",
    timestamp: new Date(Date.now() - 500000),
  },
];

const MessageInterface = () => {
  const [messages, setMessages] = useState<Message[]>(MessageData);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = (sender: "user" | "other") => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: sender,
        timestamp: new Date(),
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend("user");
    }
  };

  return (
    <main className="w-full h-[600px] flex flex-col">
      <ScrollArea className="h-[700px] w-full p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.sender === "user" ? "flex-row-reverse" : "justify-start"
              }`}
            >
              {message.sender === "other" ? (
                <div className="rounded-full bg-emerald-800 w-10 h-10"></div>
              ) : null}
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-emerald-200 text-gray-900 rounded-tr-none"
                    : "bg-gray-100 text-gray-900 rounded-tl-none"
                }`}
              >
                <p className="break-words">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {`seen at ${message.timestamp.toLocaleTimeString()}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-grow"
          />
          <Button onClick={() => handleSend("user")} className="px-4">
            <Send className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleSend("other")}
            className="px-4 bg-amber-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  );
};

export default MessageInterface;
