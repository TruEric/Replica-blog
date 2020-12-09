// https://blog-kodemia-default-rtdb.firebaseio.com/BlogKodemia/

let newPostEntry = {
  featured: true, //le dice al objeto que, de entrada tendra el input checkbox marcado(true)
}; //guardara las entradas del post como JSON

//let featuredPost = []//Para guardar localmente los post que sean marcados como y se llenara con una funcion que filtrata los posts

//Listener                          //callback como parametro
//Va a capturar los cambios en los eventos del modal
$("input, textarea, select").change((event) => {
  console.log(event.target); //mostrar los cambios en los inputs en consola
  let propierty = event.target.name; //guarda el evento, el target y el nombre del ID
  let value =
    event.target.type === "checkbox"
      ? !newPostEntry.featured
      : event.target.value; //guarda el evento, el target y el valor del ID, si el tipo de el input es igual a "checkbox" entonces el valor que vas a regresar es el opuesto de lo que este en "featured", si el valor no es "checkbox" el valor que vas a regresar es el del input
  newPostEntry[propierty] = value; //Le agrega a newPostEntry lo que captura el input(propierty) y le asigna el valor de lo escrito(value), volviendolo un objeto que contiene lo escrito en los inputs
  console.log(newPostEntry); //Muestra en consola lo capturado en el objeto
});

//Funcion que nos permita guardar el objeto en una base de datos con el metodo ajax
//saveEntry recibe la data de entrada, hace una peticion AJAX hacia la url de la base de datos mediante el metodo POST, data va a hacer lo que le envien en la funcion (entryData)=>{} y va a imprimir si la peticon es exitosa o tiene algun error
const saveEntry = (entryData) => {
  $.ajax({
    url: "https://blog-kodemia-default-rtdb.firebaseio.com/BlogKodemia/.json", //La URL de la base de datos, con la ruta del endpoint y al final agregar .json para firebase
    data: JSON.stringify(entryData), //El objeto que se va a mandar a la base de datos, que es lo que esta recibiendo la funcion, exclusivamente para firebase agregar JSON.stringify para tratar los datos como string
    method: "POST", //El metodo para crear datos en la base
    success: (response) => {
      console.log(response); //callback de success(peticion exitosa), necesita una funcion para saber que nos imprima en pantalla la respuesta del servidor
      getPosts(); //Llama a la funcion para obtener los post y guardarlos como una entrada nueva
      $("#uploadPost").modal("hide"); //esto cierra el modal una vez que se ha gurdado un post dando click en el boton
    },
    error: (response) => {
      console.log(response); //callback de error(peticion denegada), necesita una funcion para saber que nos imprima en pantalla la respuesta del servidor
    },
  });
};

$("#save-post").click(() => {
  //vincula el ID que esta en html y le agrega el listener click, ejecutandose cuando se guardan las entradas en el JSON
  saveEntry(newPostEntry);
});

//funcion para filtrar posts por cualquier criterio  //Recibe como prametros la data a filtrar, el criterio y el valor, con base a que se va a filtrar
const filterData = (dataToFilter, criteria, value) => {
  let result = []; //array vacio donde se agregaran los datos ya filtrados
  for( key in dataToFilter ){
    console.log( dataToFilter[key][criteria])
    dataToFilter[key][criteria] === value 
        ? result.push(dataToFilter[key])
        : null
}
return result
};

//funcion que mostrara todos los posts y funcionara una vez que la peticion GET sea exitosa
const printPost = (dataToPrint) => {
  $(".general-post-wrapper").empty(); //para evitar repetir los post, se debe vaciar la funcion antes de agregarle contenido, tomando como referencia la clase .general-post-wrapper y usando el metodo de JQUERY .empty() para vaciarlo
  //La funcion necesita el parametro de los datos que imprimira(JSON)
  for (key in dataToPrint) {
    //Itera en cada key del objeto que devuelve getPosts
    console.log("key", key); //Imprime cada una de las llaves
    console.log("object ", dataToPrint[key]); //con esto se accede a cada una de las llaves, que tienen guardado un objeto
    let { title, text, author, picUrl } = dataToPrint[key]; // los datos de la variable se obtinen de dataToPrint[key]

    //Esta variable se utilisa para poder ingresar lo obtenido a nuestro html con datos dinamicos
    let entryHTML = `            
    <div class="card mb-3">
    <div class="row no-gutters">
      <div class="col-md-4">
        <img src="${picUrl}" class="card-img" alt="...">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
            <p class="card-text">${text}</p>
            <p class="card-text">
            <small class="text-muted author">${author}</small>
            <small class="text-muted date">08 diciembre 2020</small>
            <div class="btn btn-warning btn-sm" data-entry-key = ${key}>Leer más tarde</div>
            </p>
          </div>
        </div>
     </div>
    </div>
  `;

    $(".general-post-wrapper").append(entryHTML); //Esto le dice a HTML donde se va agregar el contenido usando la clase .general-post-wrapper como referencia y agregandole el metodo de incercion JQUERY append() y agregando el contenido de la variable entryHTML
  }
};

//traer los posts para poder mostrarlos con uan peticion AJAX del tipo GET
const getPosts = () => {
  $.ajax({
    url: "https://blog-kodemia-default-rtdb.firebaseio.com/BlogKodemia/.json", //La URL de la base de datos, con la ruta del endpoint y al final agregar .json para firebase
    //data: JSON.stringify(entryData), al ser GET no necesita datos de entrada //El objeto que se va a mandar a la base de datos, que es lo que esta recibiendo la funcion, exclusivamente para firebase agregar JSON.stringify para tratar los datos como string
    method: "GET", //El metodo para crear datos en la base
    success: (response) => {
      console.log(response); //callback de success(peticion exitosa), necesita una funcion para saber que nos imprima en pantalla la respuesta del servidor
      printPost(response); //si es exitosa devuelve un JSON y se lo da como parametro a la funcion printPosts
      let musicPost = filterData(response, "category", "Music");
      console.log(musicPost)
    },
    error: (response) => {
      console.log(response); //callback de error(peticion denegada), necesita una funcion para saber que nos imprima en pantalla la respuesta del servidor
    },
  });
};

getPosts(); //Llamada a la funcion que trae los post(peticion AJAX)
