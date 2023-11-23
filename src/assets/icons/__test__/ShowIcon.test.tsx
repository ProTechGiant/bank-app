import { create } from "react-test-renderer";

import { ShowIcon } from "../ShowIcon";

describe("icon/ShowIcon", () => {
  it("renders a ShowIcon", () => {
    const result = create(<ShowIcon />);

    expect(result).toMatchSnapshot();
  });
});
