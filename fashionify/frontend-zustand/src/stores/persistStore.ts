import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface PersistState {
    token: string;
    setToken: (token: string) => void;
    removeToken: () => void;
}

const persistConfig = {
    name: "fasionify-session",
    whitelist: ["token"], //only the token will be persisted, not the other state like setToken and removeToken
    storage: createJSONStorage(() => localStorage),
};

const userPersistStore = create<PersistState>()(
    devtools(
        persist(
            immer((set) => ({
                token: "",
                setToken: (token) => {
                    set({ token });
                },
                removeToken: () => {
                    set({ token: "" });
                },
            })),
            persistConfig
        )
    )
);

export default userPersistStore;
