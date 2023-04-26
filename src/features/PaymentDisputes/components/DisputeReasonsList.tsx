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
  onPressDisputeDetails: () => void;
}

export default function DisputeReasonsList({ data, onPressDisputeDetails }: DisputeReasonsListProps) {
  const handleOnPress = (link: string) => {
    warn("dispute details", link);
    onPressDisputeDetails();
  };

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
  }));

  return (
    <Stack direction="vertical" gap="20p" align="stretch" flex={1}>
      {data.map((reason, index) => (
        <Fragment key={reason.link}>
          <DisputeReason text={reason.text} onPress={() => handleOnPress(reason.link)} />
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
