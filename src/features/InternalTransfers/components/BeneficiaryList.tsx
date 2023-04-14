import Typography from "@/components/Typography";

import { BeneficiaryType } from "../types";
import Beneficiary from "./Beneficiary";

interface BeneficiaryListProps {
  title: string;
  beneficiaries: BeneficiaryType[];
  onDelete: (id: number) => void;
  onBeneficiaryPress: (accountName: string, accountNumber: string, phoneNumber: string | undefined) => void;
  onMenuPress: (beneficiary: BeneficiaryType) => void;
}

export default function BeneficiaryList({
  title,
  beneficiaries,
  onDelete,
  onBeneficiaryPress,
  onMenuPress,
}: BeneficiaryListProps) {
  return (
    <>
      <Typography.Text size="title3" weight="semiBold">
        {title}
      </Typography.Text>
      {beneficiaries.map(beneficiary => (
        <Beneficiary
          key={beneficiary.BankAccountNumber}
          data={beneficiary}
          onDelete={onDelete}
          onBeneficiaryPress={onBeneficiaryPress}
          onMenuPress={onMenuPress}
        />
      ))}
    </>
  );
}
