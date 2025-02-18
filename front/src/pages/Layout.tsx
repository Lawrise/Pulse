import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import React from "react";
import Header from "@/components/header/header";

const Layout: React.FC = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
	  <div className='w-full h-screen flex flex-col items-center'>
        <Header />
        <Outlet />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
