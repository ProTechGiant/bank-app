import { Fragment } from "react";
import { TextStyle, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { TermsAndConditionBody } from "@/types/Content";

interface TermsAndConditionDetailsProps {
  title: string;
  data: Array<TermsAndConditionBody>;
  index?: number | null;
  typeOfTerms?: "Referral" | "onBoardingTerms";
}

export default function TermsAndConditionDetails({ title, data, index, typeOfTerms }: TermsAndConditionDetailsProps) {
  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    backgroundColor: theme.palette["neutralBase-40"],
    marginHorizontal: -theme.spacing["20p"],
    marginVertical: theme.spacing["20p"],
  }));

  const sectionTitleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["16p"],
  }));

  const headingStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    marginBottom: theme.spacing["8p"],
  }));

  const TitleStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["16p"],
  }));

  const paragraphStyle = useThemeStyles<TextStyle>(theme => ({
    marginVertical: theme.spacing["8p"],
  }));

  return (
    <View>
      {typeof index === "number" ? (
        <>
          <View style={separatorStyle} />
          <Typography.Text color="neutralBase+30" size="title3" weight="medium" style={sectionTitleContainerStyle}>
            {`${index} . ${title}`}
          </Typography.Text>
        </>
      ) : typeOfTerms === "Referral" ? (
        <Typography.Text size="callout" weight="semiBold" style={TitleStyle}>
          {title}
        </Typography.Text>
      ) : typeOfTerms === "onBoardingTerms" ? (
        <Typography.Text size="footnote" weight="semiBold" color="primaryBase" style={headingStyle}>
          {title}
        </Typography.Text>
      ) : (
        <Typography.Text color="neutralBase+30" size="title3" weight="medium">
          {title}
        </Typography.Text>
      )}
      {data.map((term, index_) => {
        return (
          <Fragment key={index_}>
            {typeOfTerms === "Referral" ? (
              <Typography.Text size="footnote" weight="regular" style={paragraphStyle}>
                {term.Body}
              </Typography.Text>
            ) : typeOfTerms === "onBoardingTerms" ? (
              <Typography.Text size="caption1" weight="regular" style={paragraphStyle}>
                {term.Body}
              </Typography.Text>
            ) : (
              <Typography.Text color="neutralBase" size="callout" weight="regular">
                {term.Body}
              </Typography.Text>
            )}
          </Fragment>
        );
      })}
    </View>
  );
}
