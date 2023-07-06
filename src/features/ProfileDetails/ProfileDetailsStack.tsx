import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ProfileDetailsScreen } from "./screens";

export type ProfileDetailsStackParams = {
  "ProfileDetails.ProfileDetailsScreen": undefined;
};

export const Stack = createNativeStackNavigator<ProfileDetailsStackParams>();

export default function ProfileDetailsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={ProfileDetailsScreen} name="ProfileDetails.ProfileDetailsScreen" />
    </Stack.Navigator>
  );
}
