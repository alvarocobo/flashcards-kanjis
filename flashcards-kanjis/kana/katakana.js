
var flashcards = document.getElementById("flashcards");
var seleccionados = [];
var boton = document.getElementById("boton_seleccionados");
var listaColecciones = [];
var lista_coleccion = [];
boton.setAttribute("style", "display: none; position: relative; top: 5%; left: 71%; padding: 5px 5px 5px 5px;")

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

    const readData = (data) => {
      listaColecciones = []
      const transaction = db.transaction(['colecciones'], 'readonly')
      const objectStore = transaction.objectStore('colecciones')
      const request = objectStore.openCursor()
      request.onsuccess = (e) => {
          const cursor = e.target.result
          if (cursor) {
              listaColecciones.push(cursor.value.nombreColeccion);
              cursor.continue();
          }
          else {
            var select = document.getElementById("coleccionesOpciones");
            select.setAttribute("style", "display: none; position: relative; top: 5%; left: 75%; padding: 5px 5px 5px 5px; margin: 5px 5px 5px 5px")
            select.textContent = '';
            for (var i = 0; i < listaColecciones.length; i++) {
              var opt = document.createElement('option');
              opt.value = listaColecciones[i];
              opt.innerHTML = listaColecciones[i];
              select.appendChild(opt);
            }
          }
      }
  }

  function seleccionadosStorage() {
    var coleccionNombre = document.getElementById("coleccionesOpciones").value;
    console.log(document.getElementById("coleccionesOpciones").value);
    const transaction = db.transaction(['colecciones'], 'readwrite')
    const objectStore = transaction.objectStore('colecciones')
    var request = objectStore.get(coleccionNombre);
    console.log(request);
    request.onsuccess = (e) => {
      const valor = e.target.result
      lista_coleccion = valor.listaKanjis;
      console.log(lista_coleccion);
      for (let index = 0; index < seleccionados.length; index++) {
        if (indexOfArray(lista_coleccion, seleccionados[index]) == -1) {
          lista_coleccion.push(seleccionados[index]);
        }
      }
      const data = {
        nombreColeccion: String(coleccionNombre),
        listaKanjis: lista_coleccion
      }
      const request2 = objectStore.put(data);
      alertify.alert('Los caracteres de katakana seleccionados han sido agregados correctamente a tu colección', function(){ location.reload() }).setHeader('FlashCards Kanjis');
    }
  }

  boton.addEventListener("click", () => {
    seleccionadosStorage();
  });

    request.onerror = (error) => {
        console.log('Error', error)
    }
}

var select = document.getElementById("coleccionesOpciones");
for (var i = 0; i < listaColecciones.length; i++) {
  var opt = document.createElement('option');
  opt.value = listaColecciones[i];
  opt.innerHTML = listaColecciones[i];
  select.appendChild(opt);
}

fetch('katakana.json')
.then(response => response.json())
.then(data => {
    console.log(data);
    for (var i = 0; i < data.length; i++) {
        createFlashcardKana(data[i].character, data[i].char_id)
    }
});

function createFlashcardKana(kana, respuesta) {
    const flashcard = document.createElement("div");
    const quest = document.createElement('h2');
    const answer = document.createElement('h2');

    quest.textContent = kana;
    answer.textContent = respuesta;
    const checkbox = document.createElement('input');

    checkbox.type = 'checkbox';
    checkbox.setAttribute("style", "height: 17px; width: 17px; position: absolute; top: 5%; left: 90%")
  
    flashcard.className = 'flashcard';
    flashcard.style.position = "relative";
  
    quest.setAttribute("style", "text-align:center; padding: 5px; display:block; margin:15px 0px 0px 0px; color:black; font-size: 60px; padding-top: 70px")
    answer.setAttribute("style", "text-align:center; display:none; color:blue; font-size: 30px; padding-top: 60px; margin-left: 8px; margin-bottom:5px");

    flashcard.appendChild(quest);
    flashcard.appendChild(answer);
    flashcard.appendChild(checkbox);

    checkbox.addEventListener("click", (e) => {
        var kanaAdd = ["kana", kana, respuesta];
        if (checkbox.checked) {
            seleccionados.push(kanaAdd);
            console.log(seleccionados);
            boton.style.display = "block";
            select.style.display = "block"
        }
        else {
          var index = indexOfArray(seleccionados, kanaAdd);
          console.log(kanaAdd);
          console.log(index);
          if (index > -1) {
            seleccionados.splice(index, 1);
          }
          console.log(seleccionados);
          if (!seleccionados.length) {
            boton.style.display = "none";
            select.style.display = "none";
          }
        }
    
        if (window.event) {
          window.event.cancelBubble=true;
            }
        else {
          if (e.cancelable ) {e.stopPropagation();}
          }
    });
      
      flashcard.addEventListener("click", () => {
        if(answer.style.display == "none") {
            answer.style.display = "block";
            quest.style.paddingTop = "30px";
            quest.style.fontSize = "55px"
        } else {
            answer.style.display = "none";
            quest.style.paddingTop = "70px";
            quest.style.fontSize = "60px"
        }
    })

    flashcards.appendChild(flashcard);
}

function indexOfArray(seleccionados, array) {
    var index = -1;
    for (var i = 0; i < seleccionados.length; i++) {
        if (arrayEquals(seleccionados[i], array)) {
            index = i;
        }
    }
    return index;
}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }

console.log(arrayEquals(["hola", "pedro", "adios"], ["hola", "pedro", "adios"]))
  