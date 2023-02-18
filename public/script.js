const gmailForm = document.querySelector(".gmailForm");
const gmailName = document.querySelector(".gmailName");
const gmailEmail = document.querySelector(".gmailEmail");
const gmailAppPassword = document.querySelector(".gmailAppPassword");
const loader = document.querySelector(".loader");

gmailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loader.classList.add("active");
  axios
    .post("/create", {
      name: gmailName.value,
      email: gmailEmail.value,
      password: gmailAppPassword.value,
    })
    .then((res) => {
      console.log(res);
      loader.classList.remove("active");
      alert("Api token sent to your email !");
    })
    .catch((err) => {
      console.log(err);
      loader.classList.remove("active");
      alert(err);
    });
});
