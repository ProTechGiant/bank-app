import { create } from "react-test-renderer";

import { SupportAgentIcon } from "../SupportAgentIcon";

describe("icon/SupportAgentIcon", () => {
  it("renders a SupportAgentIcon", () => {
    const result = create(<SupportAgentIcon />);

    expect(result).toMatchSnapshot();
  });
});
