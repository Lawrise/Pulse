import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import apiAxios from "@/services/api";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  username: z.string().min(1, { message: "Ce champ est requis." }),
});

const FriendsAdd: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const response = await apiAxios.post("/friend/send-request", {
        username: values.username,
      });

      setMessage(response.data.message);
      form.reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Échec de la demande d'ami");
      } else {
        setError("Une erreur est survenue.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Ajouter un ami</h1>
      <p className="mb-4">Tu peux ajouter des amis pour débattre avec eux plus rapidement !</p>
      
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex space-x-2">
        <Input
          {...form.register("username")}
          placeholder="Entrez un nom d'utilisateur"
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Envoi..." : "Envoyer"}
        </Button>
      </form>

      {form.formState.errors.username && (
        <p className="text-red-500 text-sm mt-1">{form.formState.errors.username.message}</p>
      )}
    </div>
  );
};

export default FriendsAdd;
