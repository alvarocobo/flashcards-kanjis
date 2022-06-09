var boton = document.getElementById("boton_seleccionados");
boton.setAttribute("style", "display: none; position: relative; top: 5%; left: 75%; padding: 5px 5px 5px 5px")

var seleccionados = [];
var lista_micoleccion = [];
var nombreColeccion = '';

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
        const valor = e.target.result;
        lista_micoleccion = valor.listaKanjis;
        nombreColeccion = valor.nombreColeccion;
      }
    }

    const actualizarData = (data) => {
      const transaction = db.transaction(['colecciones'], 'readwrite')
      const objectStore = transaction.objectStore('colecciones')
      const request = objectStore.put(data)
    }

    boton.addEventListener("click", () => {
      seleccionadosStorage();
    });

    function seleccionadosStorage() {
      for (let index = 0; index < seleccionados.length; index++) {
        var ind = indexOfKanji(lista_micoleccion, seleccionados[index]);
        console.log(ind)
        lista_micoleccion.splice(ind, 1); 
      }
      console.log(lista_micoleccion);
      const data = {
        nombreColeccion: String(nombreColeccion),
        listaKanjis: lista_micoleccion
      }

      alertify.confirm("¿Deseas eliminar los kanjis seleccionados de tu colección?", function(){actualizarData(data); location.reload()});
    }
}
  
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
  
    checkbox.addEventListener("click", (e) => {
      if (checkbox.checked) {
        seleccionados.push(text.my_question);
        console.log(seleccionados);
        boton.style.display = "block";
      }
      else {
        var index = seleccionados.indexOf(text.my_question);
        if (index > -1) {
          seleccionados.splice(index, 1);
        }
        console.log(seleccionados);
        if (!seleccionados.length) {
          boton.style.display = "none";
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
  
    document.querySelector("#flashcards").appendChild(flashcard);
  }

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

  export function addFlashcardKana(kana,respuesta) {
    createFlashcardKana(kana, respuesta);
  }
  
  export function addFlashcard(kanji, respuesta, lectura_on, lectura_kun) {
  
    let flashcard_info = {
      'my_question' : kanji,
      'my_answer'  : respuesta,
      'lectura_on' : lectura_on,
      'lectura_kun' : lectura_kun
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

function indexOfKanji(lista, kanji) {
  var index = -1;
  if (Array.isArray(kanji)) {
    kanji = kanji[1];
  }
  for (let i = 0; i < lista.length; i++) {
    if (lista[i][1] == kanji) {
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

