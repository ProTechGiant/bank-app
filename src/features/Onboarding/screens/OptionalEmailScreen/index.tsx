import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Alert, ScrollView } from "react-native";
import * as yup from "yup";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

import useConfirmPersonalDetails from "./use-confirm-personal-details";

interface OptionalEmailFormValues {
  emailAddress: string;
}

export default function OptionalEmailScreen() {
  const navigation = useNavigation();
  const confirmPersonalDetailsAsync = useConfirmPersonalDetails();

  const { control, handleSubmit } = useForm<OptionalEmailFormValues>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      emailAddress: undefined,
    },
  });

  const handleOnSubmit = async (values: OptionalEmailFormValues) => {
    try {
      await confirmPersonalDetailsAsync.mutateAsync(values.emailAddress);
      navigation.navigate("Onboarding.Financial");
    } catch (error) {
      Alert.alert("Woops. Could not confirm your personal details");
      __DEV__ && console.error("Could not confirm personal details: ", error);
    }
  };

  return (
    <Page>
      <NavHeader title="EMAIL" backButton={true} rightComponent="close">
        <ProgressIndicator currentStep={2} totalStep={6} />
      </NavHeader>
      <ScrollView>
        <ContentContainer>
          <Stack align="stretch" direction="vertical" gap="large">
            <Typography.Header size="large" weight="bold">
              Stay updated
            </Typography.Header>
            <Typography.Text size="footnote" weight="regular">
              Share your email and we’ll keep you up to date with what’s new.
            </Typography.Text>
            <TextInput
              control={control}
              name="emailAddress"
              label="Email"
              placeholder="Your address"
              keyboardType="email-address"
            />
            <Stack align="stretch" direction="vertical" gap="small">
              <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
                Continue
              </SubmitButton>
              <Button onPress={handleSubmit(handleOnSubmit)} variant="secondary">
                Skip
              </Button>
            </Stack>
          </Stack>
        </ContentContainer>
      </ScrollView>
    </Page>
  );
}

const validationSchema = yup.object().shape({
  emailAddress: yup.string().optional().email("Please check your email address"),
});
