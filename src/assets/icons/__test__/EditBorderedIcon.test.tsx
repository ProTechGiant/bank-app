import { create } from "react-test-renderer";

import { EditBorderedIcon } from "../EditBorderedIcon";

describe("icon/EditBorderedIcon", () => {
  it("renders a EditBorderedIcon", () => {
    const result = create(<EditBorderedIcon />);

    expect(result).toMatchSnapshot();
  });
});
