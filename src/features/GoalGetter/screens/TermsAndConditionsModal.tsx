import { StyleSheet } from "react-native";

import { Modal } from "@/components";

import { TermsAndConditionsPage } from "../components";
import { useGetTermsAndConditions } from "../hooks/query-hooks";

interface termsProps {
  productId: string;
  isVisible: boolean;
  changeVisibility: (status: boolean) => void;
}

export default function TermsAndConditionsModal({ productId, isVisible, changeVisibility }: termsProps) {
  const { data: termsAndConditions, isLoading, refetch } = useGetTermsAndConditions(productId);
  return (
    <Modal
      visible={isVisible}
      onBack={() => changeVisibility(false)}
      onClose={() => changeVisibility(false)}
      style={styles.modalStyle}>
      <TermsAndConditionsPage
        refetch={refetch}
        termsData={termsAndConditions?.TermsAndConditions}
        isLoading={isLoading}
      />
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalStyle: {
    height: "95%",
    width: "100%",
  },
});
