import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

// TODO:its temp for structure
export default function GoalGetterScreen() {
  const navigation = useNavigation();
  const handleOnBackPress = () => {
    navigation.goBack();
  };

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader title=" Goal And Products " onBackPress={handleOnBackPress} />
      <Typography.Header> Temporary screen </Typography.Header>
    </Page>
  );
}
