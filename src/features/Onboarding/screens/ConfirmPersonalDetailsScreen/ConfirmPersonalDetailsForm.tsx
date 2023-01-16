import { useForm } from "react-hook-form";
import { View, ViewStyle } from "react-native";

import CheckboxInput from "@/components/Form/CheckboxInput";
import SubmitButton from "@/components/Form/SubmitButton";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

interface Values {
  detailsConfirmed: boolean;
}

export default function ConfirmPersonalDetailsForm() {
  const navigation = useNavigation();

  const { control, handleSubmit } = useForm<Values>({
    mode: "onBlur",
    defaultValues: {
      detailsConfirmed: false,
    },
  });

  const containerStyles = useThemeStyles<ViewStyle>(
    theme => ({
      paddingHorizontal: theme.spacing.medium,
    }),
    []
  );

  const buttonWrapperStyles = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: theme.spacing.large,
    }),
    []
  );

  const handleOnSubmit = (_values: Values) => {
    navigation.navigate("Onboarding.OptionalEmail");
  };

  return (
    <View style={containerStyles}>
      <CheckboxInput
        control={control}
        isEditable={true}
        name="detailsConfirmed"
        label="I confirm my details are correct"
      />
      <View style={buttonWrapperStyles}>
        <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
          Continue
        </SubmitButton>
      </View>
    </View>
  );
}
