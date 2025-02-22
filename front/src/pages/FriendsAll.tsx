import { Button } from "@/components/ui/button";
import apiAxios from "@/services/api";
import axios from "axios";
import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Friend = {
  friendshipId: string;
  friend: {
    id: string;
    username: string;
    email: string;
  };
};

export default function FriendsAll() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await apiAxios.get("/friend/friends");
        setFriends(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message || "Erreur lors du chargement"
          );
        }
      }
    };

    fetchFriends();
  }, []);

  const startChat = async (friendId: string) => {
    try {
      // Create or get existing chat
      const response = await apiAxios.post("/chats", {
        user2Id: friendId
      });
      
      // Navigate to messages page with the chat id
      navigate(`/messages?chat=${response.data.id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Erreur lors de la création du chat");
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Mes amis</h1>
      {error && <p className="text-red-500">{error}</p>}

      {friends.length === 0 ? (
        <p>Aucun ami.</p>
      ) : (
        <ul className="space-y-2">
          {friends.map((friendData) => (
            <li
              key={friendData.friendshipId}
              className="border p-2 rounded flex justify-between items-center"
            >
              <div className="flex flex-col">
                <p className="font-semibold">{friendData.friend.username}</p>
                <p className="text-sm text-gray-500">
                  {friendData.friend.email}
                </p>
              </div>
              <div>
                <Button onClick={() => startChat(friendData.friend.id)}>
                  <Send />
                  Message
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
