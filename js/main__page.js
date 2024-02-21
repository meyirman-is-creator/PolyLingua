import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    getDoc,
    setDoc,
    addDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js"

const firebaseConfig = {
    apiKey: "AIzaSyCNNy7dO3NIQhBcnrmT03so1nZFP09SSlA",
    authDomain: "polylingua-94f50.firebaseapp.com",
    databaseURL:
        "https://polylingua-94f50-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "polylingua-94f50",
    storageBucket: "polylingua-94f50.appspot.com",
    messagingSenderId: "246921675799",
    appId: "1:246921675799:web:8caf26c4174b5ac4a60852",
    measurementId: "G-0FR2TY4Y5Y",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let toProfile = document.getElementById('toProfile');
const toRegistrationPage = document.getElementById("to-sign-up");
const openLogin = document.getElementById('open-login');
let userBtnIcon = document.getElementById('user-btn-icon');
let signOutIn = document.getElementById('sign-out-in');
let openLoginIn = document.getElementById('open-login-in');
let toEmailModal = document.getElementById('toEmailModal');
let toEmailModalIcon = toEmailModal.previousElementSibling;
let createPasswordModal = document.getElementById('createPasswordModal');
let createPasswordModalIcon = createPasswordModal.previousElementSibling;
let toSignInModal = document.getElementById('to-sign-in-modal');
const myModal = new bootstrap.Modal(document.getElementById("myModal"), {
    keyboard: false,
});
const db = getFirestore(app);

// Функция для получения данных пользователя

const singOut = document.getElementById('sign-out');
let obj;
document.addEventListener('DOMContentLoaded', function () {
    let user = localStorage.getItem('user');
    obj = JSON.parse(user !== null ? user : '');
    if (obj) {
        singOut.classList.remove('off');
        signOutIn.classList.remove('off');
        openLogin.classList.add('off');
        openLoginIn.classList.add('off');
        fetchUserDataDownload(obj.uid);
    } else {
        singOut.classList.add('off');
        signOutIn.classList.add('off');
        openLogin.classList.remove('off');
        openLoginIn.classList.remove('off');
    }
});
userBtnIcon.addEventListener('click', () => {
    if (obj) {
        window.open('./profile.html', '_self');
    } else {
        myModal.show();
    }
})
toProfile.addEventListener('click', () => {
    if (obj) {
        window.open('./profile.html', '_self');
    } else {
        myModal.show();
    }
});
createPasswordModal.addEventListener('input', () => {
    if (createPasswordModal.value !== '') {
        createPasswordModalIcon.classList.add('active');
    } else {
        createPasswordModalIcon.classList.remove('active');

    }
});
toEmailModal.addEventListener('input', () => {
    if (toEmailModal.value !== '') {
        toEmailModalIcon.classList.add('active');
    } else {
        toEmailModalIcon.classList.remove('active');

    }
});
toRegistrationPage.addEventListener('click', () => {
    window.open('./registration_page.html', '_self')
});
singOut.addEventListener('click', () => {
    localStorage.setItem('user', '')
    location.reload();
})
openLogin.addEventListener('click', () => {
    myModal.show();
});
signOutIn.addEventListener('click', () => {
    localStorage.setItem('user', '')
    location.reload();
})
openLoginIn.addEventListener('click', () => {
    myModal.show();
});
toSignInModal.addEventListener('click', () => {
    signInWithEmailAndPassword(auth, toEmailModal.value, createPasswordModal.value)
        .then((userCredential) => {
            const user = userCredential.user;
            fetchUserData(user.uid);
            console.log(user);

        })
        .catch((error) => {
            console.log('error.code', 'error.message')
            const errorCode = error.code;
            const errorMessage = error.message;
        })
})

async function fetchUserData(uid) {

    const docRef = doc(db, "Users", uid);
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Данные пользователя: ", docSnap.data());
            obj = {
                firstName: docSnap.data().firstName,
                lastName: docSnap.data().lastName,
                age: docSnap.data().age,
                gender: docSnap.data().gender,
                email: docSnap.data().email,
                createPassword: docSnap.data().password,
                confirmPassword: docSnap.data().password,
                uid: docSnap.data().uid
            };
            userBtnIcon.style.backgroundImage = `url('${docSnap.data().profilePicture}')`;
            userBtnIcon.classList.add('delete');
            localStorage.setItem('user', JSON.stringify(obj));
            myModal.hide();
        } else {
            console.log("Пользователь не найден");
        }
    } catch (error) {
        console.error("Ошибка при получении данных пользователя: ", error);
    }
}
async function fetchUserDataDownload(uid) {

    const docRef = doc(db, "Users", uid);
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            userBtnIcon.style.backgroundImage = `url('${docSnap.data().profilePicture}')`;
            userBtnIcon.classList.add('delete');
            localStorage.setItem('user', JSON.stringify(obj));
        } else {
            console.log("Пользователь не найден");
        }
    } catch (error) {
        console.error("Ошибка при получении данных пользователя: ", error);
    }
}