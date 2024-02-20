let toProfile = document.getElementById('toProfile');
const toRegistrationPage = document.getElementById("to-sign-up");
const myModal = new bootstrap.Modal(document.getElementById("myModal"), {
    keyboard: false,
  });
const openLogin = document.getElementById('open-login');

toProfile.addEventListener('click', ()=>{
    window.open('./profile.html','_self');
});

toRegistrationPage.addEventListener('click',()=>{
    window.open('./index.html','_self')
});
openLogin.addEventListener('click', () => {
    myModal.show()
})