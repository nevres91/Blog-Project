// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
import { getDatabase, ref, set, child, get, update } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYVkdfM4Os6ygWaYemiuglSgsnJES_CjI",
  authDomain: "login-9aaf3.firebaseapp.com",
  databaseURL: "https://login-9aaf3-default-rtdb.firebaseio.com",
  projectId: "login-9aaf3",
  storageBucket: "login-9aaf3.appspot.com",
  messagingSenderId: "16666197265",
  appId: "1:16666197265:web:2182a6d7fb67db652b20b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// < ----------LOGIN and REGISTER firebase------------>
// Initializing variables

// ---------------ENTER key press SUBMIT
const enter_reg = document.querySelector('.signup');
enter_reg.addEventListener('keypress', function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    reg.click();
  }
})
// --------------------------------------REGISTER FUNCTION-------------------------------

const reg = document.getElementById("reg");
reg.addEventListener("click", function register() {
  // getting all input fields
  let full_name = document.getElementById("RName").value,
    email = document.getElementById("REmail").value,
    password1 = document.getElementById("password1").value,
    password2 = document.getElementById("password2").value;

  // -----------PASSWORD MATCH-------------

  const password1_field = document.getElementById("password1"),
    password2_field = document.getElementById("password2");
  password1_field.addEventListener("keydown", () => {
    password1_field.parentElement.classList.remove("invalid");
    password1_field.parentElement.nextElementSibling.innerHTML = "";
  });
  password2_field.addEventListener("keydown", () => {
    password2_field.parentElement.classList.remove("invalid");
    password2_field.parentElement.nextElementSibling.innerHTML = "";
  });

  if (password1 != password2) {
    password1_field.parentElement.classList.add("invalid");
    password1_field.parentElement.nextElementSibling.innerHTML = "Passwords must match";
    password2_field.parentElement.classList.add("invalid");
    password2_field.parentElement.nextElementSibling.innerHTML = "Passwords must match";
    return
  }

  // --------VALIDATE NAME FIELD--------
  const name_field = document.getElementById("RName")
  name_field.addEventListener("keydown", () => {
    name_field.parentElement.classList.remove("invalid");
    name_field.parentElement.nextElementSibling.innerHTML = "";
  })

  if (validate_field(full_name) == false) {
    name_field.parentElement.classList.add("invalid");
    name_field.parentElement.nextElementSibling.innerHTML = "Please enter a Name";
    return
  }
  // --------VALIDATE E-mail FIELD--------
  const email_field = document.getElementById("REmail")
  email_field.addEventListener("keydown", () => {
    email_field.parentElement.classList.remove("invalid");
    email_field.parentElement.nextElementSibling.innerHTML = "";
  })

  if (validate_field(email) == false) {
    email_field.parentElement.classList.add("invalid");
    email_field.parentElement.nextElementSibling.innerHTML = "Please enter a valid E-mail";
    return
  }
  // --------VALIDATE PASSWORD FIELD--------
  const password_field = document.getElementById("password1")
  password_field.addEventListener("keydown", () => {
    password_field.parentElement.classList.remove("invalid");
    password_field.parentElement.nextElementSibling.innerHTML = "";
  })

  if (validate_field(password1) == false) {
    password_field.parentElement.classList.add("invalid");
    password_field.parentElement.nextElementSibling.innerHTML = "Please enter a valid Password";
    return
  }
  // ----------------------------
  createUserWithEmailAndPassword(auth, email, password1)
    .then(function (userCredential) {
      // Format Date
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0');
      var yyyy = today.getFullYear();
      today = dd + '/' + mm + '/' + yyyy;
      // Declare user variable
      var user = userCredential.user
      // Add this user to Firebase Database
      var user_data = {
        full_name: full_name,
        email: email,
        password: password1,
        last_login: today
      }
      // Create user data
      const warning = document.querySelector(".alert");
      const login_email = document.getElementById("email")
      const login_password = document.getElementById("password")
      set(ref(database, 'users/' + user.uid), user_data)
      warning.style.display = 'block';
      warning.innerHTML = 'Register successful!'
      loginLink.click();
      login_email.value = email;
      login_password.value = password1;
      const inputs = document.querySelectorAll('#REmail, #RName, #password1, #password2');
      inputs.forEach(function (input) {
        input.value = '';
      })
    })
    .catch(function (error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
      if (error_code === 'auth/email-already-in-use') {
        email_field.parentElement.classList.add("invalid");
        email_field.parentElement.nextElementSibling.innerHTML = "Email is already in use";
      } else if (error_code === 'auth/invalid-email') {
        email_field.parentElement.classList.add("invalid");
        email_field.parentElement.nextElementSibling.innerHTML = "Please enter a valid E-mail";
      } else if (error_code === 'auth/weak-password') {
        password_field.parentElement.classList.add("invalid");
        password_field.parentElement.nextElementSibling.innerHTML = "Password should be at least 6 characters";
      } else {
        alert(error_message);
      }
    })
  // -------------CLEAR FIELDS AFTER REGISTER-----------

  const warning = document.querySelector(".alert");
  setTimeout(function () {
    warning.innerHTML = ''
  }, 4000)
})

// -------------------------------------LOGIN FUNCTION----------------------------------------
const enter_login = document.querySelector('.login');
enter_login.addEventListener('keypress', function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    login.click();
  }
})


const login = document.getElementById("login");
login.addEventListener("click", function login() {

  const email = document.getElementById("email").value,
    password1 = document.getElementById("password1").value,
    password3 = document.querySelector(".password").value;
  const email_field = document.getElementById("email");
  const password_field = document.getElementById("password");
  password_field.addEventListener("keydown", () => {
    password_field.parentElement.classList.remove("invalid");
    password_field.parentElement.nextElementSibling.innerHTML = "";
  })
  email_field.addEventListener("keydown", () => {
    email_field.parentElement.classList.remove("invalid");
    email_field.parentElement.nextElementSibling.innerHTML = "";
  })
  // Validate input fields
  if (validate_email(email) == false) {
    email_field.parentElement.classList.add("invalid");
    email_field.parentElement.nextElementSibling.innerHTML = "Please enter a valid E-mail";
    return
  } else if (validate_password(password3) == false) {
    password_field.parentElement.classList.add("invalid");
    password_field.parentElement.nextElementSibling.innerHTML = "Please enter password";
    return
  }
  signInWithEmailAndPassword(auth, email, password3)
    .then(function (userCredential) {
      // Format Date
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      today = dd + '/' + mm + '/' + yyyy;
      // Declare user variable
      var user = userCredential.user
      // Add this user to Firebase Database
      var user_data = {
        last_login: today
      }
      // Create user data
      update(ref(database, 'users/' + user.uid), { last_login: today })
      window.open("/home.html", "_self");
      const inputs = document.querySelectorAll('#email, #password');
      inputs.forEach(function (input) {
        input.value = '';
      })
    })


    .catch(function (error) {

      var error_code = error.code
      var error_message = error.message

      if (error_code == 'auth/user-not-found') {
        email_field.parentElement.classList.add("invalid");
        email_field.parentElement.nextElementSibling.innerHTML = "Email doesn't exist in database.";
      } else if (error_code == 'auth/wrong-password') {
        password_field.addEventListener("keydown", () => {
          password_field.parentElement.classList.remove("invalid");
          password_field.parentElement.nextElementSibling.innerHTML = "";

        })

        password_field.parentElement.classList.add("invalid");
        password_field.parentElement.nextElementSibling.innerHTML = "Wrong password, please try again.";
        password_field.value = '';
      } else if (error_code == 'auth/too-many-requests') {
        password_field.parentElement.classList.add("invalid");
        password_field.parentElement.nextElementSibling.innerHTML = "Account blocked. Wrong password entered too many times, try again later!.";
      } else if (error_code == 'auth/internal-error') {
        password_field.parentElement.classList.add("invalid");
        password_field.parentElement.nextElementSibling.innerHTML = "Please enter a password.";
      } else {
        alert(error.message);
      }

    })
  // ---------------CLEAR INPUTS---------------


})


// VALIDATE functions
function validate_email(email) {
  let expression;
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}

function validate_password(password) {
  // accept lengths greater than 6
  let expression;
  expression = /^(?=.*[0-9])(?=.*[a-z]).{8,32}$/
  if (expression.test(password) == true) {
    return false
  } else {
    return true
  }
}

function validate_field(field) {
  if (field == null) {
    return false
  }
  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}