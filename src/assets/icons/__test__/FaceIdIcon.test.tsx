import { create } from "react-test-renderer";

import { FaceIdIcon } from "../FaceIdIcon";

describe("icon/FaceIdIcon", () => {
  it("renders a FaceIdIcon", () => {
    const result = create(<FaceIdIcon />);

    expect(result).toMatchSnapshot();
  });
});
