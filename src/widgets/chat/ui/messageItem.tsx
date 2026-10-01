import type { ChatMessage } from '@/features/chat/model/types';

type MessageItemProps = {
  message: ChatMessage;
};

export const MessageItem = ({ message }: MessageItemProps) => {
  const isOutgoing = message.direction === 'outgoing';

  return (
    <div className="p-10">
      <div>
        <div className={isOutgoing ? 'flex justify-end' : 'flex justify-start'}>
          <p className="px-4 py-2 rounded-xl shadow-lg bg-sky-500/50">{message.text}</p>
        </div>

        {message.sendingStatus === 'sending' && <span>Отправка...</span>}

        {message.sendingStatus === 'error' && <span>Ошибка отправки</span>}
      </div>
    </div>
  );
};
