import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView } from 'react-native';
import { auth } from '../firebase';

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	// listner which run when component mounts
	useEffect(() => {
		// gives the authenticated user
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			// authUser will be empty if user is not signedIn
			console.log(authUser);
			if (authUser) {
				// if user is authenticated push them to home page
				navigation.replace('Home');
			}
		});

		// cleanup function
		return unsubscribe;
	}, []);

	// login function
	const signIn = () => {
		// we have not used promise here because we have used listner above which listen on auth state change
		auth
			.signInWithEmailAndPassword(email, password)
			.catch((error) => alert(error.message));
	};

	return (
		// KeyboardAvoidingView -> doesn't hide the view when keyboard opens
		<KeyboardAvoidingView behavior='padding' style={styles.container}>
			<StatusBar style='light' />
			<Image
				source={{
					uri: 'https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png',
				}}
				style={{ width: 200, height: 200 }}
			/>
			<View style={styles.inputContainer}>
				{/* Input element */}
				{/* autoFocus -> when page reloads autoFocus is here */}
				<Input
					placeholder='Email'
					autoFocus
					value={email}
					onChangeText={(text) => setEmail(text)}
					type='email'
				/>
				<Input
					placeholder='Password'
					secureTextEntry
					type='password'
					value={password}
					onChangeText={(text) => setPassword(text)}
					// ENTER Press functionality
					onSubmitEditing={signIn}
				/>
			</View>

			{/* Changing style of React Native Elements -> use containerStyle 
			--> as React Native Elements wraps styles into internal conatiner */}
			<Button containerStyle={styles.button} onPress={signIn} title='Login' />

			{/* changing screen in react native using navigation --> navigation.navigate('name_of_screen')   */}
			<Button
				onPress={() => navigation.navigate('Register')}
				containerStyle={styles.button}
				type='outline'
				title='Register'
			/>

			{/* add space from keyboard when opens */}
			<View style={{ height: 100 }} />
		</KeyboardAvoidingView>
	);
};

// navigation.navigate --> navigate means to push on stack, whenwe push on stack, we have ability to go back

// But when we login we don't want to go back so we'll use --> navigation.replace

export default LoginScreen;

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
