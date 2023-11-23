import { create } from "react-test-renderer";

import { SafetyNetIcon } from "../SafetyNetIcon";

describe("icon/SafetyNetIcon", () => {
  it("renders a SafetyNetIcon", () => {
    const result = create(<SafetyNetIcon />);

    expect(result).toMatchSnapshot();
  });
});
