const navbar = document.getElementById('nav-2');
const image = document.querySelector('.imgg');
const div_image = document.querySelector('.img');
const nav = document.getElementById('nav-2');
let scrolled = false;
window.onscroll = function () {
  if (window.pageYOffset > 150) {
    // image.style.opacity = 0;
    // image.style.transform = 'translateY(-2000px)';
    image.style.height = ("0vh");
    nav.style.display = ('flex');


    // if (!scrolled) {
    //   navbar.style.transform = 'translateY(-70px)';
    // }
    // setTimeout(function () {
    //   navbar.style.transform = 'translateY(0)';
    //   scrolled = true;
    // }, 200);
  } else {
    navbar.classList.add('top');
    scrolled = false;
  }
}