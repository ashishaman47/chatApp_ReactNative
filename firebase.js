import firebase from 'firebase';
require('firebase/firestore');
require('firebase/auth');

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyBR4E2VWKI_8GisgYrBKcNkrDmu4Po4YNY',
	authDomain: 'signal-clone-build-ad82c.firebaseapp.com',
	projectId: 'signal-clone-build-ad82c',
	storageBucket: 'signal-clone-build-ad82c.appspot.com',
	messagingSenderId: '661886109058',
	appId: '1:661886109058:web:5e71c2785831604b953b9b',
	measurementId: 'G-TXE55N2YY6',
};

let app;

// if we have already initialized the app, we should keep initializing it.
if (firebase.apps.length === 0) {
	// if we haven't initialize the app then initialize it, update app variable
	app = firebase.initializeApp(firebaseConfig);
} else {
	// use the firebase app that is already initialize
	app = firebase.app();
}

// setting up database access variable
const db = app.firestore();

// setting up authentication access var
const auth = firebase.auth();

export { db, auth };
