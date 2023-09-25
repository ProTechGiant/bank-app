import { View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface TagsProductProps {
  productName: string;
  productColor: string;
}
export default function TagsProduct({ productName, productColor }: TagsProductProps) {
  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: productColor,
    paddingVertical: theme.spacing["4p"],
    paddingHorizontal: theme.spacing["8p"],
  }));

  let titleOfProduct: string;
  /*
    This condition I made it because the response from api for product Name it will be
    Gold / Saving Pot / LowRisk Mutual fund / HighRisk Mutual fund / MediumRisk Mutual Fund
    as you can see if product name Mutual fund it contain another word to explain  type of Risk
    but in this component I just need the product name not type of Risk for that I added this condition
    if product name Gold or Saving Pot i will take it without any changes
    else I will ignore type of risk and just take the product name (Mutual fund)
  */
  if (productName === "Gold" || productName === "Saving Pot") titleOfProduct = productName;
  else titleOfProduct = productName.split(" ").slice(1, 3).join(" ");

  return (
    <View style={contentStyle}>
      <Stack direction="horizontal" align="center" gap="4p">
        <Typography.Text color="neutralBase-60" align="center" size="caption1" weight="semiBold">
          {titleOfProduct}
        </Typography.Text>
      </Stack>
    </View>
  );
}
