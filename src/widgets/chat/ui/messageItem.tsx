import type { ChatMessage } from '../model/types';

type MessageItemProps = {
  message: ChatMessage;
};

export const MessageItem = ({ message }: MessageItemProps) => {
  const isOutgoing = message.direction === 'outgoing';
  return (
    <div className={isOutgoing ? 'flex justify-end' : 'flex justify-start'}>
      <p className="px-4 py-2 rounded-xl shadow-lg bg-sky-500/50">{message.text}</p>
    </div>
  );
};
