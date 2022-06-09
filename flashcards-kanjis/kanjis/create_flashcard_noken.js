const indexedDB = window.indexedDB

var listaColecciones = [];
var lista_coleccion = [];

var select = document.getElementById("coleccionesOpciones");
select.setAttribute("style", "display: none; position: relative; top: 5%; left: 75%; padding: 5px; margin: 5px")
var boton = document.getElementById("boton_seleccionados");
boton.setAttribute("style", "display: none; position: relative; top: 5%; left: 71%; padding: 5px;")

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
      alertify.alert('Los kanjis seleccionados han sido agregados correctamente a tu colección', function(){ location.reload() }).setHeader('FlashCards Kanjis');
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


var seleccionados = [];

if (localStorage.getItem("mi_coleccion")) {
  var lista_micoleccion =  JSON.parse(localStorage.getItem("mi_coleccion"));
} else {
  var lista_micoleccion = [];
}

  console.log(lista_micoleccion);
  
  function irAJisho(kanji) {
    var url = 'https://jisho.org/search/';
    url += kanji ;
    url += '%20%23kanji'
    window.open(url, "_blank");
  }

  export function filtrar_noken(dict, value) {
    var permitidos = [];
    var obj = Object.keys(dict);
    for (let i = 0; i < obj.length; i++) {
          var elemento = dict[obj[i]];
          if (elemento.jlpt_new == value) {
            permitidos.push(obj[i]);
          }
    }
    return permitidos
}
  
  function flashcardMaker(text) {
    const flashcard = document.createElement("div");
    const question = document.createElement('h2');
    const kunyomi = document.createElement('span');
    const onyomi = document.createElement('span');
    const hueco = document.createElement('h2');
    const kunReading = document.createElement('span');
    const onReading = document.createElement('span');
    const hueco2 = document.createElement('h2');
    const answer = document.createElement('h2');
    const link = document.createElement('a');
    const checkbox = document.createElement('input');
  
    const img = new Image();
    img.src = '../style/jisho2.png'
    img.alt = "Ir a Jisho"
    img.title = "Consultar kanji " + text.my_question + " en el diccionario Jisho";
    link.appendChild(img);
  
    checkbox.type = 'checkbox';
    checkbox.setAttribute("style", "height: 17px; width: 17px; position: absolute; top: 5%; left: 90%")
  
    flashcard.className = 'flashcard';
    flashcard.style.position = "relative";
  
    question.setAttribute("style", "text-align:center; padding: 5px; margin:15px 0px 0px 0px; color:black; font-size: 60px; padding-top: 70px");
    question.textContent = text.my_question;
  
    kunyomi.setAttribute("style", "float:left; display:none; padding-left: 45px; font-style: italic;");
    kunyomi.textContent = "Kunyomi"
  
    onyomi.setAttribute("style", "float:right; display:none; padding-right: 45px; font-style: italic;");
    onyomi.textContent = "Onyomi"
  
    
    kunReading.setAttribute("style", "float:left; display:none; padding-left: 35px; word-spacing: 9999px; max-width: 12ch; font-size: 15px");
    kunReading.textContent = text.lectura_kun;
  
    onReading.setAttribute("style", "float:right; display:none; padding-left: 5px; word-spacing: 9999px; max-width: 12ch; font-size: 15px");
    onReading.textContent = text.lectura_on;
  
    if (!text.lectura_on.includes(",")){
      onReading.setAttribute("style", "float:right; display:none; padding-right: 55px; word-spacing: 9999px; max-width: 12ch; font-size: 15px");
    }
  
  
    if (text.my_answer.length > 36) {
      answer.setAttribute("style", "text-align:center; display:none; color:blue; font-size: 17px; padding-top: 45px; margin-left: 8px; margin-bottom:5px");
    } else {
      answer.setAttribute("style", "text-align:center; display:none; color:blue; font-size: 17px; padding-top: 60px; margin-left: 8px; margin-bottom:5px");
    }
    answer.textContent = text.my_answer;
  
    link.setAttribute("style", "display:none;");
    
  
    flashcard.appendChild(question);
    flashcard.appendChild(kunyomi);
    flashcard.appendChild(onyomi)
    flashcard.appendChild(hueco);
    flashcard.appendChild(kunReading);
    flashcard.appendChild(onReading);
    flashcard.appendChild(hueco2);
    flashcard.appendChild(answer);
    flashcard.appendChild(link);
    flashcard.appendChild(checkbox);
  
  
    link.addEventListener("click", (e) => {
      irAJisho(text.my_question);
      if (window.event) {
        window.event.cancelBubble=true;
          }
      else {
        if (e.cancelable ) {e.stopPropagation();}
        }
    })

    flashcard.addEventListener("click", () => {
      if(kunyomi.style.display == "none") {
        question.style.paddingTop = "0px";
        question.style.fontSize = "33px"
        kunyomi.style.display = "block";
        onyomi.style.display = "block";
        kunReading.style.display = "block";
        onReading.style.display = "block";
        answer.style.display = "block";
        img.style.display = "block";
        link.setAttribute("style", "width: 30px; height: 30px; display:block; position: absolute; top: 84%; left: 15%");
      }
      else{
        question.style.paddingTop = "70px";
        question.style.fontSize = "60px"
        kunyomi.style.display = "none";
        onyomi.style.display = "none";
        kunReading.style.display = "none";
        onReading.style.display = "none";
        answer.style.display = "none";
        link.style.display = "none";
        img.style.display = "none";
        
      }
    })
  
    checkbox.addEventListener("click", (e) => {
      var kanjiAdd = ["kanji", text.my_question, text.my_answer, text.nivel];
      if (checkbox.checked) {
        seleccionados.push(kanjiAdd);
        console.log(seleccionados);
        boton.style.display = "block";
        select.style.display = "block"
      }
      else {
        var index = indexOfArray(seleccionados, kanjiAdd);
        console.log(kanjiAdd);
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
    })
  
    document.querySelector("#flashcards").appendChild(flashcard);
  }
  
  export function addFlashcard(kanji, respuesta, lectura_on, lectura_kun, nivel) {
  
    let flashcard_info = {
      'my_question' : kanji,
      'my_answer'  : respuesta,
      'lectura_on' : lectura_on,
      'lectura_kun' : lectura_kun,
      'nivel' : nivel
    }
  
    flashcardMaker(flashcard_info);
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
