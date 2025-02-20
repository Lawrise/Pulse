import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { User } from 'lucide-react';

interface UserType {
  email: string;
  // Add other user properties as needed
}

interface SidebarHeaderProfileProps {
  user: UserType | null;
  navigate: (path: string) => void;
  logout: () => void;
}

const SidebarHeaderProfile: React.FC<SidebarHeaderProfileProps> = ({ 
  user, 
  navigate, 
  logout 
}) => {
  if (!user) {
    return (
      <Button 
        onClick={() => navigate("/login")}
        className="w-full group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0"
      >
        <span className="group-data-[collapsible=icon]:hidden">Connexion</span>
        <span className="hidden group-data-[collapsible=icon]:inline">
          <User className="size-4" />
        </span>
      </Button>
    );
  }

  const userInitials = user.email.substring(0, 2).toUpperCase();
  const username = user.email.split('@')[0];

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger 
            className="w-full flex items-center space-x-4 p-2 rounded-md hover:bg-sidebar-accent group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:space-x-0 outline-none"
          >
            <Avatar className="size-8 shrink-0">
              <AvatarImage alt={username} />
              <AvatarFallback className="bg-emerald-100">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <p className="truncate group-data-[collapsible=icon]:hidden">
              {username}
            </p>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="hidden group-data-[collapsible=icon]:block"
        >
          {username}
        </TooltipContent>
      </Tooltip>
      
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SidebarHeaderProfile;