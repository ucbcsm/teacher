import { create } from "zustand";

type SessionStoreType = {
  accessToken: string | null;
  refreshToken: string | null;
  user: Record<string, any> | null;
  error: string | null;
  updateAccessToken: (token: string) => void;
  updateRefreshToken: (token: string) => void;
  updateUser: (user: Record<string, any>) => void;
  updateError: (error: string) => void;
  update: (session: {
    accessToken?: string | null;
    refreshToken?: string | null;
    user?: Record<string, any> | null;
    error?: string | null;
  }) => void;
} 

export const useSessionStore = create<SessionStoreType>()((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  error: null,
  updateAccessToken: (token) => set({ accessToken: token }),
  updateRefreshToken: (token) => set({ refreshToken: token }),
  updateUser: (user) => set({ user }),
  updateError: (error) => set({ error }),
  update: (session) => set({ ...session }),
}));
