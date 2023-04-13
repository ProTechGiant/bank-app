import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import { parsePhoneNumber } from "libphonenumber-js";
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
import { TableListCard, TableListCardGroup } from "@/components/TableList";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatIban } from "@/utils";

import { InternalTransfersStackParams } from "../InternalTransfersStack";

interface ConfirmBeneficiaryDeclarationForm {
  confirmBeneficiaryDeclaration: boolean;
}

const schema = yup.object({
  confirmBeneficiaryDeclaration: yup.boolean().isTrue(),
});

export default function ConfirmNewBeneficiaryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const route = useRoute<RouteProp<InternalTransfersStackParams, "InternalTransfers.ConfirmNewBeneficiaryScreen">>();

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
    navigation.navigate("InternalTransfers.ReviewTransferScreen");
  };

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

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  return (
    <Page backgroundColor="neutralBase-50">
      <NavHeader withBackButton />
      <ContentContainer isScrollView style={styles.contentContainer}>
        <Stack direction="vertical" gap="24p" align="stretch">
          <Typography.Text color="neutralBase+30" weight="semiBold" size="title1">
            {t("InternalTransfers.ConfirmNewBeneficiaryScreen.title")}
          </Typography.Text>
          <TableListCardGroup>
            <TableListCard
              isGrouped
              icon={<PersonIcon color={iconColor} />}
              iconBackground="neutralBase-40"
              caption={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.name")}
              label="Last First"
            />
            {route.params.selectionType === "accountId" ? (
              <TableListCard
                isGrouped
                icon={<BankAccountIcon color={iconColor} />}
                iconBackground="neutralBase-40"
                caption={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.accountNumber")}
                label={route.params.selectionValue}
              />
            ) : route.params.selectionType === "mobileNo" ? (
              <TableListCard
                isGrouped
                icon={<PhoneFilledIcon color={iconColor} />}
                iconBackground="neutralBase-40"
                caption={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.mobile")}
                label={parsePhoneNumber(COUNTRY_CODE + route.params.selectionValue).format("INTERNATIONAL")}
              />
            ) : (
              <TableListCard
                isGrouped
                icon={<NumbersIcon color={iconColor} />}
                iconBackground="neutralBase-40"
                caption={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.iban")}
                label={formatIban(route.params.selectionValue)}
              />
            )}
          </TableListCardGroup>
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

const COUNTRY_CODE = "+966";
