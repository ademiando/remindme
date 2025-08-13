import { ChatMessage as ChatMessageType } from '../../types/chat'

type Props = { message: ChatMessageType, userId: string }

export default function ChatMessage({ message, userId }: Props) {
  const isUser = message.user_id === userId
  return (
    <div className={`my-2 p-3 rounded ${isUser ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'}`}>
      <p className="whitespace-pre-wrap">{message.content}</p>
      <div className="text-gray-500 text-xs mt-1">{message.model} • {new Date(message.created_at).toLocaleTimeString()}</div>
    </div>
  )
}
