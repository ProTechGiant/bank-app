import { Fragment } from "react";
import { View, ViewStyle } from "react-native";

import Divider from "@/components/Divider";
import Stack from "@/components/Stack";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";

import { DisputeReasonType } from "../types";
import DisputeReason from "./DisputeReason";

interface DisputeReasonsListProps {
  data: DisputeReasonType[];
  onPressReason: (reasonCode: string) => void;
}

export default function DisputeReasonsList({ data, onPressReason }: DisputeReasonsListProps) {
  const handleOnPress = (reasonCode: string) => {
    warn("dispute details", reasonCode);
    onPressReason(reasonCode);
  };

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
  }));

  return (
    <Stack direction="vertical" gap="20p" align="stretch" flex={1}>
      {data.map((reason, index) => (
        <Fragment key={reason.ProblemCategoryCode}>
          <DisputeReason
            text={`${reason.ProblemCategoryName} ${
              reason.ProblemCategoryDescription ? " - " + reason.ProblemCategoryDescription : ""
            }`}
            onPress={() => handleOnPress(reason.ProblemCategoryCode)}
          />
          {index !== data.length - 1 ? (
            <View style={separatorStyle}>
              <Divider color="neutralBase-30" />
            </View>
          ) : null}
        </Fragment>
      ))}
    </Stack>
  );
}
