const socket = io();
console.log(socket);

const submitFormLogin = document.getElementById("formLoginUser");
const btnLogin = document.getElementById("btnLogin");
const email = document.getElementById("emailLogin");
const password = document.getElementById("passwordLogin");

// submitFormLogin.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const data = {
//     email: email.value,
//     password: password.value,
//   };
//   console.log(data);
//   socket.emit("loginUser", data);
// });

submitFormLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    email: email.value,
    password: password.value,
  };
  try {
    await fetch("/api/login", {
      method: "POST",
      headers: { "Content-type": "application/json;charset=UTF-8" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())  
      .then((res) => {
        //console.log(res);
        if (res.status == 200){
          Swal.fire({
            title: `${res.data}`,
            icon: "success", // succes , warning , info , question
            timer: 2000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            window.location.href = `http://localhost:8080/realTimeProducts`;
          }, 2000);
        } else {
          Swal.fire({
            title: `${res.data}`,
            icon: "warning", // succes , warning , info , question
            timer: 2000,
            timerProgressBar: true,
          });
          email.value = "";
          password.value = "";
        }
      });
  } catch (e) {
    console.log(e);
  }
});