import { create } from "react-test-renderer";

import { UploadIcon } from "../UploadIcon";

describe("icon/UploadIcon", () => {
  it("renders a UploadIcon", () => {
    const result = create(<UploadIcon />);

    expect(result).toMatchSnapshot();
  });
});
