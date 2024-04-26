// ***************************--Menu Button--***************************
function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// ***************************--Scroll to Top Button--***************************
const scrollTopBtn = document.querySelector(".scrollToTop_btn");
window.addEventListener("scroll", function () {
  scrollTopBtn.classList.toggle("top", window.scrollY > 500);
});
