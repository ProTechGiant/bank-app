import { t } from "i18next";

import { IntervalTypes } from "../enum";
import {
  DWMData,
  GraghApiResponse,
  LastSixMonthsApiResponse,
  SingleBarChart,
  SingleChartDataType,
  YearData,
} from "../types";

export function convertDataToChartDataset(
  data: GraghApiResponse & LastSixMonthsApiResponse,
  type: IntervalTypes
): DWMData | YearData | SingleChartDataType {
  switch (type) {
    case IntervalTypes.DAY_WEEK_MONTH: {
      const returedData: DWMData = {
        Monthly: {
          total: data.Data.Monthly.Total,
          chartData: [
            { interval: t("TopSpending.CategorizeTransactions.week", { week: 1 }), value: data.Data.Monthly.Week1 },
            { interval: t("TopSpending.CategorizeTransactions.week", { week: 2 }), value: data.Data.Monthly.Week2 },
            { interval: t("TopSpending.CategorizeTransactions.week", { week: 3 }), value: data.Data.Monthly.Week3 },
            { interval: t("TopSpending.CategorizeTransactions.week", { week: 4 }), value: data.Data.Monthly.Week4 },
          ],
        },
      };
      if (data.Data.Daily) {
        returedData.Daily = {
          total: data.Data.Daily.Total,
          chartData: [
            { interval: "00-04", value: data.Data.Daily.H0004 },
            { interval: "04-08", value: data.Data.Daily.H0408 },
            { interval: "08-12", value: data.Data.Daily.H0812 },
            { interval: "12-16", value: data.Data.Daily.H1216 },
            { interval: "16-20", value: data.Data.Daily.H1620 },
            { interval: "20-24", value: data.Data.Daily.H2024 },
          ],
        };
      }
      if (data.Data.Weekly) {
        returedData.Weekly = {
          total: data.Data.Weekly.Total,
          chartData: [
            { interval: t("TopSpending.CategorizeTransactions.days.sunday"), value: data.Data.Weekly.Sunday },
            { interval: t("TopSpending.CategorizeTransactions.days.monday"), value: data.Data.Weekly.Monday },
            { interval: t("TopSpending.CategorizeTransactions.days.tuesday"), value: data.Data.Weekly.Tuesday },
            { interval: t("TopSpending.CategorizeTransactions.days.wednesday"), value: data.Data.Weekly.Wednesday },
            { interval: t("TopSpending.CategorizeTransactions.days.thursday"), value: data.Data.Weekly.Thursday },
            { interval: t("TopSpending.CategorizeTransactions.days.friday"), value: data.Data.Weekly.Friday },
            { interval: t("TopSpending.CategorizeTransactions.days.saturday"), value: data.Data.Weekly.Saturday },
          ],
        };
      }
      return returedData;
    }
    case IntervalTypes.YEAR:
      return {
        Yearly: {
          total: data.Data.Yearly.Total,
          chartData: [
            { interval: t("TopSpending.CategorizeTransactions.months.january"), value: data.Data.Yearly.Jan },
            { interval: t("TopSpending.CategorizeTransactions.months.february"), value: data.Data.Yearly.Feb },
            { interval: t("TopSpending.CategorizeTransactions.months.march"), value: data.Data.Yearly.Mar },
            { interval: t("TopSpending.CategorizeTransactions.months.april"), value: data.Data.Yearly.Apr },
            { interval: t("TopSpending.CategorizeTransactions.months.may"), value: data.Data.Yearly.May },
            { interval: t("TopSpending.CategorizeTransactions.months.june"), value: data.Data.Yearly.Jun },
            { interval: t("TopSpending.CategorizeTransactions.months.july"), value: data.Data.Yearly.Jul },
            { interval: t("TopSpending.CategorizeTransactions.months.august"), value: data.Data.Yearly.Aug },
            { interval: t("TopSpending.CategorizeTransactions.months.september"), value: data.Data.Yearly.Sep },
            { interval: t("TopSpending.CategorizeTransactions.months.october"), value: data.Data.Yearly.Oct },
            { interval: t("TopSpending.CategorizeTransactions.months.november"), value: data.Data.Yearly.Nov },
            { interval: t("TopSpending.CategorizeTransactions.months.december"), value: data.Data.Yearly.Dec },
          ],
        },
      };
    case IntervalTypes.LAST_SIX_MONTH:
    default: {
      const chartData: SingleBarChart[] =
        data.Months && Array.isArray(data.Months)
          ? data.Months.map(item => ({ interval: item.Month, value: item.Amount })).reverse()
          : [];
      return { total: data.Total, chartData };
    }
  }
}
