import { Fragment } from "react";
import { View, ViewStyle } from "react-native";

import Divider from "@/components/Divider";
import Stack from "@/components/Stack";
import { useThemeStyles } from "@/theme";

import { DisputeReasonType } from "../types";
import DisputeReason from "./DisputeReason";

interface DisputeReasonsListProps {
  data: DisputeReasonType[];
  onPress: (reasonCode: string) => void;
}

export default function DisputeReasonsList({ data, onPress }: DisputeReasonsListProps) {
  const handleOnPress = (reasonCode: string) => {
    onPress(reasonCode);
  };

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
  }));

  return (
    <Stack direction="vertical" gap="20p" align="stretch" flex={1}>
      {data.map((reason, index) => (
        <Fragment key={reason.PaymentCaseCategoryCode}>
          <DisputeReason
            text={`${reason.PaymentCaseCategoryName} ${
              reason.PaymentCaseCategoryDescription !== undefined &&
              reason.PaymentCaseCategoryDescription !== reason.PaymentCaseCategoryName
                ? " - " + reason.PaymentCaseCategoryDescription
                : ""
            }`}
            onPress={() => handleOnPress(reason.PaymentCaseCategoryCode)}
          />
          {index !== data.length - 1 ? (
            <View style={separatorStyle}>
              <Divider color="neutralBase-40" />
            </View>
          ) : null}
        </Fragment>
      ))}
    </Stack>
  );
}
