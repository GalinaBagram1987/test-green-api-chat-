'use client';
import { useSearchParams } from 'next/navigation';

import { Chat } from '@/widgets/chat';

const ChatPage = () => {
  const searchParams = useSearchParams();
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return <div>Не указан ID чата</div>;
  }
  return <Chat chatId={chatId} />;
};
export default ChatPage;
