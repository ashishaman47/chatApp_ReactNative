import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AddChatScreen from './screens/AddChatScreen';
import ChatScreen from './screens/ChatScreen';

// stack holds all the screen
const Stack = createStackNavigator();

// adding global styles to all the screens inside Stack.Navigator using -> screenOptions
const globalScreenOptions = {
	// adding header style
	headerStyle: { backgroundColor: '#2C6BED' },
	headerTitleStyle: { color: 'white' },
	// changes color of any icons to white added to header
	headerTintColor: 'white',
};

export default function App() {
	return (
		<NavigationContainer>
			{/* Adding the screen */}
			<Stack.Navigator
				// initialRouteName='Home'
				screenOptions={globalScreenOptions}
			>
				<Stack.Screen name='Login' component={LoginScreen}></Stack.Screen>
				<Stack.Screen name='Register' component={RegisterScreen}></Stack.Screen>
				<Stack.Screen name='Home' component={HomeScreen}></Stack.Screen>
				<Stack.Screen name='AddChat' component={AddChatScreen}></Stack.Screen>
				<Stack.Screen name='Chat' component={ChatScreen}></Stack.Screen>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
