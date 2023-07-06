/* eslint-disable prettier/prettier */
import { t } from "i18next";

import { ApiNonGroupedTransactionsResponseElement } from "@/hooks/use-transactions";

import { ChartTypes } from "../enum";
import { ChartDataType } from "../types";


export function categorizeTransactions(
    firstTransaction: ApiNonGroupedTransactionsResponseElement[],
    secondTransaction: ApiNonGroupedTransactionsResponseElement[],
    type: ChartTypes
): ChartDataType[] {
    let categorizedData: ChartDataType[] = [];
    switch (type) {
        case ChartTypes.MONTHLY:
            categorizedData = generateCategorizedData(firstTransaction, secondTransaction, type, 4);
            break;
        case ChartTypes.WEEKLY:
            categorizedData = generateCategorizedData(firstTransaction, secondTransaction, type, 7);
            break;
        case ChartTypes.DAILY:
            categorizedData = generateCategorizedData(firstTransaction, secondTransaction, type, 5);
            break;
        case ChartTypes.YEARLY:
            categorizedData = generateCategorizedData(firstTransaction, secondTransaction, type, 12);
            break;
        default:
            break;
    }

    return categorizedData;
}

function generateCategorizedData(
    firstTransaction: ApiNonGroupedTransactionsResponseElement[],
    secondTransaction: ApiNonGroupedTransactionsResponseElement[],
    type: string,
    categoriesCount: number
): ChartDataType[] {
    const categorizedData: ChartDataType[] = Array.from({ length: categoriesCount }, (_, index) => ({
        category: getCategoryLabel(index, categoriesCount),
        series1: 0,
        series2: 0,
    }));

    firstTransaction.forEach(transaction => {
        const categoryIndex = getCategoryIndex(transaction, type);
        const amount = parseFloat(transaction.Amount.Amount);

        categorizedData[categoryIndex].series1 += amount;
    });

    secondTransaction.forEach(transaction => {
        const categoryIndex = getCategoryIndex(transaction, type);
        const amount = parseFloat(transaction.Amount.Amount);

        categorizedData[categoryIndex].series2 += amount;
    });

    return categorizedData;
}

function getCategoryLabel(index: number, categoriesCount: number): string {
    if (categoriesCount === 4) {
        return t("TopSpending.CategorizeTransactions.week", { week: index });
    } else if (categoriesCount === 7) {
        const daysOfWeek = [
            t("TopSpending.CategorizeTransactions.days.sunday"),
            t("TopSpending.CategorizeTransactions.days.monday"),
            t("TopSpending.CategorizeTransactions.days.tuesday"),
            t("TopSpending.CategorizeTransactions.days.wednesday"),
            t("TopSpending.CategorizeTransactions.days.thursday"),
            t("TopSpending.CategorizeTransactions.days.friday"),
            t("TopSpending.CategorizeTransactions.days.saturday"),
        ];
        return daysOfWeek[index];
    } else if (categoriesCount === 5) {
        const hoursOfDay = [
            t("TopSpending.CategorizeTransactions.hours.12AM"),
            t("TopSpending.CategorizeTransactions.hours.6AM"),
            t("TopSpending.CategorizeTransactions.hours.12PM"),
            t("TopSpending.CategorizeTransactions.hours.6PM"),
            t("TopSpending.CategorizeTransactions.hours.12AM") + " ",
        ];
        return hoursOfDay[index];
    } else if (categoriesCount === 12) {
        const monthsOfYear = [
            t("TopSpending.CategorizeTransactions.months.january"),
            t("TopSpending.CategorizeTransactions.months.february"),
            t("TopSpending.CategorizeTransactions.months.march"),
            t("TopSpending.CategorizeTransactions.months.april"),
            t("TopSpending.CategorizeTransactions.months.may"),
            t("TopSpending.CategorizeTransactions.months.june"),
            t("TopSpending.CategorizeTransactions.months.july"),
            t("TopSpending.CategorizeTransactions.months.august"),
            t("TopSpending.CategorizeTransactions.months.september"),
            t("TopSpending.CategorizeTransactions.months.october"),
            t("TopSpending.CategorizeTransactions.months.november"),
            t("TopSpending.CategorizeTransactions.months.december"),
        ];
        return monthsOfYear[index];
    }

    return "";
}

function getCategoryIndex(transaction: ApiNonGroupedTransactionsResponseElement, type: string): number {
    const bookingDate = new Date(...transaction.BookingDateTime.slice(0, -1));
    if (type === ChartTypes.MONTHLY) {
        return Math.ceil(bookingDate.getDate() / 7) - 1;
    } else if (type === ChartTypes.WEEKLY) {
        return bookingDate.getDay();
    } else if (type === ChartTypes.DAILY) {
        const hours = bookingDate.getHours();
        return hoursMapper(hours) / 6;
    } else if (type === ChartTypes.YEARLY) {
        return bookingDate.getMonth();
    }
    return 0;
}

function hoursMapper(hour: number): number {
    if (hour >= 0 && hour <= 5) {
        return 0;
    } else if (hour >= 6 && hour <= 12) {
        return 6;
    } else if (hour >= 13 && hour <= 18) {
        return 12;
    } else {
        return 18;
    }
}
