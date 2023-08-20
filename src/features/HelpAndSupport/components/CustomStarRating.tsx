import { Pressable, View, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

import { FilledStar, OutLinedStar } from "../assets/icons";

interface CustomStarRatingProps {
  rate: number;
  onChangeRating: (rate: number) => void;
}

export default function CustomStarRating({ rate, onChangeRating }: CustomStarRatingProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
    flexDirection: "row",
    justifyContent: "center",
  }));

  const ratingRange = [1, 2, 3, 4, 5];

  return (
    <View style={containerStyle}>
      {ratingRange.map(item => {
        return (
          <Pressable
            key={item}
            onPress={() => {
              onChangeRating(item);
            }}>
            {item <= rate ? <FilledStar /> : <OutLinedStar />}
          </Pressable>
        );
      })}
    </View>
  );
}
