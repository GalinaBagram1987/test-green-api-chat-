import { ChatMessage } from '../model/types';
import { MessageItem } from './messageItem';

export type MessageListProps = {
  messages: ChatMessage[];
};

export const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="flex flex-col flex-1 min-h-[200px] overflow-y-auto gap-2 p-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
};
