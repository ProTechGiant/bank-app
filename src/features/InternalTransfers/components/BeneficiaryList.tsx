import Typography from "@/components/Typography";
import { TransferType } from "@/types/InternalTransfer";

import { BeneficiaryType } from "../types";
import Beneficiary from "./Beneficiary";

interface BeneficiaryListProps {
  title: string;
  beneficiaries: BeneficiaryType[];
  onDelete: (id: number) => void;
  transferType?: TransferType;
  onBeneficiaryPress: (
    accountName: string,
    accountNumber: string,
    phoneNumber: string | undefined,
    iban: string | undefined,
    bankName: string | undefined,
    beneficiaryId: string | undefined
  ) => void;
  onMenuPress: (beneficiary: BeneficiaryType) => void;
  testID?: string;
}

export default function BeneficiaryList({
  title,
  beneficiaries,
  onDelete,
  onBeneficiaryPress,
  onMenuPress,
  transferType,
  testID,
}: BeneficiaryListProps) {
  return (
    <>
      <Typography.Text size="title3" weight="semiBold">
        {title}
      </Typography.Text>
      {beneficiaries.map(beneficiary => (
        <Beneficiary
          key={beneficiary.BeneficiaryId}
          data={beneficiary}
          onDelete={onDelete}
          transferType={transferType}
          onBeneficiaryPress={onBeneficiaryPress}
          onMenuPress={onMenuPress}
          testID={testID !== undefined ? `${testID}-${beneficiary.BeneficiaryId}` : undefined}
        />
      ))}
    </>
  );
}
