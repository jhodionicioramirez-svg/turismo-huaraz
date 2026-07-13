/*=========================================================
=            CONFIGURACIÓN GENERAL
=========================================================*/

const URL_SERVIDOR = "http://localhost:3000";

let graficoP1 = null;
let graficoP2 = null;
let graficoP3 = null;
let graficoP4 = null;
let graficoP5 = null;
let graficoP6 = null;
let graficoP11 = null;
let graficoP12 = null;
let graficoP13 = null;
let graficoCruceFactores = null;
let graficoCrucePremium = null;


/*=========================================================
=            FUNCIONES AUXILIARES
=========================================================*/

function porcentaje(total, cantidad){

    if(total===0){

        return "0.00";

    }

    return ((cantidad*100)/total).toFixed(2);

}


function destruirGrafico(grafico){

    if(grafico){

        grafico.destroy();

    }

}


/*=========================================================
=            CARGA INICIAL
=========================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    cargarDashboard();

});


/*=========================================================
=            ENVÍO DEL FORMULARIO
=========================================================*/

const formulario=document.getElementById("surveyForm");

formulario.addEventListener("submit",async(e)=>{

    e.preventDefault();

    const datos={

        p1:document.querySelector('input[name="p1"]:checked').value,

        p2:document.getElementById("p2").value,

        p3:document.querySelector('input[name="p3"]:checked').value,

        p4:document.querySelector('input[name="p4"]:checked').value,

        p5:document.querySelector('input[name="p5"]:checked').value,

        p6:document.querySelector('input[name="p6"]:checked').value,

        p7:document.querySelector('input[name="p7"]:checked').value,

        p8:document.querySelector('input[name="p8"]:checked').value,

        p9:document.querySelector('input[name="p9"]:checked').value,

        p10:document.querySelector('input[name="p10"]:checked').value,

        p11:document.querySelector('input[name="p11"]:checked').value,

        p12:document.querySelector('input[name="p12"]:checked').value,

        p13:document.querySelector('input[name="p13"]:checked').value

    };

    try{

        const respuesta=await fetch(`${URL_SERVIDOR}/api/encuestas`,{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(datos)

        });

        const resultado=await respuesta.json();

        alert(resultado.mensaje);

        formulario.reset();

        cargarDashboard();

    }

    catch(error){

        console.error(error);

        alert("Ocurrió un error al guardar la encuesta.");

    }

});
/*=========================================================
=            CARGAR DASHBOARD
=========================================================*/

async function cargarDashboard(){

    try{

        const respuesta=await fetch(`${URL_SERVIDOR}/api/dashboard-unasam`);

        const datos=await respuesta.json();

        if(datos.vacio){

            return;

        }

        actualizarResumen(datos);

        cargarPregunta1(datos);

        cargarPregunta2(datos);

        cargarPregunta3(datos);

        cargarPregunta4(datos);

        cargarPregunta5(datos);

        cargarPregunta6(datos);

        cargarLikert(datos);

        cargarPregunta11(datos);

        cargarPregunta12(datos);

        cargarPregunta13(datos);

        cargarCruceFactores(datos);

        cargarCrucePremium(datos);

    }

    catch(error){

        console.error(error);

    }

}


/*=========================================================
=            TARJETAS SUPERIORES
=========================================================*/

function actualizarResumen(datos){

    document.getElementById("totalEncuestas").textContent=
        datos.totalEncuestas;

    const nacionales=datos.procedencia.find(
        x=>x.item==="Peruano (Nacional)"
    );

    const extranjeros=datos.procedencia.find(
        x=>x.item==="Extranjero"
    );

    document.getElementById("totalNacionales").textContent=
        nacionales ? nacionales.total : 0;

    document.getElementById("totalExtranjeros").textContent=
        extranjeros ? extranjeros.total : 0;

    document.getElementById("edadPromedio").textContent=
        datos.edadPromedio;

}
/*=========================================================
=            PREGUNTA 1
=========================================================*/

function cargarPregunta1(datos){

    const tbody=document.getElementById("tP1");

    tbody.innerHTML="";

    datos.p1.forEach(item=>{

        tbody.innerHTML+=`
        <tr>
            <td>${item.item}</td>
            <td>${item.total}</td>
            <td>${porcentaje(datos.totalEncuestas,item.total)}%</td>
        </tr>`;
    });

    destruirGrafico(graficoP1);

    graficoP1=new Chart(document.getElementById("f1"),{

        type:"pie",

        data:{

            labels:datos.p1.map(x=>x.item),

            datasets:[{

                data:datos.p1.map(x=>x.total)

            }]

        },

        options:{

            responsive:true

        }

    });

}


/*=========================================================
=            PREGUNTA 2
=========================================================*/

function cargarPregunta2(datos){

    const tbody=document.getElementById("tEdad");

    tbody.innerHTML="";

    datos.edades.forEach(item=>{

        tbody.innerHTML+=`
        <tr>
            <td>${item.item}</td>
            <td>${item.total}</td>
            <td>${porcentaje(datos.totalEncuestas,item.total)}%</td>
        </tr>`;

    });

    destruirGrafico(graficoP2);

    graficoP2=new Chart(document.getElementById("f2"),{

        type:"bar",

        data:{

            labels:datos.edades.map(x=>x.item),

            datasets:[{

                label:"Frecuencia",

                data:datos.edades.map(x=>x.total)

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    display:false

                }

            }

        }

    });

}


/*=========================================================
=            PREGUNTA 3
=========================================================*/

function cargarPregunta3(datos){

    const tbody=document.getElementById("tGenero");

    tbody.innerHTML="";

    datos.genero.forEach(item=>{

        tbody.innerHTML+=`
        <tr>
            <td>${item.item}</td>
            <td>${item.total}</td>
            <td>${porcentaje(datos.totalEncuestas,item.total)}%</td>
        </tr>`;

    });

    destruirGrafico(graficoP3);

    graficoP3=new Chart(document.getElementById("f3"),{

        type:"doughnut",

        data:{

            labels:datos.genero.map(x=>x.item),

            datasets:[{

                data:datos.genero.map(x=>x.total)

            }]

        },

        options:{

            responsive:true

        }

    });

}
/*=========================================================
=            PREGUNTA 4
=========================================================*/

function cargarPregunta4(datos){

    const tbody=document.getElementById("tProcedencia");

    tbody.innerHTML="";

    datos.procedencia.forEach(item=>{

        tbody.innerHTML+=`
        <tr>
            <td>${item.item}</td>
            <td>${item.total}</td>
            <td>${porcentaje(datos.totalEncuestas,item.total)}%</td>
        </tr>`;

    });

    destruirGrafico(graficoP4);

    graficoP4=new Chart(document.getElementById("f4"),{

        type:"pie",

        data:{

            labels:datos.procedencia.map(x=>x.item),

            datasets:[{

                data:datos.procedencia.map(x=>x.total)

            }]

        },

        options:{

            responsive:true

        }

    });

}


/*=========================================================
=            PREGUNTA 5
=========================================================*/

function cargarPregunta5(datos){

    const tbody=document.getElementById("tFactor");

    tbody.innerHTML="";

    datos.factor.forEach(item=>{

        tbody.innerHTML+=`
        <tr>
            <td>${item.item}</td>
            <td>${item.total}</td>
            <td>${porcentaje(datos.totalEncuestas,item.total)}%</td>
        </tr>`;

    });

    destruirGrafico(graficoP5);

    graficoP5=new Chart(document.getElementById("f5"),{

        type:"bar",

        data:{

            labels:datos.factor.map(x=>x.item),

            datasets:[{

                label:"Frecuencia",

                data:datos.factor.map(x=>x.total)

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    display:false

                }

            }

        }

    });

}


/*=========================================================
=            PREGUNTA 6
=========================================================*/

function cargarPregunta6(datos){

    const tbody=document.getElementById("tMedios");

    tbody.innerHTML="";

    datos.medios.forEach(item=>{

        tbody.innerHTML+=`
        <tr>
            <td>${item.item}</td>
            <td>${item.total}</td>
            <td>${porcentaje(datos.totalEncuestas,item.total)}%</td>
        </tr>`;

    });

    destruirGrafico(graficoP6);

    graficoP6=new Chart(document.getElementById("f6"),{

        type:"bar",

        data:{

            labels:datos.medios.map(x=>x.item),

            datasets:[{

                label:"Frecuencia",

                data:datos.medios.map(x=>x.total)

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    display:false

                }

            }

        }

    });

}
/*=========================================================
=            PREGUNTAS 7, 8, 9 Y 10 (LIKERT)
=========================================================*/

function cargarLikert(datos){

    const tbody=document.getElementById("tLikert");

    tbody.innerHTML="";

    const preguntas=[

        {nombre:"Pregunta 7",datos:datos.likert.p7},

        {nombre:"Pregunta 8",datos:datos.likert.p8},

        {nombre:"Pregunta 9",datos:datos.likert.p9},

        {nombre:"Pregunta 10",datos:datos.likert.p10}

    ];

    preguntas.forEach(p=>{

        tbody.innerHTML+=`

        <tr>

            <td>${p.nombre}</td>

            <td>${p.datos[0].total}</td>

            <td>${p.datos[1].total}</td>

            <td>${p.datos[2].total}</td>

            <td>${p.datos[3].total}</td>

            <td>${p.datos[4].total}</td>

        </tr>

        `;

    });

}


/*=========================================================
=            PREGUNTA 11
=========================================================*/

function cargarPregunta11(datos){

    const tbody=document.getElementById("tPremium");

    tbody.innerHTML="";

    datos.premium.forEach(item=>{

        tbody.innerHTML+=`

        <tr>

            <td>${item.item}</td>

            <td>${item.total}</td>

            <td>${porcentaje(datos.totalEncuestas,item.total)}%</td>

        </tr>

        `;

    });

    destruirGrafico(graficoP11);

    graficoP11=new Chart(document.getElementById("f11"),{

        type:"pie",

        data:{

            labels:datos.premium.map(x=>x.item),

            datasets:[{

                data:datos.premium.map(x=>x.total)

            }]

        },

        options:{

            responsive:true

        }

    });

}
/*=========================================================
=            PREGUNTA 12
=========================================================*/

function cargarPregunta12(datos){

    const tbody=document.getElementById("tMontoExtra");

    tbody.innerHTML="";

    datos.montoExtra.forEach(item=>{

        tbody.innerHTML+=`

        <tr>

            <td>${item.item}</td>

            <td>${item.total}</td>

            <td>${porcentaje(datos.totalEncuestas,item.total)}%</td>

        </tr>

        `;

    });

    destruirGrafico(graficoP12);

    graficoP12=new Chart(document.getElementById("f12"),{

        type:"bar",

        data:{

            labels:datos.montoExtra.map(x=>x.item),

            datasets:[{

                label:"Frecuencia",

                data:datos.montoExtra.map(x=>x.total)

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    display:false

                }

            }

        }

    });

}


/*=========================================================
=            PREGUNTA 13
=========================================================*/

function cargarPregunta13(datos){

    const tbody=document.getElementById("tRecomendar");

    tbody.innerHTML="";

    datos.recomendar.forEach(item=>{

        tbody.innerHTML+=`

        <tr>

            <td>${item.item}</td>

            <td>${item.total}</td>

            <td>${porcentaje(datos.totalEncuestas,item.total)}%</td>

        </tr>

        `;

    });

    destruirGrafico(graficoP13);

    graficoP13=new Chart(document.getElementById("f10"),{

        type:"pie",

        data:{

            labels:datos.recomendar.map(x=>x.item),

            datasets:[{

                data:datos.recomendar.map(x=>x.total)

            }]

        },

        options:{

            responsive:true

        }

    });

}
/*=========================================================
=            CRUCE P5 vs P4
=========================================================*/

function cargarCruceFactores(datos){

    const tbody=document.getElementById("tCruceFactores");

    tbody.innerHTML="";

    datos.cruceFactores.forEach(item=>{

        const total=item.nac+item.ext;

        tbody.innerHTML+=`

        <tr>

            <td>${item.item}</td>

            <td>${item.nac}</td>

            <td>${item.ext}</td>

            <td>${total}</td>

        </tr>

        `;

    });

    destruirGrafico(graficoCruceFactores);

    graficoCruceFactores=new Chart(document.getElementById("f8"),{

        type:"bar",

        data:{

            labels:datos.cruceFactores.map(x=>x.item),

            datasets:[

                {

                    label:"Nacionales",

                    data:datos.cruceFactores.map(x=>x.nac)

                },

                {

                    label:"Extranjeros",

                    data:datos.cruceFactores.map(x=>x.ext)

                }

            ]

        },

        options:{

            responsive:true

        }

    });

}


/*=========================================================
=            CRUCE P11 vs P4
=========================================================*/

function cargarCrucePremium(datos){

    const tbody=document.getElementById("tCrucePremium");

    tbody.innerHTML="";

    datos.crucePremium.forEach(item=>{

        const total=item.nac+item.ext;

        tbody.innerHTML+=`

        <tr>

            <td>${item.item}</td>

            <td>${item.nac}</td>

            <td>${item.ext}</td>

            <td>${total}</td>

        </tr>

        `;

    });

    destruirGrafico(graficoCrucePremium);

    graficoCrucePremium=new Chart(document.getElementById("f9"),{

        type:"bar",

        data:{

            labels:datos.crucePremium.map(x=>x.item),

            datasets:[

                {

                    label:"Nacionales",

                    data:datos.crucePremium.map(x=>x.nac)

                },

                {

                    label:"Extranjeros",

                    data:datos.crucePremium.map(x=>x.ext)

                }

            ]

        },

        options:{

            responsive:true

        }

    });

}