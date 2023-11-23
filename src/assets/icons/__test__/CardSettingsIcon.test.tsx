import { create } from "react-test-renderer";

import { CardSettingsIcon } from "../CardSettingsIcon";

describe("icon/CardSettingsIcon", () => {
  it("renders a CardSettingsIcon", () => {
    const result = create(<CardSettingsIcon />);

    expect(result).toMatchSnapshot();
  });
});
