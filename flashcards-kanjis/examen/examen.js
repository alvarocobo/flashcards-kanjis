var nc = localStorage.getItem('nc');
var lista_micoleccion = [];
var nombreDeColeccion = 'Examen de la colección: ';
var nColeccion = document.getElementById("nColeccion");
var nRespondidas = document.getElementById("nRespondidas");
var pregunta = document.getElementById("pregunta");
var boton = document.getElementById("siguiente");
var boton2 = document.getElementById("volver");
boton.setAttribute("style", "display: none; position: relative; top: 5%; left: 44%; padding: 5px; margin-top: 20px")
boton2.setAttribute("style", "display: none; position: relative; top: 5%; left: 44%; padding: 5px; margin-top: 20px")
var N5 = [];
var N4 = [];
var N3 = [];
var N2 = [];
var N1 = [];
var Kana = [];
var nAciertos = 0;
pregunta.className = 'flashcardKana'
pregunta.setAttribute("style",'position: relative; top: 5%; left: 38%; margin-top: 50px; margin-bottom: 50px');

const respuestas = document.getElementById('flashcards');
var i = 0;

function filtrar_noken_respuestas(dict, value) {
    var permitidos = [];
    var obj = Object.keys(dict);
    for (let i = 0; i < obj.length; i++) {
          var elemento = dict[obj[i]];
          if (elemento.jlpt_new == value) {
            permitidos.push(dict[obj[i]].meanings);
          }
    }
    return permitidos
}

async function rellenarListas() {
    fetch('../kanjis/kanjis.json')
    .then(response => response.json())
    .then(data => {
        N5 = juntarArrayString(filtrar_noken_respuestas(data, 5));
        N4 = juntarArrayString(filtrar_noken_respuestas(data, 4));
        N3 = juntarArrayString(filtrar_noken_respuestas(data, 3));
        N2 = juntarArrayString(filtrar_noken_respuestas(data, 2));
        N1 = juntarArrayString(filtrar_noken_respuestas(data, 1));

        fetch('../kana/hiragana.json')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                Kana.push(data[i].char_id);
            }
            realizarExamen();
        })
    });
}

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
      request.onsuccess = (e) => {
        const valor = e.target.result
        lista_micoleccion = valor.listaKanjis;
        nombreDeColeccion += valor.nombreColeccion;
        nColeccion.textContent = nombreDeColeccion;
        shuffleArray(lista_micoleccion);
        rellenarListas();
      }
    }
}

boton.addEventListener("click", (e) => {
    i++;
    realizarExamen();
});

boton2.addEventListener("click", (e) => {
    window.open('examenes.html', "_self");
})

async function realizarExamen() {
    boton.style.display = "none";
    if(i < lista_micoleccion.length) {
        nRespondidas.textContent = String(i+1) + " / " + String(lista_micoleccion.length)
        var tipo_caracter = lista_micoleccion[i][0]

        pregunta.textContent = '';
        const preguntaTexto = document.createElement('h2');
        pregunta.appendChild(preguntaTexto);
        preguntaTexto.setAttribute("style", "padding: 40px 1000px 0px 58px; color:black; font-size: 45px;")

        respuestas.textContent = '';

        var respuesta1 = document.createElement('div')
        respuesta1.className = 'flashcardRespuesta'
        var respuesta2 = document.createElement('div')
        respuesta2.className = 'flashcardRespuesta'
        var respuesta3 = document.createElement('div')
        respuesta3.className = 'flashcardRespuesta'
        var respuesta4 = document.createElement('div')
        respuesta4.className = 'flashcardRespuesta'

        const respuesta1Texto = document.createElement('h2');
        respuesta1.appendChild(respuesta1Texto);

        const respuesta2Texto = document.createElement('h2');
        respuesta2.appendChild(respuesta2Texto);

        const respuesta3Texto = document.createElement('h2');
        respuesta3.appendChild(respuesta3Texto);

        const respuesta4Texto = document.createElement('h2');
        respuesta4.appendChild(respuesta4Texto);

        respuestas.appendChild(respuesta1)
        respuestas.appendChild(respuesta2)
        respuestas.appendChild(respuesta3)
        respuestas.appendChild(respuesta4)

        respuesta1Texto.setAttribute("style", "color:black; font-size: 17px; position: relative; top: 14%; left: 5%;")
        respuesta2Texto.setAttribute("style", "color:black; font-size: 17px; position: relative; top: 14%; left: 5%;")
        respuesta3Texto.setAttribute("style", "color:black; font-size: 17px; position: relative; top: 14%; left: 5%;")
        respuesta4Texto.setAttribute("style", "color:black; font-size: 17px; position: relative; top: 14%; left: 5%;")

        preguntaTexto.textContent = lista_micoleccion[i][1];

        if (tipo_caracter == 'kana') {
            var listaRespuestas = escogeTresRespuestasFalsas(lista_micoleccion[i][2], 'Kana')
        }
        else {
            var nivel = lista_micoleccion[i][3]
            var listaRespuestas = escogeTresRespuestasFalsas(lista_micoleccion[i][2], nivel)
            }

        var indRespuestaCorrecta = listaRespuestas.indexOf(lista_micoleccion[i][2]);
        respuesta1Texto.textContent = listaRespuestas[0]
        respuesta2Texto.textContent = listaRespuestas[1]
        respuesta3Texto.textContent = listaRespuestas[2]
        respuesta4Texto.textContent = listaRespuestas[3]
        
        function event1() { respuestaClick(0, indRespuestaCorrecta, respuesta1, respuesta1, respuesta2, respuesta3, respuesta4) };
        function event2() { respuestaClick(1, indRespuestaCorrecta, respuesta2, respuesta1, respuesta2, respuesta3, respuesta4) };
        function event3() { respuestaClick(2, indRespuestaCorrecta, respuesta3, respuesta1, respuesta2, respuesta3, respuesta4) };
        function event4() { respuestaClick(3, indRespuestaCorrecta, respuesta4, respuesta1, respuesta2, respuesta3, respuesta4) };

        
        respuesta1.addEventListener("click", (e) => {
            event1();

            var respuesta1Clone = respuesta1.cloneNode(true);
            respuestas.replaceChild(respuesta1Clone, respuesta1);

            var respuesta2Clone = respuesta2.cloneNode(true);
            respuestas.replaceChild(respuesta2Clone, respuesta2);

            var respuesta3Clone = respuesta3.cloneNode(true);
            respuestas.replaceChild(respuesta3Clone, respuesta3);

            var respuesta4Clone = respuesta4.cloneNode(true);
            respuestas.replaceChild(respuesta4Clone, respuesta4);

            boton.style.display = "block";
        });

        respuesta2.addEventListener("click", (e) => {
            event2();

            var respuesta1Clone = respuesta1.cloneNode(true);
            respuestas.replaceChild(respuesta1Clone, respuesta1);

            var respuesta2Clone = respuesta2.cloneNode(true);
            respuestas.replaceChild(respuesta2Clone, respuesta2);

            var respuesta3Clone = respuesta3.cloneNode(true);
            respuestas.replaceChild(respuesta3Clone, respuesta3);

            var respuesta4Clone = respuesta4.cloneNode(true);
            respuestas.replaceChild(respuesta4Clone, respuesta4);

            boton.style.display = "block";
        });

        respuesta3.addEventListener("click", (e) => {
            event3();

            var respuesta1Clone = respuesta1.cloneNode(true);
            respuestas.replaceChild(respuesta1Clone, respuesta1);

            var respuesta2Clone = respuesta2.cloneNode(true);
            respuestas.replaceChild(respuesta2Clone, respuesta2);

            var respuesta3Clone = respuesta3.cloneNode(true);
            respuestas.replaceChild(respuesta3Clone, respuesta3);

            var respuesta4Clone = respuesta4.cloneNode(true);
            respuestas.replaceChild(respuesta4Clone, respuesta4);

            boton.style.display = "block";
        });

        respuesta4.addEventListener("click", (e) => {
            event4();

            var respuesta1Clone = respuesta1.cloneNode(true);
            respuestas.replaceChild(respuesta1Clone, respuesta1);

            var respuesta2Clone = respuesta2.cloneNode(true);
            respuestas.replaceChild(respuesta2Clone, respuesta2);

            var respuesta3Clone = respuesta3.cloneNode(true);
            respuestas.replaceChild(respuesta3Clone, respuesta3);

            var respuesta4Clone = respuesta4.cloneNode(true);
            respuestas.replaceChild(respuesta4Clone, respuesta4);

            boton.style.display = "block";
        });

    }
    else {
        pregunta.style.display = 'none';
        respuestas.style.display = 'none';
        console.log("Has acertado " + String(nAciertos) + " caracteres de " + String(lista_micoleccion.length))
        nRespondidas.textContent = "Has acertado " + String(nAciertos) + " de " + String(lista_micoleccion.length) + " caracteres"
        nRespondidas.setAttribute("style",'margin-top: 50px; margin-left:10px; color:black');
        boton2.style.display = 'block';

    }  
}

function respuestaClick(respuestaClickada, respuestaCorrecta, respuestaNumeroClickada, respuestaNumero1, respuestaNumero2, respuestaNumero3, respuestaNumero4) {
    if (respuestaClickada == respuestaCorrecta) {
        nAciertos++;
        respuestaNumeroClickada.style.background = 'lightgreen';
    } else {
        respuestaNumeroClickada.style.background = 'indianred';

        switch(respuestaCorrecta) {
            case 0:
                console.log('respuesta0')
                respuestaNumero1.style.background = 'lightgreen';
                break;
            case 1:
                console.log('respuesta1')
                respuestaNumero2.style.background = 'lightgreen';
                break;
            case 2:
                console.log('respuesta2')
                respuestaNumero3.style.background = 'lightgreen';
                break;
            case 3:
                console.log('respuesta3')
                respuestaNumero4.style.background = 'lightgreen'
                break;
        }
    }
}

function escogeTresRespuestasFalsas(respuestaCorrecta, tipo) {
    var listaRespuestas = []
    switch (tipo) {
        case 'N5': 
            var respuestaFalsa1 = N5[Math.floor(Math.random()*N5.length)];
            var respuestaFalsa2 = N5[Math.floor(Math.random()*N5.length)];
            var respuestaFalsa3 = N5[Math.floor(Math.random()*N5.length)];
            listaRespuestas.push(respuestaCorrecta);
            listaRespuestas.push(respuestaFalsa1);
            listaRespuestas.push(respuestaFalsa2);
            listaRespuestas.push(respuestaFalsa3);
            if (!hasDuplicates(listaRespuestas)) {
                shuffleArray(listaRespuestas);
                console.log(listaRespuestas);
                return listaRespuestas;

            } else {
                return escogeTresRespuestasFalsas(respuestaCorrecta, tipo);
            }
            break;
        case 'N4':
            var respuestaFalsa1 = N4[Math.floor(Math.random()*N4.length)];
            var respuestaFalsa2 = N4[Math.floor(Math.random()*N4.length)];
            var respuestaFalsa3 = N4[Math.floor(Math.random()*N4.length)];
            listaRespuestas.push(respuestaCorrecta);
            listaRespuestas.push(respuestaFalsa1);
            listaRespuestas.push(respuestaFalsa2);
            listaRespuestas.push(respuestaFalsa3);
            if (!hasDuplicates(listaRespuestas)) {
                shuffleArray(listaRespuestas);
                return listaRespuestas;

            } else {
               return escogeTresRespuestasFalsas(respuestaCorrecta, tipo);
            }
            break;
        case 'N3':
            var respuestaFalsa1 = N3[Math.floor(Math.random()*N3.length)];
            var respuestaFalsa2 = N3[Math.floor(Math.random()*N3.length)];
            var respuestaFalsa3 = N3[Math.floor(Math.random()*N3.length)];
            listaRespuestas.push(respuestaCorrecta);
            listaRespuestas.push(respuestaFalsa1);
            listaRespuestas.push(respuestaFalsa2);
            listaRespuestas.push(respuestaFalsa3);
            if (!hasDuplicates(listaRespuestas)) {
                shuffleArray(listaRespuestas);
                return listaRespuestas;

            } else {
               return escogeTresRespuestasFalsas(respuestaCorrecta, tipo);
            }
            break;
        case 'N2':
            var respuestaFalsa1 = N2[Math.floor(Math.random()*N2.length)];
            var respuestaFalsa2 = N2[Math.floor(Math.random()*N2.length)];
            var respuestaFalsa3 = N2[Math.floor(Math.random()*N2.length)];
            listaRespuestas.push(respuestaCorrecta);
            listaRespuestas.push(respuestaFalsa1);
            listaRespuestas.push(respuestaFalsa2);
            listaRespuestas.push(respuestaFalsa3);
            if (!hasDuplicates(listaRespuestas)) {
                shuffleArray(listaRespuestas);
                return listaRespuestas;

            } else {
               return escogeTresRespuestasFalsas(respuestaCorrecta, tipo);
            }
            break;
        case 'N1':
            var respuestaFalsa1 = N1[Math.floor(Math.random()*N1.length)];
            var respuestaFalsa2 = N1[Math.floor(Math.random()*N1.length)];
            var respuestaFalsa3 = N1[Math.floor(Math.random()*N1.length)];
            listaRespuestas.push(respuestaCorrecta);
            listaRespuestas.push(respuestaFalsa1);
            listaRespuestas.push(respuestaFalsa2);
            listaRespuestas.push(respuestaFalsa3);
            if (!hasDuplicates(listaRespuestas)) {
                shuffleArray(listaRespuestas);
                return listaRespuestas;

            } else {
               return escogeTresRespuestasFalsas(respuestaCorrecta, tipo);
            }
            break;
        case 'Kana':
            var respuestaFalsa1 = Kana[Math.floor(Math.random()*Kana.length)];
            var respuestaFalsa2 = Kana[Math.floor(Math.random()*Kana.length)];
            var respuestaFalsa3 = Kana[Math.floor(Math.random()*Kana.length)];
            listaRespuestas.push(respuestaCorrecta);
            listaRespuestas.push(respuestaFalsa1);
            listaRespuestas.push(respuestaFalsa2);
            listaRespuestas.push(respuestaFalsa3);
            if (!hasDuplicates(listaRespuestas)) {
                shuffleArray(listaRespuestas);
                return listaRespuestas;

            } else {
              return escogeTresRespuestasFalsas(respuestaCorrecta, tipo);
            }
            break;
    }
}

function hasDuplicates(array) {
    var array2 = [];
    for (let i; i < array.length; i++) {
        array2.push(array[i].toLowerCase());
    }
    return (new Set(array2)).size !== array2.length;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function juntarArrayString(lista) {
    for (let i = 0; i < lista.length; i++) {
        lista[i] = lista[i].slice(0,3);
        lista[i] = lista[i].join(', ')
    }
    return lista;
}