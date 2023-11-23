import { create } from "react-test-renderer";

import { WifiIcon } from "../WifiIcon";

describe("components/Carousel", () => {
  it("renders a Carousel", () => {
    const result = create(<WifiIcon />);

    expect(result).toMatchSnapshot();
  });
});
