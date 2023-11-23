import { create } from "react-test-renderer";

import { QuestionIcon } from "../QuestionIcon";

describe("icon/QuestionIcon", () => {
  it("renders a QuestionIcon", () => {
    const result = create(<QuestionIcon />);

    expect(result).toMatchSnapshot();
  });
});
