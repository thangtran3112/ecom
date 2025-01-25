import { Box, Button, Grid, Grid2, Paper, Typography } from "@mui/material";
import useHabitStore from "../store/store";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const HabitList = () => {
    const { habits } = useHabitStore();

    // Habit completed date is in format of 2025-01-25T19:57:57.086Z
    const today = new Date().toISOString().split("T")[0];

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}>
            {habits.map((habit) => (
                <Paper key={habit.id} elevation={2} sx={{ p: 2 }}>
                    <Grid container alignItems="center">
                        <Grid xs={12} sm={6}>
                            <Typography variant="h6">{habit.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {habit.frequency.charAt(0).toUpperCase() +
                                    habit.frequency.slice(1)}
                            </Typography>
                        </Grid>
                        <Grid xs={12} sm={6}>
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
                                    startIcon={<CheckCircleIcon />}
                                >
                                    {habit.completedDates.includes(today)
                                        ? "Completed"
                                        : "Mark Complete"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                >
                                    Remove
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            ))}
        </Box>
    );
};

export default HabitList;
