import { create } from "react-test-renderer";

import { PlusCircleIcon } from "../PlusCircleIcon";

describe("icon/PlusCircleIcon", () => {
  it("renders a PlusCircleIcon", () => {
    const result = create(<PlusCircleIcon />);

    expect(result).toMatchSnapshot();
  });
});
