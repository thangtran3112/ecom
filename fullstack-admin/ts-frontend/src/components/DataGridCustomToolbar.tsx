/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search } from "@mui/icons-material";
import { IconButton, TextField, InputAdornment } from "@mui/material";
import {
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import FlexBetween from "./FlexBetween";

interface DataGridCustomToolbarProps {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const MyGridToolbarColumnsButton = () => {
  // @ts-expect-error MUI datagrid typescript has bug. This work perfectly fine
  return <GridToolbarColumnsButton />;
};

const MyGridToolbarDensitySelector = () => {
  // @ts-expect-error MUI datagrid typescript has bug. This work perfectly fine
  return <GridToolbarDensitySelector />;
};

const DataGridCustomToolbar = ({
  searchInput,
  setSearchInput,
  setSearch,
}: DataGridCustomToolbarProps) => {
  return (
    <GridToolbarContainer>
      <FlexBetween width="100%">
        <FlexBetween>
          <MyGridToolbarColumnsButton />
          <MyGridToolbarDensitySelector />
          <GridToolbarExport />
        </FlexBetween>
        <TextField
          label="Search..."
          sx={{ mb: "0.5rem", width: "15rem" }}
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
          variant="standard"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {/* We can also use debounce to delay searching text, to avoid keep sending api searching to backend */}
                <IconButton
                  onClick={() => {
                    setSearch(searchInput);
                    setSearchInput("");
                  }}
                >
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </FlexBetween>
    </GridToolbarContainer>
  );
};

export default DataGridCustomToolbar;
