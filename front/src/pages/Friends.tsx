import React from "react";
import { UserRoundCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink, Outlet } from "react-router-dom";

const Friends: React.FC = () => {
  return (
    <main className="w-full">
      <header className="flex p-4 border-b-2 w-full space-x-2 items-center">
        <div className="flex space-x-2 border-r-2 pr-6">
          <UserRoundCheck />
          <p>Friends</p>
        </div>
        <div className="flex w-full space-x-2 ml-4 items-center">
          <NavLink
            to="/friends/online"
            className={({ isActive }) =>
              `hover:bg-neutral-100 px-4 py-1 rounded-md ${
                isActive ? "text-black bg-neutral-100" : ""
              }`
            }
          >
            En ligne
          </NavLink>
          <NavLink
            to="/friends/all"
            className={({ isActive }) =>
              `hover:bg-neutral-100 px-4 py-1 rounded-md ${
                isActive ? "text-black bg-neutral-100" : ""
              }`
            }
          >
            Tous
          </NavLink>
          <NavLink
            to="/friends/pending"
            className={({ isActive }) =>
              `hover:bg-neutral-100 px-4 py-1 rounded-md ${
                isActive ? "text-black bg-neutral-100" : ""
              }`
            }
          >
            En attente
          </NavLink>
        
          <NavLink
            to="/friends/add"
            className={({ isActive }) =>
              `bg-emerald-200 hover:bg-emerald-300 px-4 py-1 rounded-md ${
                isActive ? "text-black bg-neutral-100" : ""
              }`
            }
          >
            Ajouter
          </NavLink>
        </div>
      </header>
      <Outlet />
    </main>
  );
};

export default Friends;
