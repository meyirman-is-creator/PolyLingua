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

import {firebaseConfig} from './key.mjs'

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
let toLibrary = document.getElementById('toLibrary');
let videoPlayer = document.getElementById('videoPlayer');
let toSignInModal = document.getElementById('to-sign-in-modal');
let imgURL;
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

        if (localStorage.getItem('PL-active') !== null) {
            videoPlayer.src = localStorage.getItem('PL-active');
        }
    } else {
        singOut.classList.add('off');
        signOutIn.classList.add('off');
        openLogin.classList.remove('off');
        openLoginIn.classList.remove('off');
    }
});
userBtnIcon.addEventListener('click', (e) => {
    if (obj) {
        let video = {
            url: 'https://youtu.be/c--evcMMqlg?si=x6eF1LjoYKjEjXe6',
            title: 'Нет успешного успеха, только ЕБШ Евгений Черняк',
        }
        setVideo(video);
        window.open('./profile.html', '_self');

    } else {
        e.preventDefault();
        myModal.show();
    }
})
const colRef = collection(db, "Users");
async function updateUserProfile(uid, obj, imgUrl) {
    await setDoc(doc(colRef, uid), {
        uid: uid,
        firstName: obj.firstName,
        lastName: obj.lastName,
        age: obj.age,
        gender: obj.gender,
        email: obj.email,
        password: obj.createPassword,
        profilePicture: imgUrl,
        library: obj.library
    });
    localStorage.setItem('user', JSON.stringify(obj));
    window.open('index.html', '_self');
}
toLibrary.addEventListener('click', (e) => {
    if (obj) {
        window.open('./profile.html', '_self');
    } else {
        myModal.show();
        e.preventDefault();

    }
});
toProfile.addEventListener('click', (e) => {
    if (obj) {
        window.open('./profile.html', '_self');
    } else {
        e.preventDefault();
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
                uid: docSnap.data().uid,
                library: docSnap.data().library,
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
            imgURL = docSnap.data().profilePicture;
            userBtnIcon.classList.add('delete');
            localStorage.setItem('user', JSON.stringify(obj));
        } else {
            console.log("Пользователь не найден");
        }
    } catch (error) {
        console.error("Ошибка при получении данных пользователя: ", error);
    }
}
const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const videoSource = document.getElementById('videoSource');

// Prevent default behavior to enable drag and drop
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when file dragged over
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

// Handle file input change
fileInput.addEventListener('change', handleFiles, false);

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}
function highlight() {
    dropArea.classList.add('highlight');
}

function unhighlight() {
    dropArea.classList.remove('highlight');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}
async function uploadVideo(file) {
    if (!file) {
        alert('Please select a video file.');
        return;
    }

    const formData = new FormData();
    formData.append('video', file);

    try {
        const response = await fetch('http://127.0.0.1:5501/upload-video', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        video = {
            url: data.videoUrl,
            name: data.name,
        }
        const videoUrl = data.videoUrl;
        window.videoUri = data.videoUri;
        // Set the video src to the uploaded video URL
        videoPlayer.src = videoUrl;
        // Show the video player
        videoPlayer.style.display = 'block';
        const video = {
            url: data.videoUrl,
            name: data.name,
            duration: videoPlayer.duration
        }
    } catch (error) {
        console.error('Error uploading video:', error);
    }
}
function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        // Display video player and set source
        uploadVideo(file);
        // videoPlayer.style.display = 'block';
        // videoSource.src = URL.createObjectURL(file);
        // videoPlayer.load();
    }
}
document.getElementById('youtubeForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const youtubeLink = document.getElementById('youtubeLink').value;

    try {
        const response = await fetch('http://127.0.0.1:5501/upload-yt-video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ youtubeLink })
        });
        const data = await response.json();

        const videoUrl = data.videoUrl;
        window.videoUri = data.videoUri;

        // Set the video src to the uploaded video URL
        videoPlayer.src = videoUrl;
        // Show the video player
        videoPlayer.style.display = 'block';

        // const video ={
        //   url: data.videoUrl,
        //   name: data.name,
        // }
    } catch (error) {
        console.error('Error uploading video:', error);
    }
});
function setVideo(video) {
    if (localStorage.getItem('user') !== null) {
        let user = JSON.parse(localStorage.getItem('user'));
        console.log(user);
        user.library.push(video);
        localStorage.setItem('user', user);
        updateUserProfile(user.uid, user, imgURL);
    }
};
var audioPlayer = document.getElementById('audioPlayer');

function playAll() {
    videoPlayer.play();
    audioPlayer.play();
}

function pauseAll() {
    videoPlayer.pause();
    audioPlayer.pause();
}
function syncAudioWithVideoTime() {
    // Get the current time scrolled in the video
    const videoTimeScrolled = (videoPlayer.currentTime / videoPlayer.duration) * videoPlayer.scrollWidth;

    // Map video time scrolled to audio time (assuming audio duration is equal to video duration)
    const audioTime = (videoTimeScrolled / videoPlayer.scrollWidth) * audioPlayer.duration;

    // Set audio playback position
    audioPlayer.currentTime = audioTime;
}

// Add scroll event listener to sync audio with video time scrolled
videoPlayer.addEventListener('timeupdate', syncAudioWithVideoTime);