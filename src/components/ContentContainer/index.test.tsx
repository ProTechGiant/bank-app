import { create } from "react-test-renderer";

import ContentContainer from "./index";

describe("components/ContentContainer", () => {
  it("renders a content container", () => {
    const result = create(<ContentContainer>Hello World!</ContentContainer>);

    expect(result).toMatchSnapshot();
  });
});
