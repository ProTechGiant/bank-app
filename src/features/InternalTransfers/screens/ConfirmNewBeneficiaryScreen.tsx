import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import * as yup from "yup";

import { BankAccountIcon, ErrorBlackIcon, NumbersIcon, PersonIcon, PhoneFilledIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import Divider from "@/components/Divider";
import CheckboxInput from "@/components/Form/CheckboxInput";
import SubmitButton from "@/components/Form/SubmitButton";
import InlineBanner from "@/components/InlineBanner";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import ListItem from "../components/ListItem";

interface ConfirmBeneficiaryDeclarationForm {
  confirmBeneficiaryDeclaration: boolean;
}

const schema = yup.object({
  confirmBeneficiaryDeclaration: yup.boolean().isTrue(),
});

export default function ConfirmNewBeneficiaryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { control, handleSubmit } = useForm<ConfirmBeneficiaryDeclarationForm>({
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: {
      confirmBeneficiaryDeclaration: false,
    },
  });

  const handleOnPressTermsAndConditions = () => {
    navigation.navigate("InternalTransfers.BeneficiaryDeclarationScreen");
  };

  const handleOnSubmit = () => {
    // TODO: trigger OTP process
  };

  const listContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
  }));

  const checkBoxStackStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "flex-end",
    justifyContent: "space-around",
    marginHorizontal: theme.spacing["12p"],
    paddingBottom: theme.spacing["20p"],
    paddingTop: theme.spacing["12p"],
  }));

  const checkBoxContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["16p"],
  }));

  const checkBoxTextStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingLeft: theme.spacing["16p"],
  }));

  const dividerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
  }));

  return (
    <Page backgroundColor="neutralBase-50">
      <NavHeader withBackButton />
      <ContentContainer isScrollView style={styles.contentContainer}>
        <Stack direction="vertical" gap="24p" align="stretch">
          <Typography.Text color="neutralBase+30" weight="semiBold" size="title1">
            {t("InternalTransfers.ConfirmNewBeneficiaryScreen.title")}
          </Typography.Text>
          <View style={listContainerStyle}>
            <ListItem
              title={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.name")}
              value="Last First"
              icon={<PersonIcon />}
            />
            <Divider color="neutralBase-30" />
            <ListItem
              title={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.accountNumber")}
              value="1111 2222 333 4444"
              icon={<BankAccountIcon />}
            />
            <Divider color="neutralBase-30" />
            <ListItem // TODO: the last two list items will be rendered conditionally once BE sync is done
              title={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.mobile")}
              value="+966 111 222 333"
              icon={<PhoneFilledIcon />}
            />
            <ListItem
              title={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.iban")}
              value="SA03 8000 0000 6080 1016 8463"
              icon={<NumbersIcon />}
            />
          </View>
          <InlineBanner
            icon={<ErrorBlackIcon />}
            text={t("InternalTransfers.ConfirmNewBeneficiaryScreen.bannerMessage")}
          />
        </Stack>
        <View>
          <View style={dividerStyle}>
            <Divider color="neutralBase-30" />
          </View>
          <Stack direction="horizontal" style={checkBoxStackStyle}>
            <View style={checkBoxContainerStyle}>
              <CheckboxInput
                control={control}
                isEditable={true}
                bordered={false}
                name="confirmBeneficiaryDeclaration"
              />
            </View>
            <View style={checkBoxTextStyle}>
              <Typography.Text size="footnote" weight="medium" color="neutralBase">
                {t("InternalTransfers.ConfirmNewBeneficiaryScreen.checkBoxMessage")}
                <Typography.Text
                  size="footnote"
                  weight="medium"
                  color="primaryBase"
                  onPress={handleOnPressTermsAndConditions}>
                  {t("InternalTransfers.ConfirmNewBeneficiaryScreen.termsAndConditions")}
                </Typography.Text>
              </Typography.Text>
            </View>
          </Stack>
          <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
            {t("InternalTransfers.ConfirmNewBeneficiaryScreen.confirmButton")}
          </SubmitButton>
        </View>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: "space-between",
  },
});
