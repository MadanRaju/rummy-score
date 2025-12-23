import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationParams } from '../types/index';

// Import screens (will create these next)
import HomeScreen from '../screens/HomeScreen';
import NewGameScreen from '../screens/NewGameScreen';
import ActiveGameScreen from '../screens/ActiveGameScreen';
import ScoreboardScreen from '../screens/ScoreboardScreen';
import ConfigPresetsScreen from '../screens/ConfigPresetsScreen';
import PlayerManagementScreen from '../screens/PlayerManagementScreen';

const Stack = createNativeStackNavigator<NavigationParams>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1a1a2e' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NewGame" component={NewGameScreen} />
        <Stack.Screen name="ActiveGame" component={ActiveGameScreen} />
        <Stack.Screen name="Scoreboard" component={ScoreboardScreen} />
        <Stack.Screen name="ConfigPresets" component={ConfigPresetsScreen} />
        <Stack.Screen 
          name="PlayerManagement" 
          component={PlayerManagementScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

