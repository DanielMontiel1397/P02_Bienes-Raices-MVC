import {Dropzone} from 'dropzone'
import { param } from 'express-validator';

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');


Dropzone.options.imagen = {
    dictDefaultMessage: "Sube tus imágenes Aquí", //Cambiar el mensaje que queramos que diga
    acceptedFiles: ".png, .jpg, .jpeg", //Tipos de archivos que acepta
    maxFilesize: 5, //Maximo tamaño en MB
    maxFiles: 1, //Número máximo de archivos
    parallelUploads: 1, //Número de archivos al cargar al mismo tiempo
    autoProcessQueue: false, //Cuando arrastramos una imagen es tratar de subirlo en automatico, pero queremos que se suba al presionar el boton,
    addRemoveLinks: true, //Nos agrega un link para eliminar la imagen
    dictRemoveFile: "Borrar Archivo", //Cambiar lo que dirá para eliminar imagen
    dictMaxFilesExceeded: "El limite es un archivo",
    headers: {
        'CSRF-Token':token
    },
    paramName: 'imagen',
    init: function(){
        const dropzone = this;
        const btnPublicar = document.querySelector('#publicar');

        btnPublicar.addEventListener('click',function(){
            dropzone.processQueue();
        })

        dropzone.on('queuecomplete',function(){
            if(dropzone.getActiveFiles().length == 0){
                window.location.href = "/propiedades/mis-propiedades"
            }
        })
    }
}