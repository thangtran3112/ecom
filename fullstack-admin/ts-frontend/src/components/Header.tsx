/* eslint-disable @typescript-eslint/no-explicit-any */
import { Typography, Box, useTheme } from "@mui/material";
import React from "react";

interface HeaderProps {
  title: string;
  subtitle: string;
}
const Header = ({ title, subtitle }: HeaderProps) => {
  const theme = useTheme() as any;
  return (
    <Box>
      <Typography
        variant="h2"
        color={theme.palette.secondary[100]}
        fontWeight="bold"
        sx={{ mb: "5px" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={theme.palette.secondary[300]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
