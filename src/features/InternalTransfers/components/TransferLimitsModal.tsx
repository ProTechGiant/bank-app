import Modal from "@/components/Modal";

interface TransferLimitsModalProps {
  onClose: () => void;
  isVisible: boolean;
  testID?: string;
}

export default function TransferLimitsModal({ onClose, isVisible, testID }: Readonly<TransferLimitsModalProps>) {
  return (
    <Modal onClose={onClose} testID={testID} visible={isVisible}>
      {/* TODO: this modal will contains the transfer limit details */}
    </Modal>
  );
}
