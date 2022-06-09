var listaColecciones = []
var aviso = document.getElementById("aviso_no_coleccion");
var flashcards = document.getElementById("flashcards");
var seleccionados = [];

var importar_original = document.getElementById("importar_original");
var boton_importar = document.getElementById("boton_importar");
var boton_aceptar_importar = document.getElementById("boton_aceptar_importar")
var archivo_seleccionado = document.getElementById("archivo_seleccionado");

boton_importar.setAttribute("style", "position: relative; top: 5%; left: 0%; padding: 5px; margin-top: 10px");
boton_aceptar_importar.setAttribute("style", "display: none; padding: 5px; margin-left: 10px")

var boton = document.getElementById("boton_crear_coleccion");
boton.setAttribute("style", "position: relative; top: 5%; left: 0%; padding: 5px");

var boton2 = document.getElementById("boton_seleccionados");
boton2.setAttribute("style", "display: none; position: relative; top: 5%; left: 0%; padding: 5px; margin-top:10px")

function actualizar_aviso() {
    if (listaColecciones.length == 0) {
        aviso.setAttribute("style", "display: block; padding-left: 30%; font-size: 16px");
    } else {
        aviso.setAttribute("style", "display: none; padding-left: 30%; font-size: 16px");
    }
}

const indexedDB = window.indexedDB

if (indexedDB) {
    let db
    const request = indexedDB.open('basedatos', 1)

    request.onsuccess = () => {
        db = request.result
        console.log('OPEN', db)
        readData();
    }

    request.onupgradeneeded = () => {
        db = request.result
        console.log('Create', db)
        const objectStore = db.createObjectStore('colecciones', {
            keyPath: 'nombreColeccion'
        })
    }

    request.onerror = (error) => {
        console.log('Error', error)
    }

    const addData = (data) => {
        const transaction = db.transaction(['colecciones'], 'readwrite')
        const objectStore = transaction.objectStore('colecciones')
        const request = objectStore.add(data)
        readData();
    }

    const readData = (data) => {
        listaColecciones = []
        const transaction = db.transaction(['colecciones'], 'readonly')
        const objectStore = transaction.objectStore('colecciones')
        const request = objectStore.openCursor()
        const fragment = document.createDocumentFragment()
        request.onsuccess = (e) => {
            const flashcard = document.createElement("div");
            flashcard.className = 'flashcardColeccion';
            flashcard.style.position = "relative";
            const cursor = e.target.result
            if (cursor) {
                const img = new Image();
                img.src = '../style/export.png'
                img.alt = "Exportar la colección en formato JSON"
                img.title = "Exportar la colección";

                const exportar = document.createElement('a');
                exportar.appendChild(img);
                exportar.setAttribute("style", "width: 30px; height: 30px; display:block; position: absolute; top: 80%; left: 80%");

                var cName = cursor.value.nombreColeccion;
                var lKanjis = cursor.value.listaKanjis;

                const collectionNumber = document.createElement('h2');
                collectionNumber.setAttribute("style", "padding-left: 20%; padding-right: 20%; color:black; font-size: 17px; position: absolute; top: 70%");
                if (lKanjis.length == 1) {
                    collectionNumber.textContent = String(lKanjis.length) + " carácter"
                } else {
                    collectionNumber.textContent = String(lKanjis.length) + " caracteres"
                }

                const colectionName = document.createElement('h2');
                colectionName.textContent = cName;
                colectionName.setAttribute("style", "padding-left: 20%; padding-right: 20%");

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.setAttribute("style", "height: 14px; width: 14px; position: absolute; top: 5%; left: 90%")

                listaColecciones.push(cName);

                flashcard.appendChild(colectionName);
                flashcard.appendChild(checkbox);
                flashcard.appendChild(collectionNumber);
                flashcard.appendChild(exportar);
                fragment.appendChild(flashcard);

                const removeAccents = (str) => {
                    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                  } 

                exportar.addEventListener("click", (e) => {

                    const data = {
                        nombreDeColeccion: cName,
                        listaDeCaracteres: lKanjis
                    }
                    
                    var nombreArchivo = removeAccents(cName) + ".json"
                    download(JSON.stringify(data), nombreArchivo, "text/plain");

                    function download(content, fileName, contentType) {
                        const a = document.createElement("a");
                        const file = new Blob([content], { type: contentType });
                        a.href = URL.createObjectURL(file);
                        a.download = fileName;
                        a.click();
                       }

                    if (window.event) {
                        window.event.cancelBubble=true;
                          }
                    else {
                        if (e.cancelable ) {e.stopPropagation();}
                    }

                })

                checkbox.addEventListener("click", (e) => {
                    if (checkbox.checked) {
                      seleccionados.push(cName);
                      console.log(seleccionados);
                      boton2.style.display = "block";
                    }
                    else {
                      var index = seleccionados.indexOf(cName);
                      if (index > -1) {
                        seleccionados.splice(index, 1);
                      }
                      console.log(seleccionados);
                      if (!seleccionados.length) {
                        boton2.style.display = "none";
                      }
                    }
                    if (window.event) {
                      window.event.cancelBubble=true;
                        }
                    else {
                      if (e.cancelable ) {e.stopPropagation();}
                      }
                  })

                flashcard.addEventListener("click", () => {
                    localStorage.setItem('nc', String(cName));
                    window.open('micoleccion.html', "_self");
                })
                cursor.continue();
            }
            else {
                actualizar_aviso();
                flashcards.textContent = '';
                flashcards.appendChild(fragment);
            }
        }
    }

    boton2.addEventListener("click", () => {
        borrarColecciones();
      });

    const borrarColecciones = (data) => {
        alertify.confirm("¿Deseas eliminar las colecciones seleccionadas?", function(){for (var i = 0; i < seleccionados.length; i++) {
            console.log(seleccionados[i]);
            const transaction = db.transaction(['colecciones'], 'readwrite')
            const objectStore = transaction.objectStore('colecciones')
            const request = objectStore.delete(seleccionados[i])
        }
        location.reload()}).setHeader('FlashCards Kanjis')
    }

    boton.addEventListener("click", () => {
        crearColeccion();
      });

    function crearColeccion() {
        console.log(listaColecciones);

        alertify.prompt("Ingrese el nombre deseado para la nueva colección", "", function(evt, value) { if (value) {
            if (!(listaColecciones.includes(value))) {
                var lista = [];
                const data = {
                    nombreColeccion: String(value),
                    listaKanjis: lista
                }
                addData(data);
            }
            else {
                alertify.alert('No puedes repetir el nombre de la colección').setHeader('FlashCards Kanjis');
            }
        } else {
            alertify.alert('El nombre de la colección no puede ser vacío').setHeader('FlashCards Kanjis');
        }}).setHeader("FlashCards Kanjis")
    }

    boton_importar.addEventListener("click", (e) => {
        importar_original.click();
    });
    
    importar_original.addEventListener("change", (e) => {
        if (importar_original.value) {
            boton_importar.textContent = "Seleccionar otro archivo"
            archivo_seleccionado.textContent = importar_original.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
            boton_aceptar_importar.setAttribute("style", "display: block; padding: 5px; margin-top: 10px")
            
        }
            else {
                boton_aceptar_importar.setAttribute("style", "display: none; padding: 5px; margin-left: 10px")
                archivo_seleccionado.textContent = "No se ha elegido un archivo todavía";
            }
    });
    
    
    boton_aceptar_importar.addEventListener("click", (e) => {
        var reader = new FileReader();
        reader.addEventListener('load', function() {
            var result = JSON.parse(reader.result);
            if (result.nombreDeColeccion) {

            if (!(listaColecciones.includes(result.nombreDeColeccion))) {
                const data = {
                    nombreColeccion: result.nombreDeColeccion,
                    listaKanjis: result.listaDeCaracteres
                }
                addData(data);
                location.reload();
            } else {
                alertify.alert('Ya existe una colección con el nombre de la que desea ser imporada').setHeader('FlashCards Kanjis');
            }
        }   else {
            alertify.alert('El nombre de la colección importada no puede ser vacío').setHeader('FlashCards Kanjis');
        }
          });
        reader.readAsText(importar_original.files[0]);
    }) 
}

