import firebase from "firebase";
// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

export class FireBaseUtil {
  constructor() {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyDf3aeKF4bsout7UbeUn16jd1JJUE1yJhs",
      authDomain: "v-button.firebaseapp.com",
      projectId: "v-button",
      storageBucket: "v-button.appspot.com",
      databaseURL: "https://v-button-default-rtdb.firebaseio.com/",
      messagingSenderId: "747865318145",
      appId: "1:747865318145:web:cfc40f0490b5291c7db100",
      measurementId: "G-H8YMQTM7EL",
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    this.googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    this.database = firebase.database();
  }

  googleAuthProvider: firebase.auth.GoogleAuthProvider;
  database: firebase.database.Database;
}
