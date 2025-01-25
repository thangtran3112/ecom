import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { mockHabits } from "./mock";

export interface Habit {
    id: string;
    name: string;
    frequency: "daily" | "weekly";
    completedDates: string[];
    createdAt: string;
}

interface HabitState {
    habits: Habit[];
    isLoading: boolean;
    error: string | null;
    addHabit: (name: string, frequency: "daily" | "weekly") => void;
    removeHabit: (id: string) => void;
    toggleHabit: (id: string, date: string) => void;
    fetchHabits: () => Promise<void>;
}

const persistConfig = {
    name: "habits-local",
    // whitelist: ["habits"],
    storage: createJSONStorage(() => localStorage),
};

const useHabitStore = create<HabitState>()(
    devtools(
        persist((set, get) => {
            return {
                habits: [],
                isLoading: false,
                error: null,
                addHabit: (name, frequency) => {
                    return set((state) => ({
                        habits: [
                            ...state.habits,
                            {
                                id: Date.now().toString(),
                                name,
                                frequency,
                                completedDates: [],
                                createdAt: new Date().toISOString(),
                            },
                        ],
                    }));
                },
                removeHabit: (id) =>
                    set((state) => ({
                        habits: state.habits.filter((habit) => habit.id !== id),
                    })),
                toggleHabit: (id, date) =>
                    set((state) => ({
                        habits: state.habits.map((habit) =>
                            habit.id === id
                                ? {
                                      ...habit,
                                      completedDates:
                                          habit.completedDates.includes(date)
                                              ? habit.completedDates.filter(
                                                    (d) => d !== date
                                                )
                                              : [...habit.completedDates, date],
                                  }
                                : habit
                        ),
                    })),
                fetchHabits: async () => {
                    set({ isLoading: true, error: null });
                    try {
                        // Check if we already have habits in the store
                        const currentHabits = get().habits;
                        if (currentHabits.length > 0) {
                            set({ isLoading: false, error: null });
                            return;
                        }
                        // Simulate network request
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                        );
                        set({ habits: mockHabits, isLoading: false });
                    } catch {
                        set({ error: "Fail to fetch habit", isLoading: false });
                    }
                },
            };
        }, persistConfig)
    )
);

export default useHabitStore;
