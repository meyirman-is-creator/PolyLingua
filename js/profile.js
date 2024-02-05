let uploadImgBtn = document.getElementById("upload__img");
let uploadPhotoInput = document.getElementById("uploadPhotoInput");
let cropForPhoto = document.getElementById('crop');
let moveForPhoto = document.getElementById('move');
let cropper;
let avatar = document.getElementById('upload__img');
let savePhotoModal = document.getElementById('save-photo-modal');
let modalPreview = document.getElementById('display_image_data');
let myModal = new bootstrap.Modal(document.getElementById("myModal"), {
  keyboard: false,
});
uploadImgBtn.addEventListener("click", ()=>{
    myModal.show();
});

uploadPhotoInput.addEventListener('change',(e)=>{
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
document.addEventListener("DOMContentLoaded", (event) => {
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
  });
});