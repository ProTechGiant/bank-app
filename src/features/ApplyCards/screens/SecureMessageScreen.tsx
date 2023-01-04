import { Formik } from "formik";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import * as Yup from "yup";

import FormSubmitButton from "@/components/FormSubmitButton/FormSubmitButton";
import NavHeader from "@/components/NavHeader";
import ProgressIndicator from "@/components/ProgressIndicator";
import TextField from "@/components/TextField";
import Toast from "@/components/Toast";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { spacing } from "@/theme/values";
import { alphaNumericSpaceRegExp } from "@/utils";

type SecureMessageFormValuesType = {
  secureMessage: string;
};

const validationSchema = Yup.object().shape({
  secureMessage: Yup.string()
    .required("Personal message is required")
    .matches(alphaNumericSpaceRegExp, "Personal message is not valid")
    .min(10, "Minimum 10 characters")
    .max(45, "Maximum 45 characters"),
});

export default function SecureMessageScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavHeader title="Order card" backButton={true} />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.progressIndicator}>
            <ProgressIndicator currentStep={1} totalStep={4} />
          </View>
          <View style={styles.header}>
            <Typography.Text size="large" weight="bold">
              Set up 3D Secure Payments
            </Typography.Text>
          </View>
          <Formik
            initialValues={{
              secureMessage: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values: SecureMessageFormValuesType, { setSubmitting }) => {
              console.log(values);
              setTimeout(() => {
                setSubmitting(false);
                navigation.navigate("Cards.CreateCardPin");
              }, 500);
            }}>
            {({ setFieldTouched }) => {
              return (
                <View style={styles.contentContainer}>
                  <View>
                    <View style={styles.paragraph}>
                      <Typography.Text>
                        Enter a message of your choice below. It’ll appear when you make a payment so you know it’s a
                        genuine transaction.
                      </Typography.Text>
                    </View>
                    <View style={{ paddingBottom: 20 }}>
                      <TextField
                        name="secureMessage"
                        placeholder="Enter personal message ..."
                        helperText="*Required"
                        onChange={() => {
                          setFieldTouched("secureMessage", true);
                        }}
                        hasCharacterCount
                        maxLength={45}
                        multiline
                        numberOfLines={2}
                        returnKeyType="done"
                        blurOnSubmit={true}
                      />
                    </View>
                    <Toast
                      borderPosition="left"
                      title="What is 3D Secure?"
                      content="An extra layer of security. If you don’t see your message when you’re making a payment, it could be fraud."
                      variant="compliment"
                    />
                  </View>
                  <View style={styles.button}>
                    <FormSubmitButton title="Save and continue" />
                  </View>
                </View>
              );
            }}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: "auto",
    minWidth: 350,
  },
  container: {
    flex: 1,
    padding: spacing.medium,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    paddingBottom: spacing.medium,
  },
  paragraph: {
    paddingBottom: spacing.large,
  },
  progressIndicator: {
    marginBottom: 44,
    marginTop: 12,
  },
});
