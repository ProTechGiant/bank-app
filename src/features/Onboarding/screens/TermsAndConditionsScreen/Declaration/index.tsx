import { TextStyle, View } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

const Declaration = () => {
  const headingStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    marginBottom: theme.spacing["8p"],
  }));

  const paragraphStyle = useThemeStyles<TextStyle>(theme => ({
    marginVertical: theme.spacing["8p"],
  }));

  return (
    <View>
      <Typography.Text size="footnote" weight="semiBold" color="primaryBase" style={headingStyle}>
        Introduction
      </Typography.Text>
      <Typography.Text size="caption1" weight="regular" style={paragraphStyle}>
        The Terms and Conditions shall manage your use of our lifestyle offering, Croatia.
      </Typography.Text>
      <Typography.Text size="caption1" weight="regular" style={paragraphStyle}>
        These Terms will be applied fully and affect to your use of Croatia. By using Croatia, you agreed to accept all
        terms and conditions written in here. You must not use Croatia if you disagree with any of these Standard Terms
        and Conditions.
      </Typography.Text>
      <Typography.Text size="caption1" weight="regular" style={paragraphStyle}>
        Minors or people below 18 years old are not allowed to open any banking products with Croatia.
      </Typography.Text>
      <Typography.Text size="footnote" weight="semiBold" color="primaryBase" style={headingStyle}>
        Intellectual Property Rights
      </Typography.Text>
      <Typography.Text size="caption1" weight="regular" style={paragraphStyle}>
        Other than the content you own, Croatia and/or its licensors own all the intellectual property rights and
        materials contained in this Website.
      </Typography.Text>
      <Typography.Text size="caption1" weight="regular" style={paragraphStyle}>
        You are granted limited license only for purposes of viewing the material contained on this Website.
      </Typography.Text>
    </View>
  );
};

export default Declaration;
