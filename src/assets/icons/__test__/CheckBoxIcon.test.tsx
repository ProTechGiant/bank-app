import { create } from "react-test-renderer";

import { CircularProgressIcon } from "../CircularProgressIcon";

describe("icon/CircularProgressIcon", () => {
  it("renders a CircularProgressIcon", () => {
    const result = create(<CircularProgressIcon />);

    expect(result).toMatchSnapshot();
  });
});
