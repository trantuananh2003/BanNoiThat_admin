import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import TotalRevenueChart from "./chart-tool-revenue";
import clientAPI from "client-api/rest-client";
import CardIncomeAnalysist from "./card-income-analysis";
import CardOrderAnalysist from "./card-order-analysis";

interface RevenueStatistic {
  revenueLastWeek: number;
  revenueCurrentWeek: number;
}

interface NumberOrderStatistic {
  numberLastWeek: number;
  numberCurrentWeek: number;
}

interface ChartIncomeData {
  labelChart: string;
  x: number[];
}

export default function AnalysisPage() {
  const [revenueStatistic, setRevenueStatistic] = useState<RevenueStatistic>();
  const [numberOrderStatistic, setNumberOrderStatistic] =
    useState<NumberOrderStatistic>();
  const [chartIncomeData, setChartIncomeData] = useState<ChartIncomeData>();
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const fetchChartRevenueData = async (year: number) => {
    try {
      const response: { result: ChartIncomeData } = await clientAPI
        .service("statistics/chart")
        .find(`year=${year}`);
      setChartIncomeData(response?.result);
    } catch (error) {
      console.log("Error to fetch revenue statistic: ", error);
    }
  };

  useEffect(() => {
    const fetchRevenueStatistic = async () => {
      try {
        const response: { result: RevenueStatistic } = await clientAPI
          .service("statistics")
          .get("revenue");
        setRevenueStatistic(response?.result);
      } catch (error) {
        console.log("Error to fetch revenue statistic: ", error);
      }
    };

    const fetchNumberOrderStatistic = async () => {
      try {
        const response: { result: NumberOrderStatistic } = await clientAPI
          .service("statistics")
          .get("orders");
        setNumberOrderStatistic(response?.result);
      } catch (error) {
        console.log("Error to fetch order statistic: ", error);
      }
    };

    fetchRevenueStatistic();
    fetchNumberOrderStatistic();
    fetchChartRevenueData(selectedYear);
  }, [selectedYear]);

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(event.target.value as number);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 5 },
    (_, i) => currentYear - i
  );

  return (
    <Box sx={{  }}>

      <Box display="flex" gap={4} mb={4}>
        <CardIncomeAnalysist
          revenueLastWeek={revenueStatistic?.revenueLastWeek ?? 0}
          revenueCurrentWeek={revenueStatistic?.revenueCurrentWeek ?? 0}
        />
        <CardOrderAnalysist
          numberLastWeek={numberOrderStatistic?.numberLastWeek ?? 0}
          numberCurrentWeek={numberOrderStatistic?.numberCurrentWeek ?? 0}
        />
      </Box>

      <Box mb={2} display="flex" alignItems="center" gap={2}>
        <FormControl size="small">
          <InputLabel id="select-year-label">Year</InputLabel>
          <Select
            labelId="select-year-label"
            id="select-year"
            value={selectedYear}
            label="Year"
            onChange={handleYearChange}
          >
            {yearOptions.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2" color="text.secondary">
          Select year to display revenue chart
        </Typography>
      </Box>

      <TotalRevenueChart incomePerMonth={chartIncomeData?.x ?? []} />
    </Box>
  );
}
