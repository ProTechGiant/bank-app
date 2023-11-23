import { create } from "react-test-renderer";

import { PlusIcon } from "../PlusIcon";

describe("icon/PlusIcon", () => {
  it("renders a PlusIcon", () => {
    const result = create(<PlusIcon />);

    expect(result).toMatchSnapshot();
  });
});
