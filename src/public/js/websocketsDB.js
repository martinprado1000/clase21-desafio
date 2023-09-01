const socket = io();
console.log(socket);

// Obtengo los id de cada elemento
const login = document.getElementById("logOut");
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

// Limpio el formulario
const limpiarFormulario = () => {
  idInput.value = "";
  titleInput.value = "";
  descriptionInput.value = "";
  priceInput.value = "";
  codeInput.value = "";
  categoryInput.value = "";
  stockInput.value = "";
  thumbnailInput.value = "";
};

logOut.addEventListener("click", async (e) => {
  await fetch("/api/register", {
    method: "DELETE",
    headers: { "Content-type": "application/json;charset=UTF-8" },
  })
    .then((res) => JSON.stringify(res))
    .then((res) => {
      console.log("se destruyo la sesion");
      window.location.href = "http://localhost:8080/login";
    });
});

//Editar producto
const buttonFn = () => {
  // ---- Editar producto --------
  const editBtn = document.getElementsByClassName("edit");
  for (var i = 0; i < editBtn.length; i++) {
    editBtn[i].onclick = async function () {
      var editProduct = this.value;
      btnSubmit.disabled = true;
      btnUpdate.disabled = false;
      btnCancelUpdate.disabled = false;
      codeInput.disabled = true;
      console.log("Editar producto: " + editProduct);
      socket.emit("getProductById", JSON.stringify(editProduct));
      socket.on("getProductById", async (res) => {
        const getId = JSON.parse(res);
        const data = getId.data;
        idInput.value = data._id;
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
      console.log(pid);
      socket.emit("deleteProduct", pid);
    };
  }

  // ---- Agregar producto al carrito----------
  const addCartBtn = document.getElementsByClassName("addCart");
  for (var i = 0; i < addCartBtn.length; i++) {
    addCartBtn[i].onclick = async function () {
      var pid = this.value;
      console.log("Agregar producto: " + pid);
      const addProdutToCart = [
        {
          product: pid,
          quantity: 1,
        },
      ];
      await fetch("/api/carts", {
        method: "POST",
        headers: { "Content-type": "application/json;charset=UTF-8" },
        body: JSON.stringify(addProdutToCart),
      })
        .then((res) => JSON.stringify(res))
        .then((res) => {
          console.log("se destruyo la sesion");
        });
      // const addProdutToCart = {
      //   email,
      //   products: [
      //     {
      //       product: pid,
      //       quantity: 1,
      //     },
      //   ],
      // };
      // socket.emit("addCart", addProdutToCart);
    };
  }
};
//};
buttonFn();

//Cancelo edicion de producto
btnCancelUpdate.addEventListener("click", (e) => {
  btnSubmit.disabled = false;
  btnUpdate.disabled = true;
  btnCancelUpdate.disabled = true;
  codeInput.disabled = false;
  limpiarFormulario();
});

// Envio nuevo producto al backend
submitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newProduct = obtenerDatos();
  console.log(newProduct);
  socket.emit("newProduct", newProduct);
});

// Cargo nuevo producto en el front
socket.on("newProduct", (data) => {
  const product = JSON.parse(data);
  const table = document.getElementById("tableProducts");
  const newRow = table.insertRow();
  //const id = newRow.insertCell();
  const title = newRow.insertCell();
  const description = newRow.insertCell();
  const price = newRow.insertCell();
  const code = newRow.insertCell();
  const stock = newRow.insertCell();
  const category = newRow.insertCell();
  const cellEdit = newRow.insertCell();
  const cellDelete = newRow.insertCell();
  const cellAddCart = newRow.insertCell();
  //id.textContent = product._id;
  title.textContent = product.title;
  description.textContent = product.description;
  price.textContent = product.price;
  code.textContent = product.code;
  stock.textContent = product.stock;
  category.textContent = product.category;
  const btnEdit = document.createElement("button");
  btnEdit.innerText = "Editar";
  btnEdit.value = product._id;
  btnEdit.classList.add("edit", "btn", "btn-primary", "btn-sm");
  cellEdit.appendChild(btnEdit);
  const btnDelete = document.createElement("button");
  btnDelete.innerText = "Eliminar";
  btnDelete.value = product._id;
  btnDelete.classList.add("delete", "btn", "btn-danger", "btn-sm");
  cellDelete.appendChild(btnDelete);
  const h5logged = document.createElement("button");
  h5logged.innerText = "Agregar al carrito";
  h5logged.value = product._id;
  h5logged.classList.add("logged", "btn", "btn-info", "btn-sm");
  cellAddCart.appendChild(h5logged);
  buttonFn();
  Swal.fire({
    title: `Producto con codigo ${product.code} agregado correctamente`,
    icon: "success", // succes , warning , info , question
    timer: 2000,
    timerProgressBar: true,
  });
  limpiarFormulario();
});

// Envio producto a editar al backend
btnUpdate.addEventListener("click", (e) => {
  e.preventDefault();
  const updateProduct = obtenerDatos();
  //console.log(updateProduct);
  socket.emit("editProduct", JSON.stringify(updateProduct));
});

socket.on("editProduct", (resp) => {
  const prod = JSON.parse(resp);
  console.log(prod.data);
  Swal.fire({
    title: `${prod.data}`,
    icon: "success", // succes , warning , info , question
    timer: 2000,
    timerProgressBar: true,
  });
  idInput.value = "";
  titleInput.value = "";
  descriptionInput.value = "";
  priceInput.value = "";
  codeInput.value = "";
  categoryInput.value = "";
  stockInput.value = "";
  thumbnailInput.value = "";
  setTimeout(() => {
    window.location.href = "http://localhost:8080/realTimeProducts";
  }, 2000);
});

socket.on("deleteProduct", (resp) => {
  const prod = JSON.parse(resp);
  console.log(prod.data);
  Swal.fire({
    title: `${prod.data}`,
    icon: "success", // succes , warning , info , question
    timer: 2000,
    timerProgressBar: true,
  });
  setTimeout(() => {
    window.location.href = "http://localhost:8080/realTimeProducts";
  }, 2000);
});

socket.on("addedProductToCart", async (data) => {
  const addedProductToCart = JSON.parse(data);
  console.log(addedProductToCart.data);
  Swal.fire({
    title: addedProductToCart.data,
    icon: "success", // succes , warning , info , question
    timer: 10000,
    timerProgressBar: true,
  });
});

// Cartel de error
socket.on("error", (e) => {
  const error = JSON.parse(e);
  console.log(error.data);
  Swal.fire({
    title: "Error",
    text: `${error.data}`,
    icon: "error", // succes , warning , info , question
  });
});
