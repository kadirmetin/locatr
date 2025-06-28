import { create } from "zustand";

type appState = {
  isAnimationComplete: boolean;
  setAnimationComplete: (complete: boolean) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  isApiCallComplete: boolean;
  setApiCallComplete: (complete: boolean) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
};

export const useAppStore = create<appState>((set) => ({
  isAnimationComplete: false,
  setAnimationComplete: (complete) => set({ isAnimationComplete: complete }),
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  isApiCallComplete: false,
  setApiCallComplete: (complete) => set({ isApiCallComplete: complete }),
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
}));
