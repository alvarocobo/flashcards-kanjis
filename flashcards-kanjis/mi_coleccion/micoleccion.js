import { addFlashcard, addFlashcardKana } from './create_flashcard_micoleccion.js';
const indexedDB = window.indexedDB;


var lista_micoleccion = [];
var nombreDeColeccion = 'Colección: ';
var nColeccion = document.getElementById("nColeccion");

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
      const transaction = db.transaction(['colecciones'], 'readonly')
      const objectStore = transaction.objectStore('colecciones')
      var request = objectStore.get(String(localStorage.getItem('nc')));
      console.log(request);
      request.onsuccess = (e) => {
        const valor = e.target.result
        lista_micoleccion = valor.listaKanjis;
        nombreDeColeccion += valor.nombreColeccion;
        nColeccion.textContent = nombreDeColeccion;
        createFlashcards();
      }
    }
}

const url = 'https://kanjiapi.dev/v1/kanji/'

function createFlashcards() {
  if (lista_micoleccion) {
    for (let i = 0; i < lista_micoleccion.length; i++) {
      if (lista_micoleccion[i][0] == 'kanji') {
        var apiurl = url + lista_micoleccion[i][1];
        fetch(apiurl).then(response => response.json())
        .then(data => {
          var kanji = data.kanji;
          var respuestas = data.meanings;
          respuestas = respuestas.slice(0,3);
          var respuesta = "";
          for (let j = 0; j < respuestas.length; j++) {
            respuesta += respuestas[j]
            if (j < respuestas.length-1) {
              respuesta += ", ";
            }
          }
      
          var lecturas_kun = data.kun_readings;
          lecturas_kun = lecturas_kun.slice(0, 4);
          var lectura_kun = ""
          for (let j = 0; j < lecturas_kun.length; j++) {
            lectura_kun += lecturas_kun[j]
            if (j < lecturas_kun.length-1) {
              lectura_kun += ", ";
            }
          }
      
          var lecturas_on = data.on_readings;
          lecturas_on = lecturas_on.slice(0, 4);
          var lectura_on = ""
          for (let j = 0; j < lecturas_on.length; j++) {
            lectura_on += lecturas_on[j]
            if (j < lecturas_on.length-1) {
              lectura_on += ", ";
            }
          }
      
          addFlashcard(kanji, respuesta, lectura_on, lectura_kun);

        })
      .catch(err=>console.log(err))
      }
      else {
        addFlashcardKana(lista_micoleccion[i][1], lista_micoleccion[i][2]);
      }

    }
    }
}
