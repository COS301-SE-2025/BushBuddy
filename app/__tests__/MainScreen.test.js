import { fireEvent, render } from "@testing-library/react-native";
import { FlatList, Text, TouchableOpacity } from "react-native";
import MainScreen from "../MainScreen";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe("MainScreen Component", () => {
  it("renders the welcome message correctly", () => {
    const { getByText } = render(<MainScreen route={{ params: { username: "Jean" } }} />);
    const welcomeMessage = getByText("Welcome,");
    expect(welcomeMessage).toBeTruthy();
  });

  it("renders the search bar correctly", () => {
    const { getByPlaceholderText } = render(<MainScreen />);
    const searchBar = getByPlaceholderText("Search");
    expect(searchBar).toBeTruthy();
  });

  it("renders recent entries correctly", () => {
    const { getByText } = render(<MainScreen />);
    const entry = getByText("Elephant Detection");
    expect(entry).toBeTruthy();
  });

  it("renders detection summary correctly", () => {
    const { getByTestId } = render(<MainScreen />);
    const entry = getByTestId("lions");
    expect(entry).toBeTruthy();
  });

  it("navigates to the info screen when a bestiary item is pressed", () => {
    const mockNavigate = jest.fn();

    jest.mock("@react-navigation/native", () => ({
      useNavigation: () => ({
        navigate: mockNavigate,
      }),
    }));

    const mockEntries = [
      { id: "1", title: "Elephant Detection", date: "2025-05-19", type: "elephant", location: "Sector A4" },
      { id: "2", title: "Lion Sighting", date: "2025-05-19", type: "lion", location: "Sector B2" },
    ];

    const { getByTestId } = render(
      <FlatList
        data={mockEntries}
        renderItem={({ item }) => (
          <TouchableOpacity
            testID={`entry-${item.id}`}
            onPress={() => mockNavigate("InfoScreen", { item })}
          >
            <Text>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    );

    const firstEntryTouchable = getByTestId("entry-1");
    fireEvent.press(firstEntryTouchable);

    expect(mockNavigate).toHaveBeenCalledWith("InfoScreen", {
      item: mockEntries[0],
    });
  });
});