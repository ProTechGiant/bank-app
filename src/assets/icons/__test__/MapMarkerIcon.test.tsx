import { create } from "react-test-renderer";

import { MapMarkerIcon } from "../MapMarkerIcon";

describe("icon/MapMarkerIcon", () => {
  it("renders a MapMarkerIcon", () => {
    const result = create(<MapMarkerIcon />);

    expect(result).toMatchSnapshot();
  });
});
