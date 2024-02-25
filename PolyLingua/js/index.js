import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
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

let move = document.getElementById("move");
let crop = document.getElementById("crop");
let cropper;

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();
let email = document.getElementById('toEmail');
let emailIcon = email.previousElementSibling;
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let age = document.getElementById("age");
let language = document.getElementById("language");
let createPassword = document.getElementById("createPassword");
let confirmPassword = document.getElementById("confirmPassword");
let signUp = document.getElementById("signUp");
let google = document.getElementById("google");
let uploadPhoto = document.getElementById("for-uploadPhoto");
let firstNameIcon = firstName.previousElementSibling;
let lastNameIcon = lastName.previousElementSibling;
let ageIcon = age.previousElementSibling;
let createPasswordIcon = createPassword.previousElementSibling;
let confirmPasswordIcon = confirmPassword.previousElementSibling;
let uploadPhotoLabel = document.getElementById("upload__photo--label");
let body = document.getElementById("body-container");
let cancelPhoto = document.getElementById("cancel-photo");
let cancelX = document.getElementById("cancel-x");
let uploadPhotoLabelCut = document.getElementById("upload__photo--label-cut");
let image = document.getElementById("display_image_data");
let savePhoto = document.getElementById("save-photo");
let result = document.getElementById("cropped_image_result");
let cutPhotoLabel = document.querySelector("#cut__photo-label");
let removePhoto = document.getElementById("remove-photo");
let selectBox = document.getElementById('languages');
let toLogin = document.getElementById('toLogin');
removePhoto.onclick = function () {
  uploadPhotoLabel.style.backgroundImage = '';
  uploadPhotoLabel.classList.remove("upload-active");
  if (cropper) {
    cropper.destroy();
  }
  image.src = "images/without-img.jpg";
};
// https://firebasestorage.googleapis.com/v0/b/polylingua-94f50.appspot.com/o/WhatsApp%20Image%202024-01-11%20at%2011.06.09.jpeg?alt=media&token=2aa98361-69de-4224-896a-90cc0951b813
let uploadedImageUrl = null;
let upl = false;
uploadPhoto.addEventListener("change", function (e) {

  const files = e.target.files;
  if (files && files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      image.src = e.target.result;
      if (cropper) {
        cropper.destroy();
      }
      cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 3,
        movable: true,
        zoomable: true,
        rotatable: false,
        scalable: false,
        zoomOnWheel: true,
      });
      savePhoto.style.display = "inline-block";
    };
    reader.readAsDataURL(files[0]);
  }
  crop.classList.add("crop-dop");
  move.classList.remove("move-dop");
});
// check
let blb = null;
savePhoto.addEventListener('click', function () {
  const croppedCanvas = cropper.getCroppedCanvas();
  body.classList.remove("body-cut");
  body.classList.add("body-close");
  croppedCanvas.toBlob(function (blob) {
    blb = blob;
    var croppedImageURL = URL.createObjectURL(blob);
    uploadPhotoLabel.style.backgroundImage = 'url("' + croppedImageURL + '")';
    uploadPhotoLabel.classList.add("upload-active");
    upl = true;
  });
});

document.addEventListener("DOMContentLoaded", (event) => {
  move.onclick = function () {
    crop.classList.remove("crop-dop");
    move.classList.add("move-dop");
    document.querySelector(".cropper-wrap-box").nextElementSibling.classList.add("cropper-move");
    document.querySelector(".cropper-wrap-box").nextElementSibling.setAttribute('data-cropper-action', 'move')
    document.querySelector(".cropper-wrap-box").nextElementSibling.classList.remove("cropper-crop");
  };
  crop.onclick = function () {
    crop.classList.add("crop-dop");
    move.classList.remove("move-dop");
    document.querySelector(".cropper-wrap-box").nextElementSibling.classList.remove("cropper-move");
    document.querySelector(".cropper-wrap-box").nextElementSibling.setAttribute('data-cropper-action', 'crop')
    document.querySelector(".cropper-wrap-box").nextElementSibling.classList.add("cropper-crop");
  };
});

uploadPhotoLabel.onclick = function () {

  body.classList.add("body-cut");
  body.classList.remove("body-close");
};
cancelX.onclick = function () {
  body.classList.remove("body-cut");
  body.classList.add("body-close");
};
cancelPhoto.onclick = function () {
  body.classList.remove("body-cut");
  body.classList.add("body-close");
};
const colRef = collection(db, "Users");

firstName.addEventListener("input", function () {
  if (firstName.value !== "") {
    firstNameIcon.classList.add("active");
  } else {
    firstNameIcon.classList.remove("active");
  }
});
lastName.addEventListener("input", function () {
  if (lastName.value !== "") {
    lastNameIcon.classList.add("active");
  } else {
    lastNameIcon.classList.remove("active");
  }
});
age.addEventListener("input", function () {
  if (age.value !== "") {
    ageIcon.classList.add("active");
  } else {
    ageIcon.classList.remove("active");
  }
});

createPassword.addEventListener("input", function () {
  if (createPassword.value !== "") {
    createPasswordIcon.classList.add("active");
  } else {
    createPasswordIcon.classList.remove("active");
  }
});
confirmPassword.addEventListener("input", function () {
  if (confirmPassword.value !== "") {
    confirmPasswordIcon.classList.add("active");
  } else {
    confirmPasswordIcon.classList.remove("active");
  }
});
email.addEventListener('input', () => {
  if (email.value !== "") {
    emailIcon.classList.add("active");
  } else {
    emailIcon.classList.remove("active");
  }
});
toLogin.addEventListener('click', () => {
  window.open('index.html', '_self')
});
async function registerUser(obj) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, obj.email, obj.createPassword);
    obj.uid = userCredential.user.uid;
    return obj.uid;
  } catch (error) {
    alert('Error: ' + error.message);
    throw error;
  }
}
async function uploadProfilePicture(uid, blob) {
  const storageRef = ref(storage, 'profile_pictures/' + uid);
  const uploadTask = uploadBytesResumable(storageRef, blob);

  const snapshot = await uploadTask;
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

// Выделение функции обновления профиля пользователя
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

signUp.onclick = async function (event) {
  event.preventDefault();

  let gender1 = document.querySelector('input[name="gender"]:checked')?.value;

  let obj = {
    firstName: firstName.value,
    lastName: lastName.value,
    age: age.value,
    gender: gender1,
    email: email.value,
    createPassword: createPassword.value,
    confirmPassword: confirmPassword.value,
    uid: '',
    library: []
  };
  let video = {
    url: 'https://storage.googleapis.com/polylingua-videos/%D0%A7%D0%95%D0%A0%D0%9D%D0%AF%D0%9A%20%D0%98%20%D0%A5%D0%90%D0%9A%D0%90%D0%9C%D0%90%D0%94%D0%90%20-%20%D0%96%D0%95%D0%A1%D0%A2%D0%9A%D0%90%D0%AF%20%D0%9C%D0%9E%D0%A2%D0%98%D0%92%D0%90%D0%A6%D0%98%D0%AF%20%D0%9D%D0%90%20%D0%A3%D0%A1%D0%9F%D0%95%D0%A5!.mp4',
    title: 'Link to object details page for ЧЕРНЯК И ХАКАМАДА - ЖЕСТКАЯ МОТИВАЦИЯ НА УСПЕХ!',
    duration: '02:02'
  }
  let video1 = {
    url: 'https://storage.googleapis.com/polylingua-videos/How%20To%20Finish%20Programming%20Projects.mp4',
    title: 'Link to object details page for How To Finish Programming Projects',
    duration: '03:02'
  }
  let video2 = {
    url: 'https://storage.googleapis.com/polylingua-videos/Happiness.mp4',
    title: 'Happiness.mp4',
    duration: '04:02'
  }
  obj.library.push(video);
  obj.library.push(video1);
  obj.library.push(video2);
  if (obj.createPassword !== obj.confirmPassword) {
    alert('Passwords do not match. Please try again.');
    return;
  }
  try {
    const uid = await registerUser(obj);
    if (blb && upl) {
      try {
        const imgUrl = await uploadProfilePicture(uid, blb);
        await updateUserProfile(uid, obj, imgUrl);
      } catch (uploadError) {
        console.error('Ошибка загрузки изображения: ', uploadError);
      }
    } else {
      const defaultImgUrl = 'https://firebasestorage.googleapis.com/v0/b/polylingua-94f50.appspot.com/o/without-img.jpg?alt=media&token=fbd3f4d0-4275-4f19-b127-9950d87635e2';
      await updateUserProfile(uid, obj, defaultImgUrl);
    }
  } catch (error) {
    // Обработка ошибок регистрации пользователя или обновления профиля
    console.error('Ошибка: ', error);
  }
};

onAuthStateChanged(auth, (user) => {
  if (user == null) {
    return;
  }
  const uid = user.uid;
  console.log(uid);
});