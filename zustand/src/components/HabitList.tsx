import {
    Box,
    Button,
    Grid2,
    LinearProgress,
    Paper,
    Typography,
} from "@mui/material";
import useHabitStore from "../store/store";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getDate, getStreak } from "../utils/common";

const HabitList = () => {
    const { habits, removeHabit, toggleHabit } = useHabitStore();

    // Habit completed date is in format of 2025-01-25T19:57:57.086Z
    const today = getDate(new Date());

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}>
            {habits.map((habit) => (
                <Paper key={habit.id} elevation={2} sx={{ p: 2 }}>
                    <Grid2 container alignItems="center">
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <Typography variant="h6">{habit.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {habit.frequency.charAt(0).toUpperCase() +
                                    habit.frequency.slice(1)}
                            </Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: 1,
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    color={
                                        habit.completedDates.includes(today)
                                            ? "success"
                                            : "primary"
                                    }
                                    onClick={() => toggleHabit(habit.id, today)}
                                    startIcon={<CheckCircleIcon />}
                                >
                                    {habit.completedDates.includes(today)
                                        ? "Completed"
                                        : "Mark Complete"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => removeHabit(habit.id)}
                                    startIcon={<DeleteIcon />}
                                >
                                    Remove
                                </Button>
                            </Box>
                        </Grid2>
                    </Grid2>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            Current Streak: {getStreak(habit)} days
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={(getStreak(habit) / 30) * 100}
                            sx={{ mt: 1 }}
                        />
                    </Box>
                </Paper>
            ))}
        </Box>
    );
};

export default HabitList;
