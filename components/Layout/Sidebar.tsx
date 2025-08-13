import { useRouter } from 'next/router'

export default function Sidebar() {
  const router = useRouter()
  return (
    <aside className="w-56 bg-gray-100 p-4 flex flex-col gap-2">
      <button onClick={()=>router.push('/chat')} className="p-2 bg-blue-200 rounded">Chat</button>
      <button onClick={()=>router.push('/scheduled')} className="p-2 bg-green-200 rounded">Scheduled Prompts</button>
      <button onClick={()=>router.push('/subscription')} className="p-2 bg-yellow-200 rounded">Subscription</button>
    </aside>
  )
}
