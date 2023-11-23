import { create } from "react-test-renderer";

import { NationalID } from "../NationalID";

describe("icon/NationalID", () => {
  it("renders a NationalID", () => {
    const result = create(<NationalID />);

    expect(result).toMatchSnapshot();
  });
});
