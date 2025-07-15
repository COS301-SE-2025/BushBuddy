import { fireEvent, render } from "@testing-library/react-native";
import { act } from "react-test-renderer";
import ProfileScreen from "../ProfileScreen";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe("ProfileScreen Component", () => {
  it("renders the profile header correctly", () => {
    const { getByText } = render(<ProfileScreen route={{ params: { username: "Jean" } }} />);
    const headerTitle = getByText("My Profile");
    expect(headerTitle).toBeTruthy();
  });

  it("renders the user's name and role correctly", () => {
    const { getByText } = render(<ProfileScreen route={{ params: { username: "Jean" } }} />);
    const fullName = getByText("Johannes Gerhardus Jean Steyn");
    const role = getByText("Wildlife Researcher");
    expect(fullName).toBeTruthy();
    expect(role).toBeTruthy();
  });

  it("opens the edit profile modal", () => {
    const { getByText } = render(<ProfileScreen />);
    const editProfileButton = getByText("Edit Profile");

    act(() => {
      fireEvent.press(editProfileButton);
    });

    const modalTitle = getByText("Save");
    expect(modalTitle).toBeTruthy();
  });

  it("opens the achievements modal", () => {
    const { getByText } = render(<ProfileScreen />);
    const viewAllAchievementsButton = getByText("View All Achievements");

    act(() => {
      fireEvent.press(viewAllAchievementsButton);
    });

    const modalTitle = getByText("All Achievements");
    expect(modalTitle).toBeTruthy();
  });

  it("renders activity statistics correctly", () => {
    const { getByText } = render(<ProfileScreen />);
    const detections = getByText("87");
    const contributions = getByText("42");
    const accuracy = getByText("94%");
    expect(detections).toBeTruthy();
    expect(contributions).toBeTruthy();
    expect(accuracy).toBeTruthy();
  });
});