import React, { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/authContext";
import { io, Socket } from "socket.io-client";
import apiAxios from "@/services/api";

interface Message {
  id: string;
  content: string;
  sender: "user" | "other";
  timestamp: Date;
}

interface Chat {
  chat_id: number;
  other_user_id: number;
  message: string;
  created_at: string;
}

const MessageInterface = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const fetchChats = async () => {
      try {
        const { data } = await apiAxios.get(`/chats/${user.id}`);
        setChats(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchChats();
  }, [user?.id]);

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    setSocket(newSocket);

    newSocket.on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const openChat = async (chatId: number) => {
    setSelectedChat(chatId);
    try {
      const { data } = await apiAxios.get(`/chats/${chatId}`);
      setMessages(data);
      socket?.emit("join_chat", chatId);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = () => {
    if (!selectedChat || !newMessage.trim()) return;

    const messageData = {
      chatId: selectedChat,
      senderId: user?.id,
      message: newMessage,
    };
    socket?.emit("send_message", messageData);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="w-full h-full flex p-4">
      <div className="w-1/4 border-r-2">
        {chats.length === 0 ? (
          <p>Pas de chat</p>
        ) : (
          chats.map((chat) => (
            <div key={chat.chat_id} onClick={() => openChat(chat.chat_id)}>
              <p>
                <strong>Chat with User {chat.other_user_id}</strong>
              </p>
              <p>{chat.message || "No messages yet..."}</p>
              <hr />
            </div>
          ))
        )}
      </div>
      <div className="flex flex-col w-3/4">
        <ScrollArea className="h-[700px] w-full p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.sender === "user"
                    ? "flex-row-reverse"
                    : "justify-start"
                }`}
              >
                {message.sender === "other" && (
                  <div className="rounded-full bg-emerald-800 w-10 h-10"></div>
                )}
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
            <Button onClick={sendMessage} className="px-4">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MessageInterface;
