import { create } from 'zustand';

import { useCheckAccountStore } from '@/features/connectForm/module/store';

import { getChatHistoryRequest, sendMessageRequest } from '../api/chat';

import type { ChatMessage, ChatState } from './types';

const normalizePhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.replace(/\D/g, '');
};

const createChatId = (phoneNumber: string): string => {
  return `${normalizePhoneNumber(phoneNumber)}@c.us`;
};

export const useChatStore = create<ChatState>((set, get) => ({
  phoneNumber: '',
  chatId: '',
  messages: [],

  status: 'idle',
  isSending: false,
  error: null,

  setChat: (phoneNumber) => {
    const normalizedPhone = normalizePhoneNumber(phoneNumber);

    set({
      phoneNumber: normalizedPhone,
      chatId: createChatId(normalizedPhone),
      messages: [],
      status: 'idle',
      error: null,
    });
  },

  startChat: async (phoneNumber, firstMessage = 'Привет! Поболтаем?') => {
    const normalizedPhone = normalizePhoneNumber(phoneNumber);

    if (!/^7\d{10}$/.test(normalizedPhone)) {
      set({
        status: 'error',
        error: 'Введите российский номер в формате 79991234567',
      });

      return false;
    }

    const chatId = createChatId(normalizedPhone);

    const { idInstance, apiTokenInstance } = useCheckAccountStore.getState();

    if (!idInstance || !apiTokenInstance) {
      set({
        status: 'error',
        error: 'Данные подключения не найдены',
      });

      return false;
    }

    set({
      phoneNumber: normalizedPhone,
      chatId,
      status: 'loading',
      error: null,
    });

    try {
      const response = await sendMessageRequest({
        idInstance,
        apiTokenInstance,
        chatId,
        message: firstMessage,
      });

      const message: ChatMessage = {
        id: response.idMessage,
        text: firstMessage,
        timestamp: Math.floor(Date.now() / 1000),
        direction: 'outgoing',
        sendingStatus: 'sent',
      };

      set({
        phoneNumber: normalizedPhone,
        chatId,
        messages: [message],
        status: 'success',
        error: null,
      });

      return true;
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Не удалось создать чат',
      });

      return false;
    }
  },

  loadMessages: async () => {
    const { chatId, status } = get();

    if (!chatId) {
      set({
        status: 'error',
        error: 'Не выбран чат',
      });

      return;
    }

    if (status === 'loading') {
      return;
    }

    const { idInstance, apiTokenInstance } = useCheckAccountStore.getState();

    if (!idInstance || !apiTokenInstance) {
      set({
        status: 'error',
        error: 'Нет данных подключения',
      });

      return;
    }

    set({
      status: 'loading',
      error: null,
    });

    try {
      const history = await getChatHistoryRequest({
        idInstance,
        apiTokenInstance,
        chatId,
        count: 50,
      });

      const messages: ChatMessage[] = history
        .slice()
        .reverse()
        .map((item) => ({
          id: item.idMessage,
          text: item.textMessage ?? item.extendedTextMessage?.text ?? '',
          timestamp: item.timestamp,
          direction: item.type === 'outgoing' ? 'outgoing' : 'incoming',
          sendingStatus: 'sent',
        }));

      set({
        messages,
        status: 'success',
        error: null,
      });
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);

      set({
        status: 'error',
        error: 'Не удалось загрузить сообщения',
      });
    }
  },

  sendMessage: async (message) => {
    const text = message.trim();

    if (!text) {
      return;
    }

    const { chatId } = get();

    if (!chatId) {
      set({
        error: 'Не выбран чат',
      });

      throw new Error('Не выбран чат');
    }

    const { idInstance, apiTokenInstance } = useCheckAccountStore.getState();

    if (!idInstance || !apiTokenInstance) {
      set({
        error: 'Нет данных подключения',
      });

      throw new Error('Нет данных подключения');
    }

    const temporaryId = `temporary-${Date.now()}`;

    const temporaryMessage: ChatMessage = {
      id: temporaryId,
      text,
      timestamp: Math.floor(Date.now() / 1000),
      direction: 'outgoing',
      sendingStatus: 'sending',
    };

    set((state) => ({
      messages: [...state.messages, temporaryMessage],
      isSending: true,
      error: null,
    }));

    try {
      const result = await sendMessageRequest({
        idInstance,
        apiTokenInstance,
        chatId,
        message: text,
      });

      set((state) => ({
        messages: state.messages.map((item) => {
          if (item.id !== temporaryId) {
            return item;
          }

          return {
            ...item,
            id: result.idMessage,
            sendingStatus: 'sent',
          };
        }),
        isSending: false,
        error: null,
      }));
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);

      set((state) => ({
        messages: state.messages.map((item) => {
          if (item.id !== temporaryId) {
            return item;
          }

          return {
            ...item,
            sendingStatus: 'error',
          };
        }),
        isSending: false,
        error: 'Не удалось отправить сообщение',
      }));

      throw error;
    }
  },

  reset: () => {
    set({
      phoneNumber: '',
      chatId: '',
      messages: [],
      status: 'idle',
      isSending: false,
      error: null,
    });
  },
  addMessage: (message) => {
    set((state) => {
      const messageAlreadyExists = state.messages.some((item) => item.id === message.id);

      if (messageAlreadyExists) {
        return state;
      }

      return {
        messages: [...state.messages, message],
      };
    });
  },
  setError: (error) => {
    set({ error });
  },
}));
