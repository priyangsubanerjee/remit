const gmailForm = document.querySelector(".gmailForm");
const gmailName = document.querySelector(".gmailName");
const gmailEmail = document.querySelector(".gmailEmail");
const gmailAppPassword = document.querySelector(".gmailAppPassword");
const loader = document.querySelector(".loader");

gmailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loader.classList.add("active");
  axios
    .post(
      "/create",
      {
        name: gmailName.value,
        email: gmailEmail.value,
        password: gmailAppPassword.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization, Content-Length, X-Requested-With",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Max-Age": "86400",
          "Access-Control-Expose-Headers": "Content-Length, X-JSON",
          "Access-Control-Allow-Headers":
            "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
        },
      }
    )
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
