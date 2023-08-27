import { Pressable } from "react-native";

import Stack from "@/components/Stack";

import { FilledStar, OutLinedStar } from "../assets/icons";

interface CustomStarRatingProps {
  rate: number;
  onChangeRating: (rate: number) => void;
}

export default function CustomStarRating({ rate, onChangeRating }: CustomStarRatingProps) {
  const ratingRange = [1, 2, 3, 4, 5];

  return (
    <Stack direction="horizontal" align="center" gap="12p">
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
    </Stack>
  );
}
