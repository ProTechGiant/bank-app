import { ChartDataType, GraphData } from "../types";

export const chartDataFormatter = (
  baseMonthSpending: GraphData[],
  comparedMonthSpending: GraphData[]
): ChartDataType[] => {
  const chartData: ChartDataType[] = [];
  for (let i = 0; i < baseMonthSpending.length; i++) {
    const chartDataObj: ChartDataType = { category: "", series1: 0, series2: 0 };
    const { Week } = baseMonthSpending[i];
    chartDataObj.category = "Week " + Week;
    chartDataObj.series1 = baseMonthSpending[i].Amount;
    chartDataObj.series2 = comparedMonthSpending[i].Amount;
    chartData.push(chartDataObj);
  }
  return chartData;
};
