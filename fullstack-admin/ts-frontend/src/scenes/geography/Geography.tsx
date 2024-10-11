/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { ResponsiveChoropleth } from "@nivo/geo";
import { useGetGeographyQuery } from "../../states/api";
import { useTheme } from "@mui/material";

//https://nivo.rocks/choropleth/
const Geography = () => {
  const theme = useTheme() as any;
  const { data } = useGetGeographyQuery(undefined);
  console.log(data);
  return <div>Geography</div>;
};

export default Geography;
