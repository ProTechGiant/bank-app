import { CustomerGoal } from "../types";

const mockGoals: CustomerGoal = {
  CreationGoalAvailability: "Y",
  Goals: [
    {
      GoalId: 1,
      GoalName: "Phone",
      TargetDate: "7 Jul, 2025",
      TargetAmount: 100,
      ProductRisk: "High Risk",
      ProductRiskColor: "#FF371E",
      ProductName: "LowRisk Mutual fund",
      CurrentBalance: 80,
      Image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsPL6F0hWyYEA3yJJQONtBT0ONBqew9r0jiOwd2mXn2iCeqFc2whI0rRh4xeSJlkOJ6mU&usqp=CAU",
      ProductColor: "#00AC86",
      GoalPercentageStatus: 80,
      ShortFallStatus: "Y",
      ShortFallValue: 80,
    },
  ],
};

export default mockGoals;
