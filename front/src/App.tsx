import "./App.css";
import MessageInterface from "./pages/message";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import Home from "@/pages/Home";
import Layout from "@/pages/Layout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Friends from "@/pages/Friends";
import FriendsAll from "@/pages/FriendsAll";
import FriendsPending from "@/pages/FriendsPending";
import FriendsAdd from "@/pages/FriendsAdd";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "chat", element: <MessageInterface /> },
      { path: "profile", element: <Profile /> },
      {
        path: "friends",
        element: <Friends />,
        children: [
          { path: "all", element: <FriendsAll /> },
          { path: "online", element: <FriendsAll /> },
          { path: "pending", element: <FriendsPending /> },
          { path: "add", element: <FriendsAdd /> },
        ],
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
