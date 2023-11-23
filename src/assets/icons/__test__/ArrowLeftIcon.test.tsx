import { create } from "react-test-renderer";

import { ArrowLeftIcon } from "../ArrowLeftIcon";

describe("components/ArrowLeftIcon", () => {
  it("renders a ArrowLeftIcon", () => {
    const result = create(<ArrowLeftIcon />);

    expect(result).toMatchSnapshot();
  });
});
