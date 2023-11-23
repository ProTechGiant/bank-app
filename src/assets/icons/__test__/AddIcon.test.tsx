import { create } from "react-test-renderer";

import { AddIcon } from "../AddIcon";

describe("icon/AddIcon", () => {
  it("renders a AddIcon", () => {
    const result = create(<AddIcon />);

    expect(result).toMatchSnapshot();
  });
});
