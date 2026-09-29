import { SideBar } from './sideBar';

type ChatProps = {
  chatId: string;
};

export const Chat = ({ chatId }: ChatProps) => {
  return (
    <main className="flex h-dvh">
      <SideBar chatId={chatId} />

      <section className="flex flex-1 flex-col">
        <h1>Сообщения</h1>
      </section>
    </main>
  );
};
