import { useTranslation } from "react-i18next";
import { Pressable, ViewStyle } from "react-native";

import { FinancialInformationIcon, LifestyleIcon } from "@/assets/icons";
import Divider from "@/components/Divider";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { ActivateCardTaskIcon } from "../assets/icons";
import { PendingTask, ScreenRouteNameMappingType } from "../types";

interface BulletinBoardTaskItemProps {
  item: PendingTask;
  index: number;
  showBottomDivider: boolean;
  onTaskActionPress: (targetScreen: keyof ScreenRouteNameMappingType) => () => void;
  onTaskDismissPress: (ActionTypeId: string) => () => void;
  testID?: string;
}

interface TaskItemIconLookupType {
  [key: string]: JSX.Element;
}

const taskItemIconLookup: TaskItemIconLookupType = {
  "redirectdestinationlink/lifestylepreference": <LifestyleIcon />,
  "redirectdestinationlink/accounttopup": <FinancialInformationIcon />,
  "redirectdestinationlink/cardelevatelife": <ActivateCardTaskIcon />,
};

export default function BulletinBoardTaskItem({
  item,
  index,
  showBottomDivider,
  onTaskActionPress,
  onTaskDismissPress,
  testID,
}: BulletinBoardTaskItemProps) {
  const { t } = useTranslation();

  const taskItemContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const taskItemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["12p"],
  }));

  const taskActionButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["8p"],
    borderWidth: 2,
    borderColor: theme.palette.primaryBase,
    borderRadius: theme.radii.xxlarge,
  }));

  const taskDismissButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["8p"],
  }));

  const tasksDividerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["12p"],
  }));

  return (
    <Stack direction="vertical" align="stretch" key={index}>
      <Stack direction="horizontal" style={taskItemContainerStyle}>
        <Stack direction="horizontal" gap="16p" style={taskItemStyle}>
          {taskItemIconLookup[item.RedirectDestinationLink] ?? null}
          <Stack direction="vertical" align="stretch" gap="16p" flex={1}>
            <Stack direction="vertical" align="stretch" gap="4p">
              <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                {item.MessageText}
              </Typography.Text>
              <Typography.Text size="footnote" color="neutralBase">
                {item.Description}
              </Typography.Text>
            </Stack>
            <Stack direction="horizontal" gap="16p" align="center" justify="flex-end">
              {!item.Persistent ? (
                <Pressable
                  testID={testID !== undefined ? `${testID}-DismissButton` : undefined}
                  onPress={onTaskDismissPress(item.ActionTypeId)}
                  style={taskDismissButtonStyle}>
                  <Typography.Text color="primaryBase" size="footnote" weight="medium">
                    {item.SecondaryButtonName || t("Home.DashboardScreen.bulletinBoardSection.dismissTask")}
                  </Typography.Text>
                </Pressable>
              ) : null}
              <Pressable
                testID={testID !== undefined ? `${testID}-TaskActionButton` : undefined}
                onPress={onTaskActionPress(item.RedirectDestinationLink)}
                style={taskActionButtonStyle}>
                <Typography.Text color="primaryBase" size="footnote" weight="medium">
                  {item.ButtonName}
                </Typography.Text>
              </Pressable>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {showBottomDivider ? <Divider height={4} color="neutralBase-40" style={tasksDividerStyle} /> : null}
    </Stack>
  );
}
