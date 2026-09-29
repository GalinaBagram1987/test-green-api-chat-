type SideBarProps = {
  chatId: string;
};

export const SideBar = ({ chatId }: SideBarProps) => {
  const phoneNumber = chatId.replace('@c.us', '');
  return (
    <aside className="w-50 h-dvh border-2 border-neutral-400 bg-neutral-50 shadow-2xl rounded-r-2xl flex h-screen items-center justify-center">
      <div className="d-flex column g-20">
        <h1 className="text-xl text-center font-semibold mb-10">Диалог с пользователем</h1>
        <p className="font-medium text-center">+{phoneNumber}</p>
      </div>
    </aside>
  );
};
