import { useState } from "react";
import { useWindowDimensions } from "react-native";
import { NavigationState, SceneMap, SceneRendererProps, TabBar, TabBarIndicator, TabView } from "react-native-tab-view";

import { palette } from "@/theme/values";

import SelectLuxCard from "./SelectLuxCard";
import SelectStandardCard from "./SelectStandardCard";
import Typography from "@/components/Typography";

const standardRoute = () => <SelectStandardCard />;

const luxRoute = () => <SelectLuxCard />;

const renderScene = SceneMap({
  standard: standardRoute,
  lux: luxRoute,
});

export default function SegmentedControl() {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "standard", title: "Standard" },
    { key: "lux", title: "Lux" },
  ]);

  const renderTabBar = (
    props: SceneRendererProps & {
      navigationState: NavigationState<{ key: string; title: string }>;
    }
  ) => (
    <TabBar
      {...props}
      renderIndicator={indicatorProps => {
        const width = indicatorProps.getTabWidth(index);
        return (
          <TabBarIndicator
            {...indicatorProps}
            width={width / 2}
            style={{ backgroundColor: palette["neutralBase+30"], left: width / 4 }}
          />
        );
      }}
      style={{ backgroundColor: palette["neutralBase-40"] }}
      labelStyle={{ color: palette["neutralBase+30"] }}
      renderLabel={({ route, focused }) => (
        <Typography.Text color="neutralBase+30" weight="medium" size="callout" style={{ opacity: focused ? 1 : 0.5 }}>
          {route.title}
        </Typography.Text>
      )}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
}
