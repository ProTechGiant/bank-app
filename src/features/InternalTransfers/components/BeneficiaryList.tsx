import { TransferType } from "@/types/InternalTransfer";

import { BeneficiaryType } from "../types";
import Beneficiary from "./Beneficiary";

interface BeneficiaryListProps {
  beneficiaries: BeneficiaryType[];
  transferType?: TransferType;
  onBeneficiaryPress: (beneficiary: BeneficiaryType) => void;
  testID?: string;
}

export default function BeneficiaryList({
  beneficiaries,
  onBeneficiaryPress,
  transferType,
  testID,
}: BeneficiaryListProps) {
  return (
    <>
      {beneficiaries.map(beneficiary => (
        <Beneficiary
          key={beneficiary.BeneficiaryId}
          data={beneficiary}
          transferType={transferType}
          onBeneficiaryPress={onBeneficiaryPress}
          testID={testID !== undefined ? `${testID}-${beneficiary.BeneficiaryId}` : undefined}
        />
      ))}
    </>
  );
}
