import { Habit } from "../store/store";

export const getDate = (date: Date) => {
    return date.toISOString().split("T")[0];
};

export const getStreak = (habit: Habit) => {
    let streak = 0;
    const currentDate = new Date();

    while (true) {
        const dateString = getDate(currentDate);
        if (habit.completedDates.includes(dateString)) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
};

export const getTotalHabits = (habits: Habit[]) => habits.length;

export const getCompletedToday = (habits: Habit[]) => {
    const today = getDate(new Date());
    return habits.filter((habit) => habit.completedDates.includes(today))
        .length;
};

export const getLongestStreak = (habits: Habit[]) => {
    return Math.max(...habits.map(getStreak), 0);
};
