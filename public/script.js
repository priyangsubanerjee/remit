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
      JSON.stringify({
        name: gmailName.value,
        email: gmailEmail.value,
        password: gmailAppPassword.value,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept, Authorization",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    )
    .then((res) => {
      if (res.status === 200) {
        alert("Api token sent to your email !");
      } else {
        alert("Something went wrong !");
      }
      console.log(res);
      loader.classList.remove("active");
    })
    .catch((err) => {
      console.log(err);
      loader.classList.remove("active");
      alert(err);
    });
});
