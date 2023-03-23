import { useTranslation } from "react-i18next";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import TemporaryAddress from "@/components/TemporaryAddress";
import useNavigation from "@/navigation/use-navigation";
import { Address } from "@/types/Address";

import { useOrderCardContext } from "../../context/OrderCardContext";

export default function SetTemporaryAddressScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { orderCardValues, setOrderCardValues } = useOrderCardContext();

  const handleOnSubmit = (values: Address) => {
    setOrderCardValues({
      ...orderCardValues,
      formValues: {
        ...orderCardValues.formValues,
        AlternateAddress: values,
      },
    });
    navigation.navigate("ApplyCards.SetPinAndAddress");
  };

  return (
    <Page>
      <NavHeader
        title={t("ApplyCards.SetTemporaryAddressScreen.navTitle")}
        withBackButton={false}
        end={<NavHeader.CloseEndButton onPress={() => navigation.navigate("ApplyCards.SetPinAndAddress")} />}
      />
      <TemporaryAddress onSubmit={handleOnSubmit} address={orderCardValues.formValues.AlternateAddress} />
    </Page>
  );
}
