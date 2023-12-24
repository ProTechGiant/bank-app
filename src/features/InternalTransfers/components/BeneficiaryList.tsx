import { TransferType } from "@/types/InternalTransfer";

import { BeneficiaryType } from "../types";
import Beneficiary from "./Beneficiary";

interface BeneficiaryListProps {
  beneficiaries: BeneficiaryType[];
  transferType?: TransferType;
  onBeneficiaryPress: (
    accountName: string,
    accountNumber: string,
    phoneNumber: string | undefined,
    iban: string | undefined,
    bankName: string | undefined,
    beneficiaryId: string | undefined
  ) => void;
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
