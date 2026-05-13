import { create } from "zustand";
import { persist } from "zustand/middleware";
 // Auth store itu tempat nyimpen state user yang sedang login
interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  department?: string;
  gender: "Male" | "Female";
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

// export const useAuthStore = create<AuthStore>()(
//   persist(
//     (set, get) => ({
//       user: null,
//       token: null,
//       setAuth: (user, token) => {
//         localStorage.setItem("token", token);
//         set({ user, token });
//       },
//       logout: () => {
//         localStorage.removeItem("token");
//         set({ user: null, token: null });
//       },
//       isAuthenticated: () => !!get().token,
//     }),
//     { name: "auth-storage" }
//   )
// );

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user, token) => {
        set({ user, token });
      },

      logout: () => {
        set({ user: null, token: null });
      },

      isAuthenticated: () => !!get().token,
    }),
    {
      name: "auth-storage",
    }
  )
);