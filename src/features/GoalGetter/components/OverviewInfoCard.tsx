import { cloneElement } from "react";
import { Dimensions, StyleSheet, View, ViewStyle } from "react-native";
import Svg, { SvgProps } from "react-native-svg";
import { VictoryLabel, VictoryPie } from "victory-native";

import { IconProps } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface OverviewInfoCardProps {
  title: string;
  Icon: React.ReactElement<SvgProps | IconProps>;
  backgroundColor: string; //TODO  it should have type related to theme but doesnot exist
}

export default function OverviewInfoCard({ title, Icon, backgroundColor }: OverviewInfoCardProps) {
  const boxContainer = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.medium,
    width: Dimensions.get("screen").width * 0.45,
    height: 110,
    alignContent: "flex-start",
    backgroundColor: backgroundColor,
    padding: theme.spacing["12p"],
    marginBottom: theme.spacing["16p"],
  }));

  return (
    <Stack direction="vertical" style={boxContainer} testID="GoalGetter:OverviewInfoCard">
      <Stack direction="horizontal" style={styles.iconTextContainer}>
        {cloneElement(Icon)}
        <Typography.Text size="callout" weight="bold">
          {` ${title}`}
        </Typography.Text>
      </Stack>
      <Stack direction="horizontal" align="center" justify="space-between" style={styles.chartRowContainer}>
        <Typography.Text size="callout" weight="bold">
          200 SAR {/* TODO well be replace once we integrate with  api */}
        </Typography.Text>
        <View style={styles.chartContainer}>
          <Svg viewBox="0 0 200 200">
            <VictoryPie
              standalone={false}
              width={200}
              height={200}
              data={[
                { x: 1, y: 10 },
                { x: 2, y: 90 },
              ]}
              cornerRadius={12}
              labelRadius={75}
              innerRadius={60}
              padAngle={0}
              radius={80}
              colorScale={["black", "#FAFAFA"]}
              labelPosition="centroid"
              labelPlacement="perpendicular"
            />
            <VictoryLabel textAnchor="middle" style={styles.chartMiddleText} x={100} y={100} text="10%" />
          </Svg>
        </View>
      </Stack>
    </Stack>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    height: 47,
    width: 47,
  },
  chartMiddleText: {
    fontSize: 40, // donot use theme with it because it use different size because it inside svg
  },
  chartRowContainer: {
    width: "100%",
  },
  iconTextContainer: {
    height: "50%",
    width: "100%",
  },
});
