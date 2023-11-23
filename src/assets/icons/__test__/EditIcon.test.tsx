import { create } from "react-test-renderer";

import { EditIcon } from "../EditIcon";

describe("icon/EditIcon", () => {
  it("renders a EditIcon", () => {
    const result = create(<EditIcon />);

    expect(result).toMatchSnapshot();
  });
});
