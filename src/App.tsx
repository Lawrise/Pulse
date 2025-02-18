import './App.css'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import MessageInterface from './components/message/message'


function App() {

  return (
    <SidebarProvider>
      <AppSidebar/>
      <main className='w-full flex flex-col items-center'>
        <SidebarTrigger />
        <p className='text-red-500'>Test</p>
        <MessageInterface />
      </main>
    </SidebarProvider>
  )
}

export default App
