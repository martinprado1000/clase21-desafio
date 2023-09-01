const socket = io();
console.log(socket);

const submitFormResetPassword = document.getElementById("formResetPassword");
const btnNewPassword = document.getElementById("btnNewPassword")
const emailResetPassword = document.getElementById("emailResetPassword");
const newPassword = document.getElementById("newPassword");

submitFormResetPassword.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    email: emailResetPassword.value,
    password: newPassword.value,
  };
  console.log(data)
  try {
    await fetch("/api/resetPassword", {
      method: "POST",
      headers: { "Content-type": "application/json;charset=UTF-8" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((res) => {
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
          emailResetPassword.value = "";
          newPassword.value = "";
        }
      });
  } catch (e) {
    console.log(e);
  }
});
