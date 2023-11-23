import { create } from "react-test-renderer";

import { PersonFilledIcon } from "../PersonFilledIcon";

describe("icon/PersonFilledIcon", () => {
  it("renders a PersonFilledIcon", () => {
    const result = create(<PersonFilledIcon />);

    expect(result).toMatchSnapshot();
  });
});
