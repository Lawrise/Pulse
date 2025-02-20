import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Header: React.FC = () => {
  return (
    <header className="flex justify-start w-full border-b-2">
      <SidebarTrigger className="w-12 h-12"/>
    </header>
  );
};

export default Header;
