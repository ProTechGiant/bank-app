import { create } from "react-test-renderer";

import { InfoFilledIcon } from "../InfoFilledIcon";

describe("icon/InfoFilledIcon", () => {
  it("renders a InfoFilledIcon", () => {
    const result = create(<InfoFilledIcon />);

    expect(result).toMatchSnapshot();
  });
});
