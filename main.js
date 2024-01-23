//check
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
let move = document.getElementById("move");
let crop = document.getElementById("crop");
let cropper;

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();
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
removePhoto.onclick = function(){
  uploadPhotoLabel.style.backgroundImage = '';
  uploadPhotoLabel.classList.remove("upload-active");
  if (cropper) {
    cropper.destroy();
  }
  image.src = "images/without-img.jpg";
};
// https://firebasestorage.googleapis.com/v0/b/polylingua-94f50.appspot.com/o/WhatsApp%20Image%202024-01-11%20at%2011.06.09.jpeg?alt=media&token=2aa98361-69de-4224-896a-90cc0951b813
let uploadedImageUrl = null;

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
let email = "12345678@gmail.com";
// let obj = null;
signUp.onclick = function () {
  event.preventDefault();
  let language1;
  let radios = document.getElementsByName("gender");
  for (var radio of radios) {
    if (radio.checked) {
      language1=radio.value;
    }
  }
  const obj = {
    firstName: firstName.value,
    lastName: lastName.value,
    age: age.value,
    language: language1,
    createPassword: createPassword.value,
    confirmPassword: confirmPassword.value,
  };
  console.log(obj);
  createUserWithEmailAndPassword(auth, email, obj.createPassword)
    .then(function (success) {
      // Check if an image URL has been stored
      alert("Signup Successfully");
      
    })
    .catch(function (err) {
      alert('Error: ' + err.message);
    });
    
    onAuthStateChanged(auth, (user) => {
      if (user == null) {
        return;
      }
      const uid = user.uid;
      console.log(uid);
      const storageRef = ref(storage,'profile_pictures/${uid}');
      const uploadTask = uploadBytesResumable(storageRef, blb);
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              // Monitor upload progress if needed
              console.log("Upload");
            },
            (error) => {
              console.error('Upload failed:', error);
            },
            () => {
              // Upload completed successfully, get the download URL
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                // Store the image URL globally
                uploadedImageUrl = downloadURL;
                console.log(uploadedImageUrl)
                // Display the uploaded image (optional)
                uploadPhotoLabel.style.backgroundImage = 'url("' + downloadURL + '")';
                uploadPhotoLabel.classList.add("upload-active");
              });
            }
          );
        if (uploadedImageUrl) {
          // Update user profile with the stored image URL
          addDoc(doc(colRef,uid),{
            uid : uid,
            firstName: obj.firstName,
            lastName: obj.lastName,
            age: obj.age,
            language: obj.language,
            email: email,
            profilePicture: uploadedImageUrl, // Use the stored image URL
          }).then(() => {
            console.log('User profile updated');
            alert('Signup Successfully');
          })
          .catch(function (err) {
            console.log('Error: ' + err.message);
          });
        } else {
          // If no image URL is stored, proceed without uploading a profile picture
          addDoc(doc(colRef,uid), {
            uid : uid,
            firstName: obj.firstName,
            lastName: obj.lastName,
            age: obj.age,
            language: obj.language,
            createPassword: obj.createPassword,
            email: email,
          }).then(() => {
            console.log('User added');
            alert('Signup Successfully');
          })
          .catch(function (err) {
            console.log('Error: ' + err.message);
          });
        }
      console.log(user.uid);
    });
    
};
onAuthStateChanged(auth, (user) => {
  if (user == null) {
    return;
  }
  const uid = user.uid;
  console.log(uid);
});



