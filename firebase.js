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

// register function
const reg = document.getElementById("reg");
reg.addEventListener("click", function register() {
  // getting all input fields
  let full_name = document.getElementById("RName").value,
    email = document.getElementById("REmail").value,
    password1 = document.getElementById("password1").value,
    password2 = document.getElementById("password2").value


  // Validate input fields
  if (validate_email(email) == false || validate_password(password1) == false) {
    alert("Email or password is outta line")
    return
    // don't run the code anymore
  }
  if (password1 != password2) {
    alert("Passwords must match!")
    return
  }
  if (validate_field(full_name) == false || validate_field(email) == false || validate_field(password1) == false) {
    alert("Some of the inputs are not correct")
    return
  }

  createUserWithEmailAndPassword(auth, email, password1)
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
        full_name: full_name,
        email: email,
        password: password1,
        last_login: today
      }
      // Create user data
      set(ref(database, 'users/' + user.uid), user_data)
      alert("User created")
      loginLink.click();
    })
    .catch(function (error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
      alert(error_message)
    })
})

// Login functions
const login = document.getElementById("login");
login.addEventListener("click", function login() {

  const email = document.getElementById("email").value,
    password1 = document.getElementById("password1").value
  // Validate input fields
  if (validate_email(email) == false || validate_password(password1) == false) {
    alert("Email or password is outta line")
    return
  }
  signInWithEmailAndPassword(auth, email, password1)
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


    })
    .catch(function (error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
      alert(error_message)
    })


})


// Validate functions
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
  if (password < 6) {
    return flase
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