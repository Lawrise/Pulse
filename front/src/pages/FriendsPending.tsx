import { useEffect, useState } from "react";
import apiAxios from "@/services/api";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

type FriendRequest = {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
};

export default function FriendsPending() {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const response = await apiAxios.get("/friend/requests");
      setFriendRequests(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Erreur lors du chargement");
      }
    }
  };

  const onAccept = async (requestId: number) => {
    try {
      await apiAxios.post(`/friend/request/accept`, { requestId });
      setFriendRequests(friendRequests.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Erreur lors de l'acceptation :", error);
    }
  };

  const onReject = async (requestId: number) => {
    try {
      await apiAxios.post(`/friend/request/reject`, { requestId });
      setFriendRequests(friendRequests.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Erreur lors du rejet :", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Amis en attente</h1>
      {error && <p className="text-red-500">{error}</p>}

      {friendRequests.length === 0 ? (
        <p>Aucune demande en attente.</p>
      ) : (
        <ul className="space-y-2">
          {friendRequests.map((request) => (
            <li
              key={request.id}
              className="border p-2 rounded flex justify-between items-center"
            >
              <div className="flex flex-col">
                <p className="font-semibold">{request.user.username}</p>
                <p className="text-sm text-gray-500">
                  {request.user.email}
                </p>
              </div>
              <div className="space-x-2">
                <Button
                  className="bg-emerald-200 hover:bg-emerald-300 text-neutral-800"
                  onClick={() => onAccept(request.id)}
                >
                  <Check className="mr-1" size={16} /> Accepter
                </Button>
                <Button
                  className="bg-orange-200 hover:bg-orange-300 text-neutral-800"
                  onClick={() => onReject(request.id)}
                >
                  <X className="mr-1" size={16} /> Refuser
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
