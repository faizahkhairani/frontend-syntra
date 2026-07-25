import { useAuthStore } from "@/store/authStore";


export const useIsDemo = () => {
  return useAuthStore((state) => state.user?.isDemo ?? false);
};