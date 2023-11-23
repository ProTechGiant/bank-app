import { create } from "react-test-renderer";

import { ContactSupportIcon } from "../ContactSupportIcon";

describe("icon/ContactSupportIcon", () => {
  it("renders a ContactSupportIcon", () => {
    const result = create(<ContactSupportIcon />);

    expect(result).toMatchSnapshot();
  });
});
