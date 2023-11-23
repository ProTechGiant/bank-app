import { create } from "react-test-renderer";

import { DownloadIcon } from "../DownloadIcon";

describe("icon/DownloadIcon", () => {
  it("renders a DownloadIcon", () => {
    const result = create(<DownloadIcon />);

    expect(result).toMatchSnapshot();
  });
});
