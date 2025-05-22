import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler'; // This must be the first import

// Import screens
import AuthScreen from './AuthScreen';
import FeedScreen from './FeedScreen';
import MainScreen from './MainScreen';
import MapScreen from './MapScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainScreen">
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="MainScreen" 
          component={MainScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="MapScreen" 
          component={MapScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="FeedScreen" 
          component={FeedScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ProfileScreen" 
          component={ProfileScreen} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}