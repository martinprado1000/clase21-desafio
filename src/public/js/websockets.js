const socket = io();
console.log(socket);

// Obtengo los id de cada elemento
const submitForm = document.getElementById("formProducts");
const btnSubmit = document.getElementById("submit");
const btnUpdate = document.getElementById("update");
const btnCancelUpdate = document.getElementById("cancelUpdate");
const idInput = document.getElementById("id");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const priceInput = document.getElementById("price");
const thumbnailInput = document.getElementById("thumbnail");
const codeInput = document.getElementById("code");
const stockInput = document.getElementById("stock");
const categoryInput = document.getElementById("category");

// Obtengo los datos del formulario
const obtenerDatos = () => {
  const id = idInput.value;
  const title = titleInput.value;
  const description = descriptionInput.value;
  const price = priceInput.value;
  const thumbnail = thumbnailInput.value;
  const code = codeInput.value;
  const stock = stockInput.value;
  const category = categoryInput.value;
  const product = {
    id,
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category,
  };
  return product;
};

btnCancelUpdate.addEventListener("click", (e) => {
  btnSubmit.disabled = false;
  btnUpdate.disabled = true;
  btnCancelUpdate.disabled = true;
  titleInput.value = "";
  descriptionInput.value = "";
  priceInput.value = "";
  codeInput.value = "";
  categoryInput.value = "";
  stockInput.value = "";
  thumbnailInput.value = "";
});

const buttonFn = () => {
  // ---- Editar producto --------
  const editBtn = document.getElementsByClassName("edit");
  for (var i = 0; i < editBtn.length; i++) {
    editBtn[i].onclick = async function () {
      var editProduct = this.value;
      btnSubmit.disabled = true;
      btnUpdate.disabled = false;
      btnCancelUpdate.disabled = false;
      console.log("Editar producto: " + editProduct);
      await fetch(`/realTimeProducts/${editProduct}`, {
        headers: { "Content-type": "application/json;charset=UTF-8" },
      })
        .then((response) => response.json())
        .then((data) => {
          //console.log(data.title);
          idInput.value = data.id;
          titleInput.value = data.title;
          descriptionInput.value = data.description;
          priceInput.value = data.price;
          codeInput.value = data.code;
          categoryInput.value = data.category;
          stockInput.value = data.stock;
          thumbnailInput.value = data.thumbnail;
        });
    };
  }
  // ---- Eliminar producto ----------
  const deleteBtn = document.getElementsByClassName("delete");
  for (var i = 0; i < deleteBtn.length; i++) {
    deleteBtn[i].onclick = async function () {
      var pid = this.value;
      const resDelete = await fetch(`/realTimeProducts/${pid}`, {
        method: "DELETE",
        headers: { "Content-type": "application/json;charset=UTF-8" },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status == 204) {
            alert("Producto eliminado correctamente");
            window.location.href = "/realTimeProducts";
          } else {
            alert("Producto inexistente");
          }
        })
        .catch((err) => console.log(err));
    };
  }
};
buttonFn();

// Inserto el nuevo producto
socket.on("nuevoProducto", (data) => {
  const product = JSON.parse(data);
  const table = document.getElementById("tableProducts");
  const newRow = table.insertRow();
  const id = newRow.insertCell();
  const title = newRow.insertCell();
  const description = newRow.insertCell();
  const price = newRow.insertCell();
  const thumbnail = newRow.insertCell();
  const code = newRow.insertCell();
  const stock = newRow.insertCell();
  const category = newRow.insertCell();
  const cellEdit = newRow.insertCell();
  const cellDelete = newRow.insertCell();
  id.textContent = product.id;
  title.textContent = product.title;
  description.textContent = product.description;
  price.textContent = product.price;
  thumbnail.textContent = product.thumbnail;
  code.textContent = product.code;
  stock.textContent = product.stock;
  category.textContent = product.category;
  const btnEdit = document.createElement("button");
  btnEdit.innerText = "Editar";
  btnEdit.value = product.id;
  btnEdit.classList.add("edit", "btn", "btn-primary", "btn-sm");
  cellEdit.appendChild(btnEdit);
  const btnDelete = document.createElement("button");
  btnDelete.innerText = "Eliminar";
  btnDelete.value = product.id;
  btnDelete.classList.add("delete", "btn", "btn-danger", "btn-sm");
  cellDelete.appendChild(btnDelete);
  buttonFn();
});

// Envio nuevo producto al backend
submitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newProduct = obtenerDatos();
  console.log(newProduct);

  fetch("/realTimeProducts", {
    method: "POST",
    headers: { "Content-type": "application/json;charset=UTF-8" },
    body: JSON.stringify(newProduct),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status == 200 || data.status == 201) {
        alert("Producto agregado correctamente");
        titleInput.value = "";
        priceInput.value = "";
        descriptionInput.value = "";
        priceInput.value = "";
        codeInput.value = "";
        categoryInput.value = "";
        stockInput.value = "";
        thumbnailInput.value = "";
      } else {
        alert("Campos incompletos");
      }
    })
    .catch((err) => console.log(err));
});

btnUpdate.addEventListener("click", (e) => {
  e.preventDefault();
  const newProduct = obtenerDatos();
  console.log(newProduct.id);
  fetch(`/realTimeProducts/${newProduct.id}` , {
    method: "PUT",
    headers: { "Content-type": "application/json;charset=UTF-8" },
    body: JSON.stringify(newProduct),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status == 200 || data.status == 201) {
        alert("Producto actualizado correctamente");
        titleInput.value = "";
        descriptionInput.value = "";
        codeInput.value = "";
        categoryInput.value = "";
        stockInput.value = "";
        thumbnailInput.value = "";
        window.location.href = "/realTimeProducts";
      } else {
        alert("Campos incompletos");
      }
    })
    .catch((err) => console.log(err));
});
