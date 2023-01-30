import { SafeAreaView } from "react-native";

import NavHeader from "@/components/NavHeader";
import Typography from "@/components/Typography";

const ForeignTaxScreen = () => {
  return (
    <SafeAreaView>
      <NavHeader title="ForeignTaxScreen"  right="close" />
      <Typography.Text>Your Foreign Tax Residency details</Typography.Text>
    </SafeAreaView>
  );
};

export default ForeignTaxScreen;
