import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db } from '../firebase';

const AddChatScreen = ({ navigation }) => {
	// state to keep track of input
	const [input, setInput] = useState('');

	// on compponent mount/ on page load before this page paints --> set header
	useLayoutEffect(() => {
		navigation.setOptions({
			title: 'Add a new Chat',
			headerTitleAlign: 'center',
			headerBackTitle: 'Chats',
			// headerBackTitle is not visible on Android & Web but on IOS to make it visble use this
			headerBackTitleVisible: true,
		});
	}, [navigation]);

	// func to create chat --> async func
	const createChat = async () => {
		// inside chats collection add the chatName
		await db
			.collection('chats')
			.add({
				chatName: input,
			})
			.then(() => {
				// once done navigate the user back to previous screen using --> goBack()
				navigation.goBack();
			})
			.catch((error) => alert(error));
	};

	return (
		<View style={styles.container}>
			<Input
				placeholder='Enter a Chat Name'
				value={input}
				onChangeText={(text) => setInput(text)}
				onSubmitEditing={createChat}
				// adding left icon on input
				leftIcon={
					<Icon name='wechat' type='antdesign' size={24} color='black' />
				}
			/>

			{/* disable the button if there is no input */}
			<Button disabled={!input} onPress={createChat} title='Create new Chat' />
		</View>
	);
};

export default AddChatScreen;

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		padding: 30,
		height: '100%',
	},
});
