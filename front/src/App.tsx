import './App.css'
import MessageInterface from './pages/message'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from '@/pages/Home'
import Layout from '@/pages/Layout'
import Login from '@/pages/Login';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes with the sidebar */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="chat" element={<MessageInterface />} />
        </Route>

        {/* Route without the sidebar */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
