import { create } from "react-test-renderer";

import { ShareDocumentIcon } from "../ShareDocumentIcon";

describe("icon/ShareDocumentIcon", () => {
  it("renders a ShareDocumentIcon", () => {
    const result = create(<ShareDocumentIcon />);

    expect(result).toMatchSnapshot();
  });
});
