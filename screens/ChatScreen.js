import React, { useLayoutEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';
import { ScrollView } from 'react-native';
import { TextInput } from 'react-native';
import { Keyboard } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { auth, db } from '../firebase';
import firebase from 'firebase';

// route --> helps us to use the passed parameters
const ChatScreen = ({ navigation, route }) => {
	// takes msg input from user
	const [input, setInput] = useState('');
	// stores all the messages of chat room
	const [messages, setMessages] = useState([]);

	useLayoutEffect(() => {
		navigation.setOptions({
			title: 'Chat',
			headerBackTitleVisible: false,
			headerTitleAlign: 'left',
			// adding avatar and text in header title
			headerTitle: () => (
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginRight: 45,
					}}
				>
					{/* displaying the image of the last person who sent message */}
					<Avatar
						rounded
						source={{
							uri: messages[0]?.data.photoURL,
						}}
					/>
					<Text style={{ color: 'white', marginLeft: 10, fontWeight: '700' }}>
						{route.params.chatName}
					</Text>
				</View>
			),

			//  Adding new back icon and then adding its functionality --> to go back
			headerLeft: () => (
				<TouchableOpacity
					style={{ marginLeft: 10 }}
					onPress={navigation.goBack}
				>
					<AntDesign name='arrowleft' size={24} color='white' />
				</TouchableOpacity>
			),

			// header right
			headerRight: () => (
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						width: 80,
						marginRight: 20,
					}}
				>
					<TouchableOpacity>
						<FontAwesome name='video-camera' size={24} color='white' />
					</TouchableOpacity>
					<TouchableOpacity>
						<Ionicons name='call' size={24} color='white' />
					</TouchableOpacity>
				</View>
			),
		});
	}, [navigation, messages]);
	// dependent on navigation & messages

	// func to send message
	const sendMessage = () => {
		// Dissmiss the keybord when you sends a message
		Keyboard.dismiss();

		// storing msg in database
		// go to chats(collection) -> open the docs(having room id as passed as parameter) -> goto messages(collection) -> add the message there
		db.collection('chats').doc(route.params.id).collection('messages').add({
			// using sever timestamp we can avoid different timezone time clash
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			message: input,
			displayName: auth.currentUser.displayName,
			email: auth.currentUser.email,
			photoURL: auth.currentUser.photoURL,
		});

		// clear input after sending msg
		setInput('');
	};

	// useLayoutEffect --> because we're dependent on route
	// Goto chats -> move to doc(selected room id) -> got messages(collection) -> order it by timestamp in desc -> onSnapshot(real time database - react to any change takes snapshot) -> goto each docs inside snapshot, take its data and (store in the messages array)
	useLayoutEffect(() => {
		const unsubscribe = db
			.collection('chats')
			.doc(route.params.id)
			.collection('messages')
			.orderBy('timestamp', 'desc')
			.onSnapshot((snapshot) =>
				setMessages(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						data: doc.data(),
					}))
				)
			);

		// cleanup function
		return unsubscribe;
	}, [route]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<StatusBar style='light' />
			{/* if platform is ios--> apply padding else apply height */}
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.container}
				keyboardVerticalOffset={90}
			>
				{/* when we press anywhere outside on the char screen keyboard should get dismissed */}
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<>
						<ScrollView contentContainerStyle={{ paddingTop: 15 }}>
							{/* Chats goes here */}

							{/* Map through messages and display here */}
							{messages.map(({ id, data }) =>
								data.email === auth.currentUser.email ? (
									<View key={id} style={styles.reciever}>
										<Avatar
											position='absolute'
											rounded
											size={30}
											bottom={-15}
											right={-5}
											// for WEB element
											containerStyle={{
												position: 'absolute',
												bottom: -15,
												right: -5,
											}}
											source={{ uri: data.photoURL }}
										/>
										<Text style={styles.recieverText}>{data.message}</Text>
									</View>
								) : (
									<View key={id} style={styles.sender}>
										<Avatar
											position='absolute'
											bottom={-15}
											left={-5}
											// for WEB element
											containerStyle={{
												position: 'absolute',
												bottom: -15,
												left: -5,
											}}
											rounded
											size={30}
											source={{ uri: data.photoURL }}
										/>
										<Text style={styles.senderText}>{data.message}</Text>
										<Text style={styles.senderName}>{data.displayName}</Text>
									</View>
								)
							)}
						</ScrollView>

						{/* Message Input section */}
						<View style={styles.footer}>
							<TextInput
								style={styles.textInput}
								placeholder='Enter Message'
								value={input}
								onChangeText={(text) => setInput(text)}
								onSubmitEditing={sendMessage}
							/>
							<TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
								<Ionicons name='send' size={24} color='#2B68E6' />
							</TouchableOpacity>
						</View>
					</>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default ChatScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	reciever: {
		// reciever is the user
		padding: 15,
		backgroundColor: '#ECECEC',
		alignSelf: 'flex-end',
		borderRadius: 20,
		marginRight: 15,
		marginBottom: 20,
		maxWidth: '80%',
		position: 'relative',
	},
	sender: {
		// sender is the other user
		padding: 15,
		backgroundColor: '#2B68E6',
		alignSelf: 'flex-start',
		borderRadius: 20,
		margin: 15,
		maxWidth: '80%',
		position: 'relative',
	},
	senderText: {
		color: 'white',
		fontWeight: '500',
		marginLeft: 10,
		marginBottom: 15,
	},
	recieverText: {
		color: 'black',
		fontWeight: '500',
		marginLeft: 10,
	},
	senderName: {
		left: 10,
		paddingRight: 10,
		fontSize: 10,
		color: 'white',
	},
	footer: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		padding: 15,
	},
	textInput: {
		// stick it to bottom
		bottom: 0,
		height: 40,
		flex: 1,
		marginRight: 15,
		backgroundColor: '#ECECEC',
		padding: 10,
		color: 'gray',
		borderRadius: 30,
	},
});
