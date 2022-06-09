import { filtrar_noken, addFlashcard } from './create_flashcard_noken.js';

const url = 'https://kanjiapi.dev/v1/kanji/'

fetch('kanjis.json')
.then(response => response.json())
.then(data => {
    var permitidos = filtrar_noken(data, 3);
    for (let i = 0; i < permitidos.length; i++) {
      var apiurl = url + permitidos[i];
      fetch(apiurl).then(response => response.json())
      .then(data2 => {
        var kanji = data2.kanji;

        
        var respuestas = data2.meanings;
        respuestas = respuestas.slice(0,3);
        var respuesta = "";
        for (let j = 0; j < respuestas.length; j++) {
          respuesta += respuestas[j]
          if (j < respuestas.length-1) {
            respuesta += ", ";
          }
        }

        var lecturas_kun = data2.kun_readings;
        lecturas_kun = lecturas_kun.slice(0, 4);
        var lectura_kun = ""
        for (let j = 0; j < lecturas_kun.length; j++) {
          lectura_kun += lecturas_kun[j]
          if (j < lecturas_kun.length-1) {
            lectura_kun += ", ";
          }
        }

        var lecturas_on = data2.on_readings;
        lecturas_on = lecturas_on.slice(0, 4);
        var lectura_on = ""
        for (let j = 0; j < lecturas_on.length; j++) {
          lectura_on += lecturas_on[j]
          if (j < lecturas_on.length-1) {
            lectura_on += ", ";
          }
        }

        addFlashcard(kanji, respuesta, lectura_on, lectura_kun, 'N3');

      })
    .catch(err=>console.log(err))
    }
})
.catch(err=>console.log(err))