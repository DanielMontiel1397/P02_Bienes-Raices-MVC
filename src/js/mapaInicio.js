
(function(){
    const lat = 20.67444163271174;
    const lng = -103.38739216304566;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 16);

    let markers = new L.FeatureGroup().addTo(mapa);

    let propiedades = {};
    
    const categoriasSelect = document.querySelector('#categorias');
    const preciosSelect = document.querySelector('#precios')

    //Filtros
    const filtros = {
        categoria: '',
        precio: ''
    }


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //Filtrado de Categorias y eventos
    categoriasSelect.addEventListener('change', e => {
        filtros.categoria = +e.target.value
        filtrarPropiedades()
    })

    preciosSelect.addEventListener('change', e => {
        filtros.precio = +e.target.value
        filtrarPropiedades()
    })
    
    //Consumir api de propiedades
    
    const obtenerPropiedades = async () => {
        try {
            
            const url = '/api/propiedades';

            const respuesta = await fetch(url);
            propiedades = await respuesta.json()

            mostrarPropiedades(propiedades)

        } catch(error){
            console.log(error)
        }
    }

    const mostrarPropiedades = propiedades => {
        
        //Limpiar los markers previos
        markers.clearLayers()

        propiedades.forEach(propiedad => {
            //Agregar pines
            const marker = new L.marker([propiedad?.lat,propiedad?.lng],{
                autoPan: true
            })
            .addTo(mapa)
            .bindPopup(`
                <p class="text-indigo-600 font-bold"<${propiedad.categoria.categoriaPropiedad}</p>
                <h1 class="text-xl font-extrabold uppercase my-2">${propiedad?.tituloPropiedad}</h1>
                <img src="/uploads/${propiedad?.imagen}" alt="Imagen de la propiedad: ${propiedad?.tituloPropiedad}">
                <p class="text-gray-600 font-bold">${propiedad.precio.precioPropiedad}</p>
                <a href="/propiedades/propiedad/${propiedad.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase">Ver Propiedad</a>
            `)

            markers.addLayer(marker)
        })

    }

    const filtrarPropiedades = () => {
        const resultado = propiedades.filter(filtrarCategoria).filter(filtrarPrecio)
        mostrarPropiedades(resultado)
    }

    const filtrarCategoria = propiedad => {
        return filtros.categoria ? propiedad.llaveForaneaCategoria === filtros.categoria : propiedad
    }

    const filtrarPrecio = propiedad => {
        return filtros.precio ? propiedad.llaveForaneaPrecio === filtros.precio : propiedad
    }

    obtenerPropiedades()

})()