import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TextStyle, ViewStyle } from "react-native";
import { SceneMap, TabBar, TabBarIndicator, TabView } from "react-native-tab-view";

import NavHeader from "@/components/NavHeader";
import Typography from "@/components/Typography";
import { LUX_CARD_PRODUCT_ID, STANDARD_CARD_PRODUCT_ID } from "@/constants";
import { useThemeStyles } from "@/theme";

import { SelectLuxCard, SelectStandardCard } from "../../components";
import { useApplyCardsContext } from "../../context/ApplyCardsContext";

interface PickCardTypeScreenProps {
  onCancel: () => void;
  onSelected: () => void;
  isLoadingOnSelection?: boolean;
  variant: "apply" | "renew" | "order";
  testID: string;
}

export default function PickCardTypeScreen({
  onCancel,
  onSelected,
  isLoadingOnSelection = false,
  variant,
  testID,
}: PickCardTypeScreenProps) {
  const { t } = useTranslation();

  const applyCardsContext = useApplyCardsContext();
  const [index, setIndex] = useState(applyCardsContext.values.CardProductId === LUX_CARD_PRODUCT_ID ? 1 : 0);

  const handleOnCardPress = (productId: typeof STANDARD_CARD_PRODUCT_ID | typeof LUX_CARD_PRODUCT_ID) => {
    applyCardsContext.setValue("CardProductId", productId);
    onSelected();
  };

  const tabBarIndicatorStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase+30"],
  }));

  const tabBarStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    width: "50%",
    alignSelf: "center",
  }));

  const tabLabelStyle = useThemeStyles<TextStyle>(theme => ({
    color: theme.palette["primaryBase-40"],
  }));

  const titleLabelStyle = useThemeStyles<TextStyle>(theme => ({
    margin: theme.spacing["32p"],
  }));

  return (
    <>
      {variant !== "order" ? (
        <NavHeader
          title={
            variant === "apply"
              ? t("CardActions.ApplyCardScreen.PickCardTypeScreen.navTitle")
              : t("CardActions.ApplyCardScreen.CardRenewalScreen.title")
          }
          end={<NavHeader.CloseEndButton onPress={onCancel} />}
          onBackPress={onCancel}
          testID={`${testID}:NavHeader`}
        />
      ) : (
        <Typography.Text style={titleLabelStyle} color="neutralBase+30" weight="semiBold" size="title1">
          {t("CardActions.ApplyCardScreen.PickCardTypeScreen.navTitle")}
        </Typography.Text>
      )}

      <TabView
        navigationState={{
          index,
          routes: [
            { key: "standard", title: t("CardActions.ApplyCardScreen.PickCardTypeScreen.tabs.standard") },
            { key: "lux", title: t("CardActions.ApplyCardScreen.PickCardTypeScreen.tabs.lux") },
          ],
        }}
        // do not allow user to switch cards if they're renewing
        swipeEnabled={variant === "apply"}
        renderTabBar={props => (
          <TabBar
            {...props}
            renderIndicator={indicatorProps => {
              return <TabBarIndicator {...indicatorProps} style={[tabBarIndicatorStyle]} />;
            }}
            style={tabBarStyle}
            labelStyle={tabLabelStyle}
            onTabPress={event => {
              // do not allow user to switch cards if they're renewing
              if (variant === "renew") {
                event.preventDefault();
              }
            }}
            renderLabel={({ route, focused }) => (
              <Typography.Text
                color="neutralBase+30"
                weight="medium"
                size="callout"
                style={{ opacity: focused ? 1 : 0.5 }}>
                {route.title}
              </Typography.Text>
            )}
          />
        )}
        onIndexChange={setIndex}
        renderScene={SceneMap({
          standard: () => (
            <SelectStandardCard
              onPress={() => handleOnCardPress(STANDARD_CARD_PRODUCT_ID)}
              title={
                variant === "apply"
                  ? t("CardActions.ApplyCardScreen.PickCardTypeScreen.standard.button")
                  : variant === "order"
                  ? t("CardActions.ApplyCardScreen.PickCardTypeScreen.navTitle")
                  : t("CardActions.ApplyCardScreen.CardRenewalScreen.title")
              }
              isLoadingOnPress={isLoadingOnSelection}
              testID={testID}
            />
          ),
          lux: () => (
            <SelectLuxCard
              onPress={() => handleOnCardPress(LUX_CARD_PRODUCT_ID)}
              title={
                variant === "apply"
                  ? t("CardActions.ApplyCardScreen.PickCardTypeScreen.lux.button")
                  : t("CardActions.ApplyCardScreen.CardRenewalScreen.title")
              }
              remark={t("CardActions.ApplyCardScreen.PickCardTypeScreen.lux.remarks")}
              testID={testID}
            />
          ),
        })}
      />
    </>
  );
}
