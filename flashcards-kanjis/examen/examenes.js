var listaColecciones = []
var aviso = document.getElementById("aviso_no_coleccion");
var flashcards = document.getElementById("flashcards");


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
                console.log(cursor.value);
                const colectionName = document.createElement('h2');
                colectionName.textContent = cursor.value.nombreColeccion;
                colectionName.setAttribute("style", "padding-left: 20%; padding-right: 20%");
                var lKanjis = cursor.value.listaKanjis;
                const collectionNumber = document.createElement('h2');
                if (lKanjis.length == 1) {
                    collectionNumber.textContent = String(lKanjis.length) + " carácter"
                } else {
                    collectionNumber.textContent = String(lKanjis.length) + " caracteres"
                }
                collectionNumber.setAttribute("style", "padding-left: 20%; padding-right: 20%; color:black; font-size: 17px; position: absolute; top: 70%");
                listaColecciones.push(cursor.value.nombreColeccion);
                flashcard.appendChild(colectionName);
                flashcard.appendChild(collectionNumber);
                flashcard.addEventListener("click", () => {
                    if (lKanjis.length > 0) {
                        localStorage.setItem('nc', String(colectionName.textContent));
                        window.open('examen.html', "_self");
                    } else {
                        alertify.alert("Esta colección no tiene ningun carácter añadido.").setHeader('FlashCards Kanjis');
                    }
                })
                fragment.appendChild(flashcard);
                cursor.continue();
            }
            else {
                actualizar_aviso();
                flashcards.textContent = '';
                flashcards.appendChild(fragment);
            }
        }
    }   
}


