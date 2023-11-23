import { create } from "react-test-renderer";

import { CircleQuestionMarkIcon } from "../CircleQuestionMarkIcon";

describe("icon/CircleQuestionMarkIcon", () => {
  it("renders a CircleQuestionMarkIcon", () => {
    const result = create(<CircleQuestionMarkIcon />);

    expect(result).toMatchSnapshot();
  });
});
