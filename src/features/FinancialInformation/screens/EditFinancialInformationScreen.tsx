import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, TextInput, TextStyle, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { AngleDownIcon } from "@/assets/icons";
import Button from "@/components/Button";
import { DropdownInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { DropdownBottomSheet } from "../components";
import { expectedAmount } from "../mocks/mockExpectedAmount";
import { ListItemType } from "../types";

interface EditFinancialInformationScreenProps {
  onBackPress: () => void;
}

export default function EditFinancialInformationScreen({ onBackPress }: EditFinancialInformationScreenProps) {
  const { t } = useTranslation();

  // ToDo when Api is ready
  const [occupations, setOccupations] = useState<ListItemType[]>([
    { item: "Salary", value: "2", isSelected: true },
    { item: "Charity", value: "1", isSelected: false },
    { item: "Agriculture, forestry, and fishing", value: "922", isSelected: false },
    { item: "Education", value: "822", isSelected: false },
    { item: "Finance and Insurance", value: "922", isSelected: false },
  ]);
  const [useCroatia, setUseCroatia] = useState<ListItemType[]>([
    { item: "Day-to-day spending", value: "2", isSelected: true },
    { item: "Occasional spending", value: "1", isSelected: false },
    { item: "pauing bills ", value: "922", isSelected: false },
    { item: "Education", value: "822", isSelected: false },
    { item: "Receiving a salary", value: "922", isSelected: false },
    { item: "Saving", value: "922", isSelected: false },
  ]);
  const [sourceOfIncome, setSourceOfIncome] = useState<ListItemType[]>([
    { item: "Salary", value: "2", isSelected: true },
    { item: "Savings", value: "1", isSelected: false },
    { item: "End of Service", value: "922", isSelected: false },
  ]);

  const [isOccupationsDropdownVisible, setOccupationsDropdownVisible] = useState(false);
  const [isUseCroatiaDropdownVisible, setUseCroatiaDropdownVisible] = useState(false);
  const [isSourceOfIncomeDropdownVisible, setISourceOfIncomeDropdownVisible] = useState(false);

  const [selectedOccupation, setSelectedOccupation] = useState(occupations.find(item => item.isSelected)?.item);
  const [selectedUseCroatia, setSelectedUseCroatia] = useState(useCroatia.find(item => item.isSelected)?.item);
  const [selectedSourceOfIncome, setSelectedSourceOfIncome] = useState(
    sourceOfIncome.find(item => item.isSelected)?.item
  );
  const [selectedExpectedAmount, setSelectedExpectedAmount] = useState("");

  const [isSubmitButtonEnabled, setIsSubmitButtonEnabled] = useState(false);
  const [isSelectedButtonEnabled, setIsSelectedButtonEnabled] = useState(true);

  useEffect(() => {
    setIsSubmitButtonEnabled(true);
  }, [occupations, useCroatia, sourceOfIncome]);

  const handleOnExpectedAmount = (value: string) => {
    setSelectedExpectedAmount(value);
  };

  const handleOnCancel = () => {
    setOccupationsDropdownVisible(false);
    setUseCroatiaDropdownVisible(false);
    setISourceOfIncomeDropdownVisible(false);
  };

  const handleOnDropdownChange = () => {
    setIsSubmitButtonEnabled(true);
  };

  const handleOnButtonClick = () => {
    setIsSubmitButtonEnabled(false);
  };

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    top: theme.spacing["5p"],
  }));

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    width: theme.spacing.full,
    alignSelf: "center",
    backgroundColor: theme.palette["neutralBase-60"],
    flex: 1,
  }));

  const headerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: theme.spacing.full,
    alignSelf: "center",
  }));

  const subtitleStyle = useThemeStyles<ViewStyle>(theme => ({
    width: theme.spacing.full,
    alignSelf: "center",
    alignContent: "center",
    borderRadius: theme.radii.medium,
    marginTop: theme.spacing["20p"],
    marginBottom: theme.spacing["8p"],
    paddingHorizontal: theme.spacing["14p"],
  }));

  const dropDownContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    marginVertical: theme.spacing["8p"],
  }));

  const containerInputStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.spacing["8p"],
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing["8p"],
  }));

  const inputStyle = useThemeStyles<TextStyle>(theme => ({
    color: theme.palette["neutralBase+30"],
    fontSize: theme.spacing["16p"],
    paddingLeft: theme.spacing["8p"],
    lineHeight: theme.spacing["20p"],
  }));

  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingRight: theme.spacing["10p"],
    paddingVertical: theme.spacing["10p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: theme.spacing.full,
    position: "absolute",
    bottom: theme.spacing["4p"],
    marginTop: theme.spacing["16p"],
  }));

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["10p"],
    paddingVertical: theme.spacing["5p"],
  }));

  return (
    <Page insets={["left", "right", "bottom"]}>
      <View style={headerStyle}>
        <NavHeader title={t("Settings.FinancialInformation.title")} onBackPress={onBackPress} />
      </View>
      <View style={containerStyles}>
        <View style={headerContainerStyle}>
          <View style={subtitleStyle}>
            <Typography.Text color="neutralBase+30" size="title3" weight="medium">
              {t("Settings.FinancialInformation.subTitle")}
            </Typography.Text>
          </View>
        </View>
        <ScrollView>
          <View>
            <View style={dropDownContainerStyle}>
              <Typography.Text weight="medium" size="callout">
                {t("Settings.FinancialInformation.occupation")}
              </Typography.Text>
              <Pressable onPress={() => setOccupationsDropdownVisible(true)} style={containerInputStyle}>
                <TextInput
                  value={selectedOccupation}
                  placeholder={selectedOccupation}
                  editable={false}
                  style={inputStyle}
                />
                <View style={iconContainerStyle}>
                  <AngleDownIcon height={30} width={30} />
                </View>
                <DropdownBottomSheet
                  isVisible={isOccupationsDropdownVisible}
                  items={occupations}
                  onCancel={handleOnCancel}
                  title={t("Settings.FinancialInformation.occupation")}
                  selectedItem={selectedOccupation}
                  isButtonDisabled={isSelectedButtonEnabled}
                  onChange={(data: ListItemType[]) => setOccupations(data)}
                  onChangeButtonVisibility={setIsSelectedButtonEnabled}
                  onChangeSelectedItem={setSelectedOccupation}
                  onSelect={handleOnDropdownChange}
                />
              </Pressable>
            </View>
            <View style={dropDownContainerStyle}>
              <Typography.Text weight="medium" size="callout">
                {t("Settings.FinancialInformation.useCroatia")}
              </Typography.Text>

              <Pressable onPress={() => setUseCroatiaDropdownVisible(true)} style={containerInputStyle}>
                <TextInput
                  value={selectedUseCroatia}
                  placeholder={selectedUseCroatia}
                  editable={false}
                  style={inputStyle}
                />
                <View style={iconContainerStyle}>
                  <AngleDownIcon height={30} width={30} />
                </View>
                <DropdownBottomSheet
                  isVisible={isUseCroatiaDropdownVisible}
                  items={useCroatia}
                  onCancel={handleOnCancel}
                  title={t("Settings.FinancialInformation.useCroatia")}
                  selectedItem={selectedUseCroatia}
                  isButtonDisabled={isSelectedButtonEnabled}
                  onChange={(data: ListItemType[]) => setUseCroatia(data)}
                  onChangeButtonVisibility={setIsSelectedButtonEnabled}
                  onChangeSelectedItem={setSelectedUseCroatia}
                  onSelect={handleOnDropdownChange}
                />
              </Pressable>
            </View>
            <View style={dropDownContainerStyle}>
              <Typography.Text weight="medium" size="callout">
                {t("Settings.FinancialInformation.sourceOfIncome")}
              </Typography.Text>

              <Pressable onPress={() => setISourceOfIncomeDropdownVisible(true)} style={containerInputStyle}>
                <TextInput
                  value={selectedSourceOfIncome}
                  placeholder={selectedSourceOfIncome}
                  editable={false}
                  style={inputStyle}
                />
                <View style={iconContainerStyle}>
                  <AngleDownIcon height={30} width={30} />
                </View>
                <DropdownBottomSheet
                  isVisible={isSourceOfIncomeDropdownVisible}
                  items={sourceOfIncome}
                  onCancel={handleOnCancel}
                  title={t("Settings.FinancialInformation.sourceOfIncome")}
                  selectedItem={selectedSourceOfIncome}
                  isButtonDisabled={isSelectedButtonEnabled}
                  onChange={(data: ListItemType[]) => setSourceOfIncome(data)}
                  onChangeButtonVisibility={setIsSelectedButtonEnabled}
                  onChangeSelectedItem={setSelectedSourceOfIncome}
                  onSelect={handleOnDropdownChange}
                />
              </Pressable>
            </View>

            <View style={dropDownContainerStyle}>
              <DropdownInput
                label={t("Settings.FinancialInformation.spendEachMonth")}
                placeholder={
                  selectedExpectedAmount ? selectedExpectedAmount : t("Settings.FinancialInformation.selectAnAmount")
                }
                options={expectedAmount}
                buttonLabel={t("Settings.FinancialInformation.selectButton")}
                variant="small"
                value={undefined}
                onChange={handleOnExpectedAmount}
              />
            </View>
          </View>
        </ScrollView>

        <View style={buttonContainerStyle}>
          <View style={buttonStyle}>
            <Button onPress={handleOnDropdownChange} disabled={!isSubmitButtonEnabled}>
              {t("Settings.FinancialInformation.saveButton")}
            </Button>
          </View>
          <View style={buttonStyle}>
            <Button onPress={handleOnButtonClick} variant="tertiary">
              {t("Settings.FinancialInformation.cancelButton")}
            </Button>
          </View>
        </View>
      </View>
    </Page>
  );
}
