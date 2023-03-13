import Clipboard from "@react-native-clipboard/clipboard";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, View } from "react-native";

import { GlobeIcon } from "@/assets/icons";
// import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { TableListCard, TableListCardGroup } from "@/components/TableList";
import Typography from "@/components/Typography";
// import useNavigation from "@/navigation/use-navigation";

const PasscodeScreen = () => {
  // const navigation = useNavigation();
  const { t } = useTranslation();

  // const backToStart = () => {
  //   navigation.navigate("Onboarding.SplashScreen");
  // };

  //this page is for PR testing purposes
  const { control, handleSubmit } = useForm({
    mode: "onBlur",
    defaultValues: {
      toggle: false,
      todaysDate: undefined,
    },
  });

  const handleOnSubmit = async values => {
    console.log(values);
  };

  const handleCopy = (text: string | undefined) => {
    if (text !== undefined) {
      Clipboard.setString(text);
      Alert.alert(`Copied "${text}" to clipboard`);
    } else {
      Alert.alert(`Error copying text`);
    }
  };

  return (
    <Page>
      <NavHeader title="Testing for component" withBackButton={false} color="black" end="close" />
      <ContentContainer isScrollView={true}>
        <TableListCardGroup>
          <TableListCard
            label="toggle label toggle label toggle label toggle label toggle label toggle label toggle label toggle label toggle label "
            helperText="toggle hint"
            // onInfoPress={() => Alert.alert("Info button ")}
          >
            <TableListCard.Toggle name="toggle" control={control} />
          </TableListCard>

          <TableListCard
            label="date label date label date label date label date label date label date label date label "
            helperText="date hint">
            <TableListCard.Date
              control={control}
              name="todaysDate"
              buttonText={t("TableList.datePicker.buttonText")}
              headerText={t("TableList.datePicker.headerText")}
              placeHolder={t("TableList.datePicker.placeholder")}
            />
          </TableListCard>

          <TableListCard label="copy label" helperText="copy copy hint">
            <TableListCard.Copy onCopyPress={() => handleCopy("Copy Copy Hint")} />
          </TableListCard>

          <TableListCard label="chevron label" onChevronPress={() => Alert.alert("Chevron pressable")}>
            <TableListCard.Chevron />
          </TableListCard>
          <TableListCard label="copy label" helperText="copy copy hint">
            <TableListCard.Copy onCopyPress={() => handleCopy("Copy Copy Hint")} />
          </TableListCard>
          <TableListCard icon={<GlobeIcon width={20} height={20} />} label="label label">
            <TableListCard.Label label="label label" />
          </TableListCard>
          <TableListCard
            icon={<GlobeIcon width={20} height={20} />}
            label="empty label empty label empty label empty label empty label empty label empty label empty label empty label empty label empty label "
            helperText="empty hint"
          />
        </TableListCardGroup>
        <View style={{ marginVertical: 10 }}>
          <TableListCard label="double label" helperText="transparent bg" isTransparent={true}>
            <TableListCard.Label label="double label" />
          </TableListCard>
        </View>
        <TableListCard
          icon={<GlobeIcon width={20} height={20} />}
          label="2nd copy label"
          helperText="this text is copied">
          <TableListCard onCopyPress={() => handleCopy("this text is copied")} />
        </TableListCard>
        <View style={{ marginVertical: 20 }}>
          <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
            <Typography.Text color="neutralBase-50">submit</Typography.Text>
          </SubmitButton>
          {/* <Button onPress={backToStart}>Back to Start</Button> */}
        </View>
      </ContentContainer>
    </Page>
  );
};

export default PasscodeScreen;
