// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getAuth, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
import { getDatabase, ref, set, onValue, child, get, update } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";
import { collection, deleteField, updateDoc, deleteDoc, orderBy, setDoc, query, where, getDoc, getDocs, getFirestore, doc, onSnapshot, collectionGroup, addDoc } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js";
import { getStorage, deleteObject, listAll, ref as sref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-storage.js";
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
const auth = getAuth();
const user = auth.currentUser;
const db = getFirestore();
const storage = getStorage();
var ms = (new Date()).getMilliseconds();

auth.onAuthStateChanged(user => {
  if (user !== null) {
    const full_name = user.full_name;
    const email = user.email;
    const password = user.password;
    const last_login = user.last_login;
    const uid = user.uid;

    // ------------------------------Upload Image---------------------------
    var files = [];
    var reader = new FileReader();

    var posted_img = document.querySelector('.content_image');
    var name_box = document.getElementById('image_name');
    var photo_button = document.querySelector('.upload_photo');
    var video_button = document.getElementById('upload_video');
    var upload_progress = document.querySelector('.upload_progress')
    var display_name = document.querySelector('.image_name');


    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
      files = e.target.files;
      var name = GetFileName(files[0]);
      name_box.value = name;
      reader.readAsDataURL(files[0]);
    }

    reader.onload = function () {
      display_name.style.display = 'flex'
    }

    photo_button.onclick = function () {
      input.click();
    }

    function GetFileName(file) {
      var temp = file.name.split('.');
      var fname = temp.slice(0, -1).join('.');
      return fname;
    }

    // -------------------------------Insert data---------------------------

    function InsertData() {

      // ----------------------------------Without image---------------------------

      if (name_box.value === '') {
        const RTdata = ref(database, 'users/' + user.uid);
        onValue(RTdata, (snapshot) => {
          const real_data = snapshot.val();
          var user_name = real_data.full_name;
          let post_field = document.getElementById('post_input').value
          // Time format
          var timestamp = new Date();
          var dd = String(timestamp.getDate()).padStart(2, '0');
          var mm = String(timestamp.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = timestamp.getFullYear();
          var h = timestamp.getHours();
          var m = timestamp.getMinutes();
          var s = timestamp.getSeconds();
          timestamp = dd + '.' + mm + '.' + yyyy + ' | ' + h + ':' + m + ' :' + s;
          const docRef = addDoc(collection(db, `users/${uid}/posts`), {
            text: post_field,
            posted_at: timestamp,
            user_uid: uid,
            full_name: user_name,
            m_seconds: Date.now()
          })
          let clear_field = document.getElementById('post_input')
          clear_field.value = '';
        })
      } else {

        // ----------------------------With Image----------------------------
        var imgToUpload = files[0];

        var ImgName = name_box.value

        const metaData = {
          contentType: imgToUpload.type
        }
        const storage = getStorage();

        const storageRef = sref(storage, "images/" + ImgName);
        const uploadTask = uploadBytesResumable(storageRef, imgToUpload, metaData);

        uploadTask.on('state-changed', (snapshot) => {
          var upload_message = document.querySelector('.upload_message');
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          upload_progress.innerHTML = progress + "%";
          if (progress != 100) {
            upload_message.innerHTML = 'Uploading. . .'
          } else {
            upload_message.innerHTML = '';
          }

        },
          (error) => {
            alert("error: image not uploaded");
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((DownloadURL) => {
              const RTdata = ref(database, 'users/' + user.uid);
              onValue(RTdata, (snapshot) => {
                const real_data = snapshot.val();
                var user_name = real_data.full_name;

                let post_field = document.getElementById('post_input').value
                // Time format
                var timestamp = new Date();
                var dd = String(timestamp.getDate()).padStart(2, '0');
                var mm = String(timestamp.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = timestamp.getFullYear();
                var h = timestamp.getHours();
                var m = timestamp.getMinutes();
                var s = timestamp.getSeconds();
                timestamp = dd + '.' + mm + '.' + yyyy + ' | ' + h + ':' + m + ' :' + s;

                const docRef = addDoc(collection(db, `users/${uid}/posts`), {
                  text: post_field,
                  posted_at: timestamp,
                  user_uid: uid,
                  download_link: DownloadURL,
                  full_name: user_name,
                  m_seconds: Date.now()
                })
                display_name.style.display = 'none'
                upload_progress.innerHTML = "";
                let clear_field = document.getElementById('post_input')
                clear_field.value = '';
                // name_box.value = '';
                // document.location.reload()
              })
            });
          }
        );

      }
      name_box.value = '';
    }

    document.getElementById('post_button').addEventListener('click', InsertData)
    // ------------------------------------get data realtime-------------------------------

    // async function getDataRealtime() {
    //   // const rtPosts = sref(storage, 'users');
    //   const posts = query(collectionGroup(db, 'posts'), orderBy('m_seconds', 'desc'));
    //   const querySnapshot = await getDocs(posts);
    //   console.log(querySnapshot)

    // }
    // getDataRealtime();











    // ---------------------------------Load all posts---------------------------------

    async function getAllPosts() {
      const posts = query(collectionGroup(db, 'posts'), orderBy('m_seconds', 'desc'));
      // const posts = (collectionGroup(db, 'posts'));
      const querySnapshot = await getDocs(posts);
      querySnapshot.forEach((doc) => {



        var download_link = doc.data().download_link
        var posted_at = doc.data().posted_at
        var text = doc.data().text
        var user_uid = doc.data().user_uid
        var full_name = doc.data().full_name

        var cardContainer = document.querySelector('.home-container');
        // Create Elements
        var new_content_card = document.createElement('div');

        var new_content_name = document.createElement('div');
        var new_content_text = document.createElement('div');
        var new_content_pic = document.createElement('div');
        var new_content_link = document.createElement('div');
        var new_content_footer = document.createElement('div');

        var new_small_profile_pic = document.createElement('div');
        var new_name_text = document.createElement('div');
        var new_options_icon = document.createElement('div');


        var new_h4 = document.createElement('h4');
        var new_posted_at = document.createElement('p');

        var new_icon = document.createElement('i');

        var new_dd_menu = document.createElement('ul');
        var new_edit_p = document.createElement('li');
        var new_delete_p = document.createElement('li');
        var new_hide_p = document.createElement('li');



        var new_text_box = document.createElement('p');
        var new_hashtag = document.createElement('p');

        var new_content_image = document.createElement('img');

        var new_portal_name = document.createElement('span');
        var new_link_desc = document.createElement('span');
        var new_more_text = document.createElement('p');

        var new_upper_footer = document.createElement('div');
        var new_buttons = document.createElement('div');

        var new_likes = document.createElement('div');
        var new_coments = document.createElement('div');

        var new_like_icon = document.createElement('img');
        var new_love_icon = document.createElement('img');
        var new_likes_n = document.createElement('p');

        var new_coments_p = document.createElement('p');
        var new_share = document.createElement('p');

        var new_like_button = document.createElement('div');
        var new_coment_button = document.createElement('div');
        var new_share_button = document.createElement('div');

        var new_like_icon_button = document.createElement('i');
        var new_coment_icon_button = document.createElement('i');
        var new_share_icon_button = document.createElement('i');


        // Add CLASS
        new_content_card.classList.add('content_card');

        new_content_name.classList.add('content_name');
        new_content_text.classList.add('content_text');
        new_content_pic.classList.add('content_pic');
        new_content_link.classList.add('content_link');
        new_content_footer.classList.add('content_footer');

        new_small_profile_pic.classList.add('small_profile_pic');
        new_name_text.classList.add('name_text');
        new_options_icon.classList.add('options_icon', 'dd_active');


        new_h4.classList.add('h4');
        new_h4.innerHTML = `${full_name}`;
        new_posted_at.classList.add('posted_at');
        new_posted_at.innerHTML = `${posted_at}`;

        new_icon.classList.add('fa-solid', 'fa-xl', 'fa-ellipsis');

        new_dd_menu.classList.add('dd_menu');
        new_edit_p.classList.add('edit_p');
        new_delete_p.classList.add('delete_p');
        new_hide_p.classList.add('hide_p');
        new_edit_p.innerHTML = ('Edit post');
        new_delete_p.innerHTML = ('Delete post');
        new_hide_p.innerHTML = ('Hide post');



        new_text_box.classList.add('text_box');
        new_text_box.innerHTML = `${text}`;
        new_hashtag.classList.add('hashtag');
        new_hashtag.innerHTML = '#hashtag1  #hashtag2';

        new_content_image.classList.add('content_image');
        if (download_link == null) {
          new_content_image.style.display = `none`;
        } else {
          new_content_image.src = `${download_link}`;
        }


        new_portal_name.classList.add('portal_name');
        new_link_desc.classList.add('link_desc');
        new_more_text.classList.add('more_text');

        new_upper_footer.classList.add('upper_footer');
        new_buttons.classList.add('buttons');

        new_likes.classList.add('likes');
        new_coments.classList.add('coments');

        new_like_icon.classList.add('like_icon');
        new_love_icon.classList.add('love_icon');
        new_likes_n.classList.add('likes_n');

        new_coments_p.classList.add('coments_p');
        new_share.classList.add('share');

        new_like_button.classList.add('like_button', 'to_do');
        new_coment_button.classList.add('coment_button', 'to_do');
        new_share_button.classList.add('share_button', 'to_do');

        new_like_icon_button.classList.add('fa-solid', 'fa-thumbs-up', 'fa-xl');
        new_coment_icon_button.classList.add('fa-regular', 'fa-comment', 'fa-xl');
        new_share_icon_button.classList.add('fa-solid', 'fa-share', 'fa-xl');


        // Append Child
        cardContainer.appendChild(new_content_card);

        new_content_card.appendChild(new_content_name);
        new_content_card.appendChild(new_content_text);
        new_content_card.appendChild(new_content_pic);
        new_content_card.appendChild(new_content_link);
        new_content_card.appendChild(new_content_footer);

        new_content_name.appendChild(new_small_profile_pic);
        new_content_name.appendChild(new_name_text);
        new_content_name.appendChild(new_options_icon);

        new_name_text.appendChild(new_h4);
        new_name_text.appendChild(new_posted_at);

        new_options_icon.appendChild(new_icon);

        new_content_text.appendChild(new_dd_menu);
        new_dd_menu.appendChild(new_edit_p);
        new_dd_menu.appendChild(new_delete_p);
        new_dd_menu.appendChild(new_hide_p);



        new_content_text.appendChild(new_text_box);
        new_content_text.appendChild(new_hashtag);

        new_content_pic.appendChild(new_content_image);

        new_content_link.appendChild(new_portal_name);
        new_content_link.appendChild(new_link_desc);
        new_content_link.appendChild(new_more_text);

        new_content_footer.appendChild(new_upper_footer);
        new_content_footer.appendChild(new_buttons);

        new_upper_footer.appendChild(new_likes);
        new_upper_footer.appendChild(new_coments);

        new_likes.appendChild(new_like_icon);
        new_likes.appendChild(new_love_icon);
        new_likes.appendChild(new_likes_n);

        new_coments.appendChild(new_coments_p);
        new_coments.appendChild(new_share);

        new_buttons.appendChild(new_like_button);
        new_buttons.appendChild(new_coment_button);
        new_buttons.appendChild(new_share_button);

        new_like_button.appendChild(new_like_icon_button);
        new_coment_button.appendChild(new_coment_icon_button);
        new_share_button.appendChild(new_share_icon_button);

        var divs = document.getElementsByClassName('to_do');

        for (let i = 0; i < divs.length; i++) {
          divs[i].addEventListener("click", mousePosition);
        }
      });
      // ----------------DROPDOWN MENU HERE-----------------
      var item = document.getElementsByClassName('options_icon');
      Array.prototype.forEach.call(item, function (element) {
        element.addEventListener('click', function () {



          var dd = this
          var menu = this.parentNode.nextElementSibling.firstChild;
          if (dd.classList.contains('dd_active')) {
            var menu = this.parentNode.nextElementSibling.firstChild;
            var edit_menu = this.parentNode.nextElementSibling.firstChild.firstChild;
            var delete_menu = this.parentNode.nextElementSibling.firstChild.firstChild.nextElementSibling;
            var name_on_post = this.parentNode.firstChild.nextElementSibling.firstChild.innerHTML;
            menu.style.clipPath = 'circle(100%)'
            menu.style.transform = 'translate(-30px, 13px)'
            dd.classList.remove('dd_active')

            const RTdata = ref(database, 'users/' + user.uid);
            onValue(RTdata, (snapshot) => {
              const real_data = snapshot.val();
              const current_name = real_data.full_name
              if (current_name != name_on_post) {
                delete_menu.style.display = 'none'
                edit_menu.style.display = 'none'
              }
            })

          }
          else {
            var menu = this.parentNode.nextElementSibling.firstChild;
            menu.style.clipPath = 'circle(0%)'
            menu.style.transform = 'translate(27px, -50px)'
            dd.classList.add('dd_active')

          }
          document.onmouseup = (e) => {
            var menu = this.parentNode.nextElementSibling.firstChild;
            var edit_menu = this.parentNode.nextElementSibling.firstChild.firstChild;
            var delete_menu = this.parentNode.nextElementSibling.firstChild.firstChild.nextElementSibling;
            var hide_menu = this.parentNode.nextElementSibling.firstChild.firstChild.nextElementSibling.nextElementSibling;
            if (e.target !== edit_menu && e.target !== hide_menu && e.target !== delete_menu) {
              // var menu = this.parentNode.nextElementSibling.firstChild;
              menu.style.clipPath = 'circle(0%)'
              menu.style.transform = 'translate(27px, -50px)'
              dd.classList.add('dd_active')
            }
          }
        })
      });
      // --------------------------------------------------------UNFOCUS---------------------------------------------------------------------
      // Array.prototype.forEach.call(item, function (element) {
      //   element.addEventListener('blur', function () {
      //     var menu = this.parentNode.nextElementSibling.firstChild;
      //     menu.style.clipPath = 'circle(0%)'
      //     menu.style.transform = 'translate(27px, -50px)'
      //     dd.classList.add('dd_active')
      //     console.log('blur in effect')
      //   });
      // })

      // ------------------------------------------------------DELETE POST---------------------------------------------------------------
      var item = document.getElementsByClassName('delete_p');
      Array.prototype.forEach.call(item, function (element) {
        element.addEventListener('click', deleteTest)
      });
      async function deleteTest() {
        const timestamp = this.parentNode.parentNode.parentNode.firstChild.firstChild.nextElementSibling.firstChild.nextElementSibling.innerHTML
        const refference = query(collection(db, `users/${uid}/posts`), where('posted_at', '==', timestamp));
        const docSnap = await getDocs(refference)
        docSnap.forEach(async (docmnt) => {
          var doc_path = docmnt.ref.path.split("/")[3]
          const post_path = doc(db, `users/${uid}/posts`, doc_path)
          if (docmnt.exists()) {
            await deleteDoc(post_path)
              .then(() => {
                document.location.reload()
              })
              .catch(() => {



                console.log('something went wrong')
              })
          } else {
            console.log(`Document doesn't exist`)
          }
        })
      }
      // ------------------------------------------------------Edit POST---------------------------------------------------------------
      var item = document.getElementsByClassName('edit_p');
      Array.prototype.forEach.call(item, function (element) {
        element.addEventListener('click', editPost)
      });
      // function
      async function editPost() {
        scroll(0, 0);
        var post_button = document.querySelector('.post_button');
        var edit_button = document.querySelector('.edit_button');
        post_button.style.display = 'none'
        edit_button.style.display = 'block'

        var post_div = document.querySelector('.post_card');
        post_div.style.background = 'rgba(173, 51, 13, 0.4)'
        let post_field = document.getElementById('post_input');
        const timestamp = this.parentNode.parentNode.parentNode.firstChild.firstChild.nextElementSibling.firstChild.nextElementSibling.innerHTML

        const refference = query(collection(db, `users/${uid}/posts`), where('posted_at', '==', timestamp));
        const docSnap = await getDocs(refference)

        docSnap.forEach(async (docmnt) => {
          var doc_path = docmnt.ref.path.split("/")[3]
          const post_path = doc(db, `users/${uid}/posts`, doc_path)
          post_field.value = docmnt.data().text;
        })
        document.querySelector('.edit_button').addEventListener('click', function () {
          docSnap.forEach(async (docmnt) => {
            var doc_path = docmnt.ref.path.split("/")[3]
            const post_path = doc(db, `users/${uid}/posts`, doc_path)
            console.log(docmnt.data().text)
            console.log(name_box)
            if (name_box.value === '') {
              await setDoc(
                post_path, {
                text: post_field.value,
                posted_at: docmnt.data().posted_at,
                user_uid: docmnt.data().user_uid,
                full_name: docmnt.data().full_name,
                m_seconds: docmnt.data().m_seconds
              }
              )
                .then(() => {
                  console.log('Post edited');
                })
                .catch(() => {
                  console.log('something went wrong')
                })
              document.location.reload()
            } else {
              var imgToUpload = files[0];
              var ImgName = name_box.value
              const metaData = {
                contentType: imgToUpload.type
              }
              const storage = getStorage();
              const storageRef = sref(storage, "images/" + ImgName);
              const uploadTask = uploadBytesResumable(storageRef, imgToUpload, metaData);
              uploadTask.on('state-changed', (snapshot) => {
                var upload_message = document.querySelector('.upload_message');
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                upload_progress.innerHTML = progress + "%";
                if (progress != 100) {
                  upload_message.innerHTML = 'Uploading. . .'
                } else {
                  upload_message.innerHTML = '';
                }
              },
                (error) => {
                  alert("error: image not uploaded");
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref).then((DownloadURL) => {
                    const RTdata = ref(database, 'users/' + user.uid);
                    onValue(RTdata, (snapshot) => {
                      let post_field = document.getElementById('post_input');
                      docSnap.forEach(async (docmnt) => {
                        console.log(docmnt.data().text)
                        const real_data = snapshot.val();
                        var user_name = real_data.full_name;
                        let post_field = document.getElementById('post_input')

                        console.log(docmnt.data().posted_at)
                        console.log(post_field.value)
                        console.log(docmnt.data().user_uid)
                        console.log(DownloadURL)
                        console.log(docmnt.data().full_name)
                        console.log(docmnt.data().m_seconds)

                        await setDoc(
                          post_path, {
                          text: post_field.value,
                          posted_at: docmnt.data().posted_at,
                          user_uid: docmnt.data().user_uid,
                          download_link: DownloadURL,
                          full_name: docmnt.data().full_name,
                          m_seconds: docmnt.data().m_seconds
                        }
                        )
                        display_name.style.display = 'none'
                        upload_progress.innerHTML = "";
                        let clear_field = document.getElementById('post_input')
                        clear_field.value = '';
                        // name_box.value = '';
                        document.location.reload();
                      })
                    })
                    console.log(DownloadURL)
                  });
                }
              );
            };
          })
        })
      }
      // -------------------------------------------------------------------------------------------------------------------------------------------
    }
    window.onload = getAllPosts();
  } else {
    window.open("/index.html", "_self");
  }
})
// ------------------------Sign Out----------------------------
document.getElementById('sign_out').addEventListener('click', function () {
  signOut(auth).then(() => {
    window.open("/index.html", "_self");
  }).catch((error) => {
    alert('something went south');
  });
})

// Weather Widget
!function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (!d.getElementById(id)) {
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://weatherwidget.io/js/widget.min.js';
    fjs.parentNode.insertBefore(js, fjs);
  }
}(document, 'script', 'weatherwidget-io-js');

// TextArea AUTORESIZE
const textarea = document.querySelector("textarea");
textarea.addEventListener('keyup', e => {
  textarea.style.height = "auto";
  let scHeight = e.target.scrollHeight;
  textarea.style.height = `${scHeight}px`;
});

// get click Coordinates
function mousePosition(e) {
  var X = e.clientX;
  var Y = e.clientY;
  var cloud = document.querySelector('.cloud_message');
  cloud.style.left = X - 70 + 'px';
  cloud.style.top = Y - 15 + 'px';
  cloud.style.display = 'block'
  setTimeout(function () {
    cloud.style.display = 'none'
  }, 700);
}

// ------------------------------------------------------ :( To be done pop-up ---------------------------------
var divs = document.getElementsByClassName('to_do');

for (let i = 0; i < divs.length; i++) {
  divs[i].addEventListener("click", mousePosition);
}

