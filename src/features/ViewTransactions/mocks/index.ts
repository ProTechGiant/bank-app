import { PredefinedTagType, TagIconType, TransactionDetailed } from "../types";

export const pendingMocksData: TransactionDetailed = {
  cardType: "1",
  status: "pending",
  location: "Montparnasse, Paris, FR",
  title: "H&M Shop",
  subTitle: "Online transaction",
  amount: "10.00",
  currency: "SAR",
  transactionDate: [2022, 2, 20, 0, 0],
  roundUpsAmount: "false",
};

export const tagIcons: TagIconType[] = [
  {
    id: 1,
    name: "Bills & Subscriptions",
    path: "M16.5 1.5L15 0L13.5 1.5L12 0L10.5 1.5L9 0L7.5 1.5L6 0L4.5 1.5L3 0L1.5 1.5L0 0V20L1.5 18.5L3 20L4.5 18.5L6 20L7.5 18.5L9 20L10.5 18.5L12 20L13.5 18.5L15 20L16.5 18.5L18 20V0L16.5 1.5ZM16 17.09H2V2.91H16V17.09ZM3 13H15V15H3V13ZM3 9H15V11H3V9ZM3 5H15V7H3V5Z",
  },
  {
    id: 2,
    name: "Food",
    path: "M5.79945 11.1285L8.62945 8.29853L1.60945 1.28853C0.0494531 2.84853 0.0494531 5.37853 1.60945 6.94853L5.79945 11.1285ZM12.5795 9.31853C14.1095 10.0285 16.2595 9.52853 17.8495 7.93853C19.7595 6.02853 20.1295 3.28853 18.6595 1.81853C17.1995 0.358532 14.4595 0.718532 12.5395 2.62853C10.9495 4.21853 10.4495 6.36853 11.1595 7.89853L1.39945 17.6585L2.80945 19.0685L9.69945 12.1985L16.5795 19.0785L17.9895 17.6685L11.1095 10.7885L12.5795 9.31853Z",
  },
  {
    id: 3,
    name: "Cart",
    path: "M6.99609 16C5.89609 16 5.00609 16.9 5.00609 18C5.00609 19.1 5.89609 20 6.99609 20C8.09609 20 8.99609 19.1 8.99609 18C8.99609 16.9 8.09609 16 6.99609 16ZM16.9961 16C15.8961 16 15.0061 16.9 15.0061 18C15.0061 19.1 15.8961 20 16.9961 20C18.0961 20 18.9961 19.1 18.9961 18C18.9961 16.9 18.0961 16 16.9961 16ZM15.5461 11C16.2961 11 16.9561 10.59 17.2961 9.97L20.8761 3.48C21.2461 2.82 20.7661 2 20.0061 2H5.20609L4.26609 0H0.996094V2H2.99609L6.59609 9.59L5.24609 12.03C4.51609 13.37 5.47609 15 6.99609 15H18.9961V13H6.99609L8.09609 11H15.5461ZM6.15609 4H18.3061L15.5461 9H8.52609L6.15609 4Z",
  },
  {
    id: 4,
    name: "Aeroplane",
    path: "M20 14V12L11.5 7V1.5C11.5 0.67 10.83 0 10 0C9.17 0 8.5 0.67 8.5 1.5V7L0 12V14L8.5 11.5V17L6 18.5V20L10 19L14 20V18.5L11.5 17V11.5L20 14Z",
  },
  {
    id: 5,
    name: "Shopping",
    path: "M14 4H12C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4H2C0.9 4 0 4.9 0 6V18C0 19.1 0.9 20 2 20H14C15.1 20 16 19.1 16 18V6C16 4.9 15.1 4 14 4ZM8 2C9.1 2 10 2.9 10 4H6C6 2.9 6.9 2 8 2ZM14 18H2V6H4V8C4 8.55 4.45 9 5 9C5.55 9 6 8.55 6 8V6H10V8C10 8.55 10.45 9 11 9C11.55 9 12 8.55 12 8V6H14V18Z",
  },
  {
    id: 6,
    name: "Menu",
    path: "M20 6V2C20 0.89 19.1 0 18 0H2C0.9 0 0.00999999 0.89 0.00999999 2V6C1.11 6 2 6.9 2 8C2 9.1 1.11 10 0 10V14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V10C18.9 10 18 9.1 18 8C18 6.9 18.9 6 20 6ZM18 4.54C16.81 5.23 16 6.53 16 8C16 9.47 16.81 10.77 18 11.46V14H2V11.46C3.19 10.77 4 9.47 4 8C4 6.52 3.2 5.23 2.01 4.54L2 2H18V4.54ZM9 11H11V13H9V11ZM9 7H11V9H9V7ZM9 3H11V5H9V3Z",
  },
  {
    id: 7,
    name: "Gift",
    path: "M18 4.5H15.82C15.93 4.19 16 3.85 16 3.5C16 1.84 14.66 0.5 13 0.5C11.95 0.5 11.04 1.04 10.5 1.85L10 2.52L9.5 1.84C8.96 1.04 8.05 0.5 7 0.5C5.34 0.5 4 1.84 4 3.5C4 3.85 4.07 4.19 4.18 4.5H2C0.89 4.5 0.00999999 5.39 0.00999999 6.5L0 17.5C0 18.61 0.89 19.5 2 19.5H18C19.11 19.5 20 18.61 20 17.5V6.5C20 5.39 19.11 4.5 18 4.5ZM13 2.5C13.55 2.5 14 2.95 14 3.5C14 4.05 13.55 4.5 13 4.5C12.45 4.5 12 4.05 12 3.5C12 2.95 12.45 2.5 13 2.5ZM7 2.5C7.55 2.5 8 2.95 8 3.5C8 4.05 7.55 4.5 7 4.5C6.45 4.5 6 4.05 6 3.5C6 2.95 6.45 2.5 7 2.5ZM18 17.5H2V15.5H18V17.5ZM18 12.5H2V6.5H7.08L5 9.33L6.62 10.5L10 5.9L13.38 10.5L15 9.33L12.92 6.5H18V12.5Z",
  },
  {
    id: 8,
    name: "Settings",
    path: "M19.2898 11.9L15.9998 10L19.2898 8.1C19.7698 7.82 19.9298 7.21 19.6598 6.73L17.6598 3.27C17.3798 2.79 16.7698 2.63 16.2898 2.9L12.9998 4.8V1C12.9998 0.45 12.5498 0 11.9998 0H7.99981C7.44981 0 6.99981 0.45 6.99981 1V4.8L3.70981 2.9C3.22981 2.63 2.61981 2.79 2.33981 3.27L0.339812 6.73C0.0598117 7.21 0.229812 7.82 0.709812 8.1L3.99981 10L0.709812 11.9C0.229812 12.18 0.0698117 12.79 0.339812 13.27L2.33981 16.73C2.61981 17.21 3.22981 17.37 3.70981 17.1L6.99981 15.2V19C6.99981 19.55 7.44981 20 7.99981 20H11.9998C12.5498 20 12.9998 19.55 12.9998 19V15.2L16.2898 17.1C16.7698 17.38 17.3798 17.21 17.6598 16.73L19.6598 13.27C19.9398 12.79 19.7698 12.18 19.2898 11.9ZM16.4298 14.87L11.7498 12.17C11.4198 11.97 10.9998 12.21 10.9998 12.6V18H8.99981V12.6C8.99981 12.22 8.57981 11.97 8.24981 12.17L3.56981 14.87L2.56981 13.14L7.24981 10.44C7.57981 10.25 7.57981 9.77 7.24981 9.57L2.56981 6.87L3.56981 5.14L8.24981 7.84C8.57981 8.03 8.99981 7.79 8.99981 7.4V2H10.9998V7.4C10.9998 7.78 11.4198 8.03 11.7498 7.83L16.4298 5.13L17.4298 6.86L12.7498 9.56C12.4198 9.75 12.4198 10.23 12.7498 10.43L17.4298 13.13L16.4298 14.87Z",
  },
  {
    id: 9,
    name: "Family Spending",
    path: "M10 3.19L15 7.69V15.5H13V9.5H7V15.5H5V7.69L10 3.19ZM10 0.5L0 9.5H3V17.5H9V11.5H11V17.5H17V9.5H20L10 0.5Z",
  },
];

export const createNewTag: PredefinedTagType = {
  id: 1,
  name: "Create a new Tag",
  viewBox: "0 0 12 12",
  path: "M11.8332 6.83366H6.83317V11.8337H5.1665V6.83366H0.166504V5.16699H5.1665V0.166992H6.83317V5.16699H11.8332V6.83366Z",
};
