import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { create } from "react-test-renderer";

import { InfoFilledCircleIcon } from "@/assets/icons";

import Banner, { BannerProps } from "./index";

const bannerProps: BannerProps = {
  color: "tintBase",
  message: "This is a test",
  icon: <InfoFilledCircleIcon />,
};

describe("components/Banner", () => {
  it("renders a Accent Banner", () => {
    const result = create(<Banner {...bannerProps} />);

    expect(result).toMatchSnapshot();
  });

  it("should display message", () => {
    render(<Banner {...bannerProps} />);
    const output = screen.getByText("This is a test");

    expect(output).toBeOnTheScreen();
  });

  it("should display label", () => {
    render(<Banner {...bannerProps} label="label" />);
    const output = screen.getByText("label");

    expect(output).toBeOnTheScreen();
  });

  it("should display clear icon", async () => {
    const onPress = jest.fn();
    render(<Banner {...bannerProps} onClear={onPress} clearTestID="banner-clear-test" />);
    const output = screen.getByTestId("banner-clear-test");

    await waitFor(() => {
      expect(output).toBeOnTheScreen();
    });
  });

  it("should call clear function", async () => {
    const onPress = jest.fn();
    render(<Banner {...bannerProps} onClear={onPress} clearTestID="banner-clear-test" />);

    fireEvent.press(screen.getByTestId("banner-clear-test"));

    await waitFor(() => {
      expect(onPress).toBeCalledTimes(1);
    });
  });
});
