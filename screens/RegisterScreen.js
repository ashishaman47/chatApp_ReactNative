import React, { useLayoutEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { auth } from '../firebase';

// since this screen is inside navigation & stack.navigator we get a very important props here --> navigation

const RegisterScreen = ({ navigation }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [imageUrl, setImageUrl] = useState('');

	// useLayoutEffect --> when we navigate to screen just before screen paints/render do something
	useLayoutEffect(() => {
		navigation.setOptions({
			// adding header back title
			headerBackTitle: 'Back to Login',
		});
	}, [navigation]);
	// navigation is the dependency --> do something when we navigate to this page just before it renders something.

	const register = () => {
		auth
			.createUserWithEmailAndPassword(email, password)
			.then((authUser) => {
				// returns a promise --> authUser (if it is then successful)

				// by default authUser gives back 4 object and one of them is user
				// now we'll update user because when we register we are creating user with just email and password, but we have other info too we'll add here
				authUser.user.updateProfile({
					displayName: name,
					photoURL:
						imageUrl ||
						'https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png',
				});
				// if imageUrl is not there add image of a avatar
			})
			.catch((error) => alert(error.message));
	};

	return (
		<KeyboardAvoidingView behavior='padding' style={styles.container}>
			<StatusBar style='light' />

			{/* Adding header */}
			<Text h3 style={{ marginBottom: 50 }}>
				Create a Signal Account
			</Text>

			<View style={styles.inputContainer}>
				<Input
					placeholder='Full Name'
					autoFocus
					type='text'
					value={name}
					onChangeText={(text) => setName(text)}
				/>
				<Input
					placeholder='Email'
					type='email'
					value={email}
					onChangeText={(text) => setEmail(text)}
				/>
				<Input
					placeholder='Password'
					type='password'
					secureTextEntry
					value={password}
					onChangeText={(text) => setPassword(text)}
				/>

				{/* Adding on Press ENTER functionality after last field entry --> using onSubmitEditing */}
				<Input
					placeholder='Profile Picture URL (optional)'
					type='text'
					value={imageUrl}
					onChangeText={(text) => setImageUrl(text)}
					onSubmitEditing={register}
				/>
				{/* calls to register finction on ENTER Press */}
			</View>

			{/* adding raised look in button using --> raised  */}
			{/* containerStyle --> for editing styles of react native element */}
			<Button
				containerStyle={styles.button}
				raised
				onPress={register}
				title='Register'
			/>

			{/* Adding space from keyboard */}
			<View style={{ height: 100 }} />
		</KeyboardAvoidingView>
	);
};

export default RegisterScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
		backgroundColor: 'white',
	},
	inputContainer: {
		width: 300,
	},
	button: {
		width: 200,
		marginTop: 10,
	},
});
