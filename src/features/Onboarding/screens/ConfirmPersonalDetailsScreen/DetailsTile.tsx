import { useState } from "react";
import { View, ViewStyle } from "react-native";

import { CalendarAltIcon, GlobeIcon, MapMarkerIcon, UserIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { mockNafathData } from "@/mocks/nafathUserData";
import { useThemeStyles } from "@/theme";

const DetailsTile = () => {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-50"],
      borderRadius: theme.radii.small,
      paddingHorizontal: theme.spacing.medium,
      paddingVertical: theme.spacing.xlarge,
    }),
    []
  );

  const data = mockNafathData;
  const userData = data?.User;
  const [firstname, setFirstname] = useState(userData.Firstname);
  const [surname, setSurname] = useState(userData.Surname);
  const [nationality, setNationality] = useState(userData.Nationality);
  const [idExpiry, setIdExpiry] = useState(userData.IdExpiry);
  const [address, setAddress] = useState(userData.Address);

  return (
    <View style={container}>
      <Stack direction="vertical" gap="medium">
        <View>
          <Typography.Text size="callout" weight="medium" color="primaryBase">
            Full Name
          </Typography.Text>
          <Stack direction="horizontal" gap="small">
            <UserIcon />
            <Typography.Text size="footnote" weight="regular">
              {firstname} {surname}
            </Typography.Text>
          </Stack>
        </View>
        <View>
          <Typography.Text size="callout" weight="medium" color="primaryBase">
            Nationality
          </Typography.Text>
          <Stack direction="horizontal" gap="small">
            <GlobeIcon width={14} height={14} />
            <Typography.Text size="footnote" weight="regular">
              {nationality}
            </Typography.Text>
          </Stack>
        </View>
        <View>
          <Typography.Text size="callout" weight="medium" color="primaryBase">
            ID/Iqama expiry
          </Typography.Text>
          <Stack direction="horizontal" gap="small">
            <CalendarAltIcon />
            <Typography.Text size="footnote" weight="regular">
              {idExpiry}
            </Typography.Text>
          </Stack>
        </View>
        <View>
          <Typography.Text size="callout" weight="medium" color="primaryBase">
            KSA address
          </Typography.Text>
          <Stack direction="horizontal" gap="small">
            <MapMarkerIcon />
            <Typography.Text size="footnote" weight="regular">
              At {address}
            </Typography.Text>
          </Stack>
        </View>
      </Stack>
    </View>
  );
};
export default DetailsTile;
