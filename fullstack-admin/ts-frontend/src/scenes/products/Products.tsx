import { useGetProductsQuery } from "../../states/api";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import { IProduct } from "../../states/types";

const Products = () => {
  const { data, isLoading } = useGetProductsQuery(undefined);
  return (
    <Box>
      <Header title="PRODUCTS" subtitle="See your list of products." />
      {data?.map(
        ({
          _id,
          name,
          description,
          price,
          rating,
          category,
          supply,
          stat,
        }: IProduct) => (
          <div>Product with name: {name}</div>
        )
      )}
    </Box>
  );
};

export default Products;
