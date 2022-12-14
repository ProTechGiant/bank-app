import { useFormikContext } from "formik";

import Button from "@/components/Button";

interface FormSubmitButtonProps {
  title: string;
}

const FormSubmitButton = ({ title }: FormSubmitButtonProps) => {
  const { handleSubmit, isValid, dirty, isSubmitting } = useFormikContext();

  return (
    <Button onPress={handleSubmit} disabled={isSubmitting || !isValid || !dirty}>
      {title}
    </Button>
  );
};

export default FormSubmitButton;
