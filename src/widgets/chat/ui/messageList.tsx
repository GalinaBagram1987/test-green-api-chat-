import type { ChatMessage } from '@/features/chat/model/types';

import { MessageItem } from './messageItem';

type MessageListProps = {
  messages: ChatMessage[];
};

export const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="flex flex-col gap-2">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
};
