import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/authContext";
import { io, Socket } from "socket.io-client";
import apiAxios from "@/services/api";

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  message: string;
  type: string;
  status: string;
  metadata: object;
  read_at?: string;
  created_at: string;
  deleted_at?: string;
}

interface Chat {
  id: string;
  otherUser: {
    id: string;
    username: string;
  };
  lastMessageAt?: string;
  createdAt: string;
}

const MessageInterface = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const searchParams = new URLSearchParams(window.location.search);
  const chatIdFromUrl = searchParams.get("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  // Fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await apiAxios.get("/chats");
        setChats(data);

        // If chat ID in URL, open that chat
        if (chatIdFromUrl) {
          openChat(chatIdFromUrl);
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };

    if (user?.id) {
      fetchChats();
    }
  }, [user?.id, chatIdFromUrl]);

  // Socket connection
  useEffect(() => {
    if (!user?.id) return;

    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
      auth: {
        userId: user.id,
      },
    });

    // Join all user's chat rooms on connection
    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      // Join all chat rooms the user is part of
      chats.forEach((chat) => {
        newSocket.emit("join_chat", chat.id);
      });
    });

    // Handle incoming messages
    newSocket.on("receive_message", (message: Message) => {
      setMessages((prev) => {
        // Only add message if it's not already in the list
        if (!prev.some((m) => m.id === message.id)) {
          return [...prev, message];
        }
        return prev;
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user?.id, chats]);

  const openChat = async (chatId: string) => {
    try {
      setSelectedChat(chatId);
      const { data } = await apiAxios.get(`/chats/${chatId}/messages`);
      setMessages(data);
      socket?.emit("join_chat", chatId);
    } catch (error) {
      console.error("Failed to open chat:", error);
    }
  };

  const sendMessage = async () => {
    if (!selectedChat || !newMessage.trim() || !user?.id) return;

    try {
      const messageData = {
        content: newMessage.trim(),
      };

      // Send to backend
      const { data } = await apiAxios.post(
        `/chats/${selectedChat}/messages`,
        messageData
      );

      // Emit to socket with full message data
      socket?.emit("send_message", {
        ...data,
        chat_id: selectedChat,
      });

      // Clear input before adding message to state
      setNewMessage("");

      // Update messages state
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <main className="w-full h-full flex">
      {/* Chat list */}
      <div className="w-1/4 border-r-2 p-4">
        {chats.length === 0 ? (
          <p className="p-4 text-gray-500">No conversations yet</p>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => openChat(chat.id)}
                className={`p-4 hover:bg-gray-100 cursor-pointer ${
                  selectedChat === chat.id ? "bg-gray-100" : ""
                }`}
              >
                <p className="font-semibold">{chat.otherUser.username}</p>
                {chat.lastMessageAt && (
                  <p className="text-xs text-gray-500">
                    {new Date(chat.lastMessageAt).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Messages area */}
      <div className="flex flex-col w-3/4">
        {selectedChat ? (
          <>
            <ScrollArea className="h-[700px] w-full p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${
                      message.sender_id === user?.id
                        ? "flex-row-reverse"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender_id === user?.id
                          ? "bg-emerald-200 text-gray-900 rounded-tr-none"
                          : "bg-gray-100 text-gray-900 rounded-tl-none"
                      }`}
                    >
                      <p className="break-words">{message.message}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && sendMessage()
                  }
                  placeholder="Type a message..."
                  className="flex-grow"
                />
                <Button onClick={sendMessage} className="px-4">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </main>
  );
};

export default MessageInterface;
