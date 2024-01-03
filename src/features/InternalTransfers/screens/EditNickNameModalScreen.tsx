import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Yup from "yup";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { alphaRegExp } from "@/utils";

import { useUpdateBeneficiaryNickname } from "../hooks/query-hooks";
import { AddBeneficiary, TransfersType } from "../types";
interface BeneficiaryNickname {
  beneficiaryNickname: string;
}
export default function EditNickNameModalScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const updateBeneficiaryNickname = useUpdateBeneficiaryNickname();
  const { setBeneficiary, beneficiary } = useInternalTransferContext();

  const [beneficiaryName, setBeneficiaryName] = useState<string>("");
  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);
  const [isButtonDisable, setIsButtonDisable] = useState(false);

  const handleOnSubmit = async (values: BeneficiaryNickname) => {
    try {
      await updateBeneficiaryNickname.mutateAsync({
        BeneficiaryId: beneficiary.beneficiaryId,
        NickName: values.beneficiaryNickname,
      });
      if (values.beneficiaryNickname) setBeneficiary({ ...beneficiary, ...{ nickname: values.beneficiaryNickname } });
      navigation.goBack();
    } catch (error) {
      setIsGenericErrorModalVisible(true);
    }
  };
  const validationSchema = useMemo(
    () =>
      Yup.object({
        beneficiaryNickname: Yup.string()
          .when("beneficiary.type", {
            is: type => type === TransfersType.CROATIA_TO_ARB_TRANSFER || type === TransfersType.INTERNAL_TRANSFER,
            then: Yup.string().when("beneficiary.nickname", {
              is: nickname => nickname !== undefined && nickname?.length > 1,
              then: Yup.string().required(t("InternalTransfers.EditNickNameModalScreen.errorNicknameMandatory")).min(1),
            }),
          })
          .matches(alphaRegExp, t("InternalTransfers.EditNickNameModalScreen.errorSpecialCharacter")),
      }),
    [t]
  );
  const { control, handleSubmit, setValue, watch } = useForm<AddBeneficiary>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      beneficiaryNickname: beneficiary?.nickname ? beneficiary?.nickname : "",
    },
  });
  const beneficiaryNicknameValue = watch("beneficiaryNickname");
  useEffect(() => {
    if (beneficiaryNicknameValue) setBeneficiaryName(beneficiaryNicknameValue);
    !beneficiaryNicknameValue?.match(alphaRegExp) || beneficiaryNicknameValue.length < 1
      ? setIsButtonDisable(true)
      : setIsButtonDisable(false);
  }, [beneficiaryNicknameValue]);

  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    marginVertical: theme.spacing["24p"],
  }));

  const accountFormContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    justifyContent: "space-between",
    marginTop: theme.spacing["24p"],
  }));

  const textInputStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["8p"],
  }));

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          title={t("InternalTransfers.EditNickNameModalScreen.title")}
          withBackButton={false}
          end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
        />
        <ContentContainer style={mainContainerStyle}>
          <View style={accountFormContainerStyle}>
            <View style={textInputStyle}>
              <TextInput
                control={control}
                label={t("InternalTransfers.EditNickNameModalScreen.nickname")}
                name="beneficiaryNickname"
                placeholder={t("InternalTransfers.EditNickNameModalScreen.nickname")}
                showCharacterCount
                maxLength={28}
                testID="InternalTransfers.EditNickNameModalScreen:NicknameInput"
                onClear={() => setValue("beneficiaryNickname", "")}
              />
            </View>
            <Button
              disabled={beneficiaryName === undefined || beneficiaryName?.length < 1 || isButtonDisable}
              onPress={handleSubmit(handleOnSubmit)}>
              {t("InternalTransfers.EditNickNameModalScreen.save")}
            </Button>
          </View>
        </ContentContainer>
        <NotificationModal
          title={t("errors.generic.title")}
          message={t("errors.generic.message")}
          isVisible={isGenericErrorModalVisible}
          variant="error"
          onClose={() => setIsGenericErrorModalVisible(false)}
          buttons={{
            primary: <Button onPress={() => setIsGenericErrorModalVisible(false)}>{t("errors.generic.button")}</Button>,
          }}
          testID="InternalTransfers.EnterBeneficiaryDetailsScreen:GenericErrorModal"
        />
      </Page>
    </SafeAreaProvider>
  );
}
