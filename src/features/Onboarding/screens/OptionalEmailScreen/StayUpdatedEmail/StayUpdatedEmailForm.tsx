import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import Button from "@/components/Button";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";

import { stayUpdatedEmailValidationSchema } from "./StayUpdatedEmailValidation";

interface Values {
  emailAddress: string;
}

export default function StayUpdatedEmailForm() {
  const navigation = useNavigation();

  const { control, handleSubmit } = useForm<Values>({
    mode: "onBlur",
    resolver: yupResolver(stayUpdatedEmailValidationSchema),
  });

  const handleOnSubmit = (_values: Values) => {
    navigation.navigate("Onboarding.Financial");
  };

  const handleOnContinueOnboarding = () => {
    navigation.navigate("Onboarding.Financial");
  };

  return (
    <View style={styles.container}>
      <TextInput
        control={control}
        name="emailAddress"
        label="Email"
        placeholder="Your address"
        keyboardType="email-address"
      />
      <View style={styles.buttonView}>
        <Stack direction="vertical" gap="small">
          <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
            Continue
          </SubmitButton>
          <Button variant="secondary" color="base" onPress={handleOnContinueOnboarding}>
            Skip
          </Button>
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonView: {
    marginTop: "auto",
  },
  container: {
    flex: 1,
  },
});
