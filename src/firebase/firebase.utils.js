import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyAjd0bvhwaT7SLRuMyo1xoNej1MIrl-BKw",
  authDomain: "your-clothing.firebaseapp.com",
  databaseURL: "https://your-clothing.firebaseio.com",
  projectId: "your-clothing",
  storageBucket: "your-clothing.appspot.com",
  messagingSenderId: "537394926303",
  appId: "1:537394926303:web:f60d91ebde0077b8a60f6a",
  measurementId: "G-9R396L0NJF"
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;
  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }

  return userRef;
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

var provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;