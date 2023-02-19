const apiToken = "abcxyz";
const to = "abc@gmail.com";
const html = "<h1>Hi</h1>";
const subject = "Form submission";

// POST request to /send endpoint

axios
  .post(`https://remitapi.vercel.app/send/${apiToken}`, {
    to,
    html,
    subject,
  })
  .then((res) => {
    if (res.status === 200) {
      alert("Message sent successfully");
    } else {
      alert("Something went wrong");
    }
  })
  .catch((err) => {
    console.log(err);
    alert("Something went wrong");
  });

// delete this token

const apiToken2 = "abcxyz";

axios
  .get(`https://remitapi.vercel.app/delete/${apiToken2}`)
  .then((res) => {
    if (res.status === 200) {
      alert("Token deleted successfully");
    } else {
      alert("Something went wrong");
    }
  })
  .catch((err) => {
    console.log(err);
    alert("Something went wrong");
  });
