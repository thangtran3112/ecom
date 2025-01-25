import { Box, Container, Typography } from "@mui/material";
import "./App.css";
import useHabitStore from "./store/store";
import AddHabitForm from "./components/AddHabitForm";
import HabitList from "./components/HabitList";

function App() {
    const store = useHabitStore();
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
            </Box>
        </Container>
    );
}

export default App;
