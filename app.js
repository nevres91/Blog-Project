// <---------LOGIN / REGISTER FORM--------->
const container = document.querySelector(".container"),
  pwShowHide = document.querySelectorAll('.showHidePw'),
  pwFields = document.querySelectorAll('.password'),
  signUp = document.querySelector('.signup-link'),
  loginLink = document.querySelector('.login-link');


pwShowHide.forEach(eyeIcon => {
  eyeIcon.addEventListener("click", () => {
    pwFields.forEach(pwField => {
      if (pwField.type === "password") {
        pwField.type = "text";
        pwShowHide.forEach(icon => {
          icon.classList.replace("fa-eye-slash", "fa-eye");
        })
      } else {
        pwField.type = "password";
        pwShowHide.forEach(icon => {
          icon.classList.replace("fa-eye", "fa-eye-slash");
        })
      }
    })
  })
})

// Sign up and login appear!
signUp.addEventListener("click", () => {
  container.classList.add("active");
});
loginLink.addEventListener("click", () => {
  container.classList.remove("active");
});










