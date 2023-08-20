import React, { useState, useEffect } from "react";
import axios from "axios";
import "./analytics.css"; // Import the CSS file for styling

import {
  Box,
  CssBaseline,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { SelectChangeEvent } from "@mui/material";

const Container = styled("div")({
  display: "flex",
  height: "100vh",
});

const SelectionContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "60px",
  width: "450px",

  marginLeft: "20px",
});

const BoostButton = styled(Button)({
  marginLeft: "20px",
});


const theme = createTheme({
  typography: {
    fontWeightBold: 700,
  },
});

const AnalyticsView = () => {
  const [age, setAge] = useState("");
  const [products, setProducts] = useState([] as any[]);
  const [nameOptions, setNameOptions] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setAge(event.target.value);
    // create a button 'boost' for each product in the product list and display it
    // TODO: Fetch data based on the selected value
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  async function fetchProductList() {
    const endpoint = "http://localhost:8080/productlist";
    axios
      .get(endpoint)
      .then((response) => {
        setProducts(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <CssBaseline />
        <SelectionContainer>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Search</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Age"
              onChange={handleChange}
              sx={{
                minWidth: 120,
              }}
            >
              {products.slice(5).map((product) => (
                <MenuItem key={product.name} value={product.name}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <BoostButton
            variant="contained"
            color="primary"
            onClick={() => alert("Product boosted!")}
          >
            BOOST
          </BoostButton>
        </SelectionContainer>
      </Container>
    </ThemeProvider>
  );
};

export default AnalyticsView;
