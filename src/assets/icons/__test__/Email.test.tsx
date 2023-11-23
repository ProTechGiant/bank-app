import { create } from "react-test-renderer";

import { Email } from "../Email";

describe("icon/Email", () => {
  it("renders a Email", () => {
    const result = create(<Email />);

    expect(result).toMatchSnapshot();
  });
});
