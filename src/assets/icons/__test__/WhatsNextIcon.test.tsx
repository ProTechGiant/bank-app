import { create } from "react-test-renderer";

import { WhatsNextIcon } from "../WhatsNextIcon";

describe("icon/WhatsNextIcon", () => {
  it("renders a WhatsNextIcon", () => {
    const result = create(<WhatsNextIcon />);

    expect(result).toMatchSnapshot();
  });
});
