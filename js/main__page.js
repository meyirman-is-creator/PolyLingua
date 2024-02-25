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
    updateDoc,
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
let controller;
async function uploadVideo(file) {
    if (!file) {
        alert('Please select a video file.');
        return;
    }
    if (controller) {
        controller.abort();
    }
    
    // Create a new controller for the fetch request
    controller = new AbortController();
    const signal = controller.signal;

    const formData = new FormData();
    formData.append('video', file);
    
    try {
        const response = await fetch('https://translate-c3b6phuuwq-uc.a.run.app/upload-video', {
            method: 'POST',
            body: formData,
            signal: signal,
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
        document.getElementById("dropArea").style.display = 'none';
        const video = {
            url: videoUrl,
            name: data.name,
        }
        setVideo(video);
    } catch (error) {
        console.error('Error uploading video:', error);
    }
}
const uploadBtn = document.getElementById('videoUpload');
const uploadInp = document.getElementById("videoInput")
uploadBtn.addEventListener('click', function() {
    fileInput.click(); 
});
uploadInp.addEventListener('change',(event)=>{
    const file = event.target.files[0];
    uploadVideo(file)
});
function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        // Display video player and set source
        uploadVideo(file);  
    }
}
document.getElementById('youtubeForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    document.getElementById("loader").style.display ='block';
    document.getElementById("loader-x").style.display ='block';
    document.getElementById("find-icon").style.display ='none';

    const youtubeLink = document.getElementById('youtubeLink').value;
    if (controller) {
        controller.abort();
    }
    
    // Create a new controller for the fetch request
    controller = new AbortController();
    const signal = controller.signal;
    
    try {
    const response = await fetch('https://translate-c3b6phuuwq-uc.a.run.app/upload-yt-video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ youtubeLink })
            ,
            signal: signal,
        });

        const data = await response.json();
        
        document.getElementById("loader").style.display ='none';
        document.getElementById("loader-x").style.display ='none';
        document.getElementById("find-icon").style.display ='block';

        const videoUrl = data.videoUrl;
        window.videoUri = data.videoUri;

        // Set the video src to the uploaded video URL
        
        dropArea.classList.add('video-active');
        videoPlayer.src = videoUrl;
        // Show the video player
        videoPlayer.style.display = 'block';

        let video = {
            url: videoUrl,
            title: data.name,
        }
        setVideo(video);
    } catch (error) {
        console.error('Error uploading video:', error);
        if (error.name === 'AbortError') {
            console.log('Request aborted by the user');
        } else {
            console.error('Error uploading video:', error);
        }
    }
});
document.getElementById('loader-x').addEventListener('click', (event) => {
    // Check if there's an ongoing fetch request and abort it
    event.preventDefault();


    document.getElementById("loader").style.display ='none';
    document.getElementById("loader-x").style.display ='none';
    document.getElementById("find-icon").style.display ='block';
    if (controller) {
        controller.abort();
        console.log('Request aborted by the user');
    }
});
function setVideo(video) {
    if (localStorage.getItem('user') !== null) {
        let user = JSON.parse(localStorage.getItem('user'));
        console.log(user);
        
          
        user.library.push(video);
        localStorage.setItem('user', JSON.stringify(user));
        updateUser(user, video);
    }
 
};

function updateUser(user,video){
    
    const docRef = doc(db, "Users",user.uid);

    getDoc(docRef).then(function(doc) {
        if (doc.exists) {
            var currentLibrary = doc.data().library || []; // If library doesn't exist yet, initialize it as an empty array

            // Push the new object to the library array
            currentLibrary.push(video);
            // Update the document with the modified library array
            return updateDoc(docRef,{
                library: currentLibrary
            });
        } else {
            console.log("No such document!");
        }
    }).then(function() {
        console.log("Document updated successfully!");
    }).catch(function(error) {
        console.error("Error updating document:", error);
    });
}
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