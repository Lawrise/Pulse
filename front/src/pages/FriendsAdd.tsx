import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

const FriendsAdd: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Ajouter</h1>
      <p className="mb-4">
        Tu peux ajouter des amis pour debattre avec eux plus rapidement !
      </p>
      <div className="flex space-x-2">
        <Input placeholder="Tu peux ajouter des amis grace a leurs noms d'utilisateur" />
        <Button type="submit">Send friend request</Button>
      </div>
    </div>
  );
};

export default FriendsAdd;
