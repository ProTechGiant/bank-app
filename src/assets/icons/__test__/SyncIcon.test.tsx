import { create } from "react-test-renderer";

import { SyncIcon } from "../SyncIcon";

describe("icon/SyncIcon", () => {
  it("renders a SyncIcon", () => {
    const result = create(<SyncIcon />);

    expect(result).toMatchSnapshot();
  });
});
