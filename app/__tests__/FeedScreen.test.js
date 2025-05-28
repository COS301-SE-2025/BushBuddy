import { render, fireEvent } from "@testing-library/react-native";
import FeedScreen from "../FeedScreen";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe("FeedScreen Component", () => {
  it("renders the header title correctly", () => {
    const { getByTestId } = render(<FeedScreen />);
    const headerTitle = getByTestId("Feed");
    expect(headerTitle).toBeTruthy();
  });

  it("renders the search bar correctly", () => {
    const { getByPlaceholderText } = render(<FeedScreen />);
    const searchBar = getByPlaceholderText("Search Sightings");
    expect(searchBar).toBeTruthy();
  });

  it("renders feed items correctly", () => {
    const { getByText } = render(<FeedScreen />);
    const feedItem = getByText("Elephant Bull Spotted");
    expect(feedItem).toBeTruthy();
  });

  it("opens the post detail modal when a feed item is pressed", () => {
    const { getByTestId } = render(<FeedScreen />);
    const feedItem = getByTestId("feedItem-1"); // Target the specific feed item by ID
    fireEvent.press(feedItem);
    const modalTitle = getByTestId("modalTitle"); // Ensure modal title has a unique testID
    expect(modalTitle).toBeTruthy();
  });
});