import { Box, Container, Typography } from "@mui/material";
import "./App.css";
import useHabitStore from "./store/store";
import AddHabitForm from "./components/AddHabitForm";
import HabitList from "./components/HabitList";
import { useEffect } from "react";
import HabitStats from "./components/HabitStats";

function App() {
    const { fetchHabits } = useHabitStore();

    useEffect(() => {
        fetchHabits();
    }, [fetchHabits]);

    return (
        <Container>
            <Box>
                <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    align="center"
                >
                    Habbit Tracker
                </Typography>
                <AddHabitForm />
                <HabitList />
                <HabitStats />
            </Box>
        </Container>
    );
}

export default App;
