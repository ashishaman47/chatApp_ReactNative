import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
// expo icons
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import CustomListItem from '../components/CustomListItem';
import { StatusBar } from 'expo-status-bar';
import { db, auth } from '../firebase';

const HomeScreen = ({ navigation }) => {
	// state to store chat rooms
	const [chats, setChats] = useState([]);

	// runs when the component mounts
	// onSnapshot --> takes realtime snapshot of db
	// for every single doc return an object (id, data) --> set it to chats
	useEffect(() => {
		const unsubscribe = db.collection('chats').onSnapshot((snapshot) =>
			setChats(
				snapshot.docs.map((doc) => ({
					id: doc.id,
					data: doc.data(),
				}))
			)
		);
		// cleanup function
		return unsubscribe;
	}, []);

	// Adding icons in the header on home screen --> and changing header style using navigation.setOptions
	useLayoutEffect(() => {
		navigation.setOptions({
			title: 'Signal',
			// center align header title
			headerTitleAlign: 'center',
			headerStyle: { backgroundColor: '#fff' },
			headerTitleStyle: { color: 'black' },
			headerTintColor: 'black',

			// adding custom functional component on left or right side
			headerLeft: () => (
				// displaying avatar on left side of header
				<View style={{ marginLeft: 20 }}>
					{/* TouchableOpacity --> with this opacity get changed when component get pressed 
					--> we can also reduce opacity with --> activeOpacity
					*/}
					<TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
						<Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
					</TouchableOpacity>
				</View>
			),

			headerRight: () => (
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						width: 80,
						marginRight: 20,
					}}
				>
					<TouchableOpacity activeOpacity={0.5}>
						<AntDesign name='camerao' size={24} color='black' />
					</TouchableOpacity>

					{/* on press --> pushes to AddChat page to create a chat */}
					<TouchableOpacity
						onPress={() => navigation.navigate('AddChat')}
						activeOpacity={0.5}
					>
						<SimpleLineIcons name='pencil' size={24} color='black' />
					</TouchableOpacity>
				</View>
			),
		});
	}, [navigation]);

	// sign out func on press of avatar from header
	const signOutUser = () => {
		auth.signOut().then(() => {
			// returns a promise when it sign out (because of asuync func)

			navigation.replace('Login');

			// navigate to Login by replacing Home
		});
	};

	// enterChat func --> which opens when user click on any list of chat rooms
	const enterChat = (id, chatName) => {
		// takes us to ChatScreen
		// when we navigate we are passing sets of params
		navigation.navigate('Chat', {
			id,
			chatName,
		});
	};

	return (
		// SafeAreaView -> helps to protect against the different screen view getting cut due to different phone edges
		<SafeAreaView>
			{/* Display list of different chats here --> in ScrollView */}
			<StatusBar style='auto' />
			<ScrollView style={styles.container}>
				{/* Displaying all chat rooms */}
				{/* destructure the chats into --> id, data */}
				{chats.map(({ id, data: { chatName } }) => (
					// passing data of each chat room as props to this component --> which render each chat room in form of list
					<CustomListItem
						key={id}
						id={id}
						chatName={chatName}
						// functional props
						enterChat={enterChat}
						// when someone clicks on the list of chat room it calls this func through this props
					/>
				))}
				{/* always pass key --> which helps in efficient re-rending of lists */}
			</ScrollView>
		</SafeAreaView>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	container: {
		// giving ScrollView 100% height
		height: '100%',
	},
});
