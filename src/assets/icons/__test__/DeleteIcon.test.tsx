import { create } from "react-test-renderer";

import { DeleteIcon } from "../DeleteIcon";

describe("icon/DeleteIcon", () => {
  it("renders a DeleteIcon", () => {
    const result = create(<DeleteIcon />);

    expect(result).toMatchSnapshot();
  });
});
