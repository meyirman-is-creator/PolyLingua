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
const db = getFirestore(app);
let uploadImgBtn = document.getElementById("upload__img");
let uploadPhotoInput = document.getElementById("uploadPhotoInput");
let cropForPhoto = document.getElementById('crop');
let moveForPhoto = document.getElementById('move');
let cropper;
let avatar = document.getElementById('upload__img');
let savePhotoModal = document.getElementById('save-photo-modal');
let modalPreview = document.getElementById('display_image_data');
let removeUploadImg = document.getElementById('remove-upload-img');
let toCourse = document.getElementById('toCourse');
let signOut = document.getElementById('sign-out');
let signOutIn = document.getElementById('sign-out-in');
let firstName = document.getElementById('firstName');
let firstNameIcon = firstName.previousElementSibling;
let lastName = document.getElementById('lastName');
let lastNameIcon = lastName.previousElementSibling;
let age = document.getElementById('age');
let ageIcon = age.previousElementSibling;
let userBtnIcon= document.getElementById('user-btn-icon');

let myModal = new bootstrap.Modal(document.getElementById("myModal"), {
  keyboard: false,
});
uploadImgBtn.addEventListener("click", () => {
  myModal.show();
});
signOut.addEventListener('click',()=>{
  localStorage.setItem('user', '');
  window.open('main_page.html','_self');
});
signOutIn.addEventListener('click',()=>{
  localStorage.setItem('user', '');
  window.open('main_page.html','_self');
});
uploadPhotoInput.addEventListener('change', (e) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      modalPreview.src = e.target.result;
      if (cropper) {
        cropper.destroy();
      }
      cropper = new Cropper(modalPreview, {
        aspectRatio: 1,
        viewMode: 3,
        movable: true,
        zoomable: true,
        rotatable: false,
        scalable: false,
        zoomOnWheel: true,
      });

    };
    reader.readAsDataURL(files[0]);
  }
  cropForPhoto.classList.add("crop-dop");
  moveForPhoto.classList.remove("move-dop");
});
let obj;
document.addEventListener("DOMContentLoaded", (event) => {
  let user = localStorage.getItem('user');
  obj = JSON.parse(user !== null ? user : '');
  fetchUserDataDownload(obj.uid);
  moveForPhoto.onclick = function () {
    cropForPhoto.classList.remove("crop-dop");
    moveForPhoto.classList.add("move-dop");
    document.querySelector(".cropper-wrap-box").nextElementSibling.classList.add("cropper-move");
    document.querySelector(".cropper-wrap-box").nextElementSibling.setAttribute('data-cropper-action', 'move')
    document.querySelector(".cropper-wrap-box").nextElementSibling.classList.remove("cropper-crop");
    
  };
  cropForPhoto.onclick = function () {
    cropForPhoto.classList.add("crop-dop");
    moveForPhoto.classList.remove("move-dop");
    document.querySelector(".cropper-wrap-box").nextElementSibling.classList.remove("cropper-move");
    document.querySelector(".cropper-wrap-box").nextElementSibling.setAttribute('data-cropper-action', 'crop')
    document.querySelector(".cropper-wrap-box").nextElementSibling.classList.add("cropper-crop");
  };
  let radios = document.getElementsByName("gender");
  for (var radio of radios) {
    if (radio.value === obj.gender)
      radio.checked = true
  }
  firstName.value = obj.firstName;
  lastName.value = obj.lastName;
  age.value = obj.age;
  firstNameIcon.classList.add('active-icon');
  lastNameIcon.classList.add('active-icon');
  ageIcon.classList.add('active-icon');
});
async function fetchUserDataDownload(uid) {

  const docRef = doc(db, "Users", uid);
  try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
          userBtnIcon.style.backgroundImage = `url('${docSnap.data().profilePicture}')`;
          userBtnIcon.classList.add('delete');
          avatar.style.backgroundImage = `url('${docSnap.data().profilePicture}')`;
    avatar.classList.add("upload-active");
    removeUploadImg.classList.add('images-delete-avatar');
      } else {
          console.log("Пользователь не найден");
      }
  } catch (error) {
      console.error("Ошибка при получении данных пользователя: ", error);
  }
}
removeUploadImg.addEventListener('click', function () {
  blb = null;
  avatar.style.backgroundImage = 'null';
  avatar.style.background = "#8a8ac3";
  avatar.style.backgroundPosition = "center";
  avatar.style.backgroundSize = "cover";
  avatar.style.backgroundRepeat = "no-repeat";
  removeUploadImg.classList.remove('images-delete-avatar');
  avatar.classList.remove("upload-active");
});
let blb = null;
savePhotoModal.addEventListener('click', function () {
  myModal.hide();
  const croppedCanvas = cropper.getCroppedCanvas();
  croppedCanvas.toBlob(function (blob) {
    blb = blob;
    var croppedImageURL = URL.createObjectURL(blob);
    avatar.style.backgroundImage = 'url("' + croppedImageURL + '")';
    avatar.classList.add("upload-active");
    removeUploadImg.classList.add('images-delete-avatar');
  });
});
toCourse.addEventListener('click', () => {
  window.open('./main_page.html', '_self')
});