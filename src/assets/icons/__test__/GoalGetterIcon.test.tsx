import { create } from "react-test-renderer";

import { GoalGetterIcon } from "../GoalGetterIcon";

describe("icon/GoalGetterIcon", () => {
  it("renders a GoalGetterIcon", () => {
    const result = create(<GoalGetterIcon />);

    expect(result).toMatchSnapshot();
  });
});
