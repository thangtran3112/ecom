import { Habit } from "./store";

export const mockHabits: Habit[] = [
    {
        id: "1",
        name: "Read",
        frequency: "daily",
        completedDates: [],
        createdAt: new Date().toISOString(),
    },
    {
        id: "2",
        name: "Exercise",
        frequency: "daily",
        completedDates: [],
        createdAt: new Date().toISOString(),
    },
];
