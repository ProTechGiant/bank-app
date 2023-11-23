import { create } from "react-test-renderer";

import { SettingsIcon } from "../SettingsIcon";

describe("icon/SettingsIcon", () => {
  it("renders a SettingsIcon", () => {
    const result = create(<SettingsIcon />);

    expect(result).toMatchSnapshot();
  });
});
