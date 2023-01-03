import { StyleSheet, View } from "react-native";

import Typography from "@/components/Typography";
import { palette, radii, spacing } from "@/theme/values";
import { mockNafathData } from "@/mocks/nafathUserData";

import { CalendarAltIcon, UserIcon, GlobeIcon, MapMarkerIcon } from "@/assets/icons";
import { useState } from "react";
import { Stack } from "@/components/Stack";
import { Inline } from "@/components/Inline";

const DetailsTile = () => {
  const data = mockNafathData;
  const userData = data?.User;
  const [firstname, setFirstname] = useState(userData.Firstname);
  const [surname, setSurname] = useState(userData.Surname);
  const [nationality, setNationality] = useState(userData.Nationality);
  const [idExpiry, setIdExpiry] = useState(userData.IdExpiry);
  const [address, setAddress] = useState(userData.Address);

  return (
    <View style={styles.container}>
      <Stack space="small">
        <View>
          <Typography.Text size="callout" weight="medium" color="primaryBase">
            Full Name
          </Typography.Text>
          <Inline space="xxSmall">
            <UserIcon />
            <Typography.Text size="footnote" weight="regular">
              {firstname} {surname}
            </Typography.Text>
          </Inline>
        </View>
        <View>
          <Typography.Text size="callout" weight="medium" color="primaryBase">
            Nationality
          </Typography.Text>
          <Inline space="xxSmall">
            <GlobeIcon width={14} height={14} />
            <Typography.Text size="footnote" weight="regular">
              {nationality}
            </Typography.Text>
          </Inline>
        </View>
        <View>
          <Typography.Text size="callout" weight="medium" color="primaryBase">
            ID/Iqama expiry
          </Typography.Text>
          <Inline space="xxSmall">
            <CalendarAltIcon />
            <Typography.Text size="footnote" weight="regular">
              {idExpiry}
            </Typography.Text>
          </Inline>
        </View>
        <View>
          <Typography.Text size="callout" weight="medium" color="primaryBase">
            KSA address
          </Typography.Text>
          <Inline space="xxSmall">
            <MapMarkerIcon />
            <Typography.Text size="footnote" weight="regular">
              At {address}
            </Typography.Text>
          </Inline>
        </View>
      </Stack>
    </View>
  );
};
export default DetailsTile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette["neutralBase-50"],
    borderRadius: radii.small,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.xlarge,
  },
});
