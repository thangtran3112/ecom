import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface PersistState {
    token: string;
    setToken: (token: string) => void;
}

const persistStore = create<PersistState>()(
    devtools(
        persist(
            immer((set) => ({
                token: "",
                setToken: (token) => set({ token }),
            })),
            {
                name: "token-storage",
            }
        )
    )
);

export default persistStore;
