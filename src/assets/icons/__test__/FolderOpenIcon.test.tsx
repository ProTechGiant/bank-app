import { create } from "react-test-renderer";

import { FolderOpenIcon } from "../FolderOpenIcon";

describe("icon/FolderOpenIcon", () => {
  it("renders a FolderOpenIcon", () => {
    const result = create(<FolderOpenIcon />);

    expect(result).toMatchSnapshot();
  });
});
