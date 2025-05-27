import { fireEvent, render } from "@testing-library/react-native";
import AuthScreen from "../AuthScreen";

const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe("AuthScreen Component", () => {
  it("renders the logo correctly", () => {
    const { getByTestId } = render(<AuthScreen navigation={{ navigate: mockNavigate }} />);
    const logo = getByTestId("logo");
    expect(logo).toBeTruthy();
  });

  it("renders the title correctly", () => {
    const { getByText } = render(<AuthScreen navigation={{ navigate: mockNavigate }} />);
    const title = getByText("African Wildlife Detection");
    expect(title).toBeTruthy();
  });

  it("renders the Get Started button correctly", () => {
    const { getByText } = render(<AuthScreen navigation={{ navigate: mockNavigate }} />);
    const button = getByText("Get Started");
    expect(button).toBeTruthy();
  });

  it("navigates to MainScreen when Get Started button is pressed", () => {
    const { getByText } = render(<AuthScreen navigation={{ navigate: mockNavigate }} />);
    const button = getByText("Get Started");
    fireEvent.press(button);
    expect(mockNavigate).toHaveBeenCalledWith("MainScreen");
  });
});