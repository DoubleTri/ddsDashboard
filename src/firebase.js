import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'

var config = {
    apiKey: "AIzaSyDwvSq9PggZ8D0WVEXcoRqh81KMWsHC-Lo",
    authDomain: "ddsdashboard-66cc9.firebaseapp.com",
    projectId: "ddsdashboard-66cc9",
    storageBucket: "ddsdashboard-66cc9.appspot.com",
    messagingSenderId: "1073517353467",
    appId: "1:1073517353467:web:4740b158e495f9d14b135e",
    measurementId: "G-SSGH2NDCX7"
}

export const app = firebase.initializeApp(config);
//firebase.firestore().settings({ experimentalForceLongPolling: true });
export const functions = firebase.functions();
export const auth = firebase.auth();
export const fireStore = firebase.firestore();
export const storage = firebase.storage();