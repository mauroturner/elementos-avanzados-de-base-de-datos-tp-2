import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyD66Fry2H2qGPmJVJ0hBJO9DbnLqZbLu2I",
    authDomain: "apptrack-solutions-7cc76.firebaseapp.com",
    projectId: "apptrack-solutions-7cc76",
    storageBucket: "apptrack-solutions-7cc76.firebasestorage.app",
    messagingSenderId: "367515543411",
    appId: "1:367515543411:web:466d1c19436dbc714d8706",
};

const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;
