import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { db } from '../firebase';

const CustomListItem = ({ id, chatName, enterChat }) => {
	// stores the chat messages
	const [chatMessages, setChatMessages] = useState([]);

	// listner
	useEffect(() => {
		const unsubscribe = db
			.collection('chats')
			.doc(id)
			.collection('messages')
			.orderBy('timestamp', 'desc')
			.onSnapshot((snapshot) =>
				setChatMessages(snapshot.docs.map((doc) => doc.data()))
			);

		// cleanup function
		return unsubscribe;
	}, []);

	return (
		// Since we're going to display list items so we'll wrap it inside --> ListItem
		// key --> here is unique identifier
		// bottomDivider --> adds line b/w 2 lists
		// on Click --> go to this enterChat func (id, chatName) are args --> which takes us to chatScreen
		<ListItem onPress={() => enterChat(id, chatName)} key={id} bottomDivider>
			{/* rounded --> adds little circle on it */}
			<Avatar
				rounded
				source={{
					uri:
						chatMessages?.[0]?.photoURL ||
						'https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png',
				}}
			/>

			{/* adding list items contents inside --> ListItem.Content */}
			<ListItem.Content>
				<ListItem.Title style={{ fontWeight: '800' }}>
					{chatName}
				</ListItem.Title>

				{/* To display only 1 line of subtitle and adding '...' in the end using --> ellipsizeMode='tail' */}
				<ListItem.Subtitle numberOfLines={1} ellipsizeMode='tail'>
					{chatMessages?.[0]?.displayName}:{chatMessages?.[0]?.message}
				</ListItem.Subtitle>
			</ListItem.Content>
		</ListItem>
	);
};

export default CustomListItem;

const styles = StyleSheet.create({});
