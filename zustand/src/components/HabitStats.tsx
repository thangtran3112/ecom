import React from "react";
import { Paper, Typography, Box, LinearProgress } from "@mui/material";
import useHabitStore from "../store/store";
import {
    getCompletedToday,
    getLongestStreak,
    getTotalHabits,
} from "../utils/common";

const HabitStats: React.FC = () => {
    const { habits, isLoading, error } = useHabitStore();

    if (isLoading) {
        return <LinearProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Paper elevation={2} sx={{ p: 2, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Habit Statistics
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body1">
                    Total Habits: {getTotalHabits(habits)}
                </Typography>
                <Typography variant="body1">
                    Completed Today: {getCompletedToday(habits)}
                </Typography>
                <Typography variant="body1">
                    Longest Streak: {getLongestStreak(habits)} days
                </Typography>
            </Box>
        </Paper>
    );
};

export default HabitStats;
