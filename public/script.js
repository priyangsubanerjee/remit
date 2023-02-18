const gmailForm = document.querySelector(".gmailForm");
const gmailName = document.querySelector(".gmailName");
const gmailEmail = document.querySelector(".gmailEmail");
const gmailAppPassword = document.querySelector(".gmailAppPassword");

gmailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  axios
    .post("/create", {
      name: gmailName.value,
      email: gmailEmail.value,
      password: gmailAppPassword.value,
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
});
