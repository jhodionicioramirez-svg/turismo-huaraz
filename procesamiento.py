import json
import pandas as pd
import psycopg2
import sys

sys.stdout.reconfigure(encoding="utf-8")


def generar_reporte_estadistico():

    try:

        # ==========================================================
        # CONEXIÓN A POSTGRESQL
        # ==========================================================

        conn = psycopg2.connect(

            host="localhost",

            database="turismo_huaraz",

            user="postgres",

            password="1234",

            port=5432

        )

        query = "SELECT * FROM encuestas;"

        df = pd.read_sql_query(query, conn)

        conn.close()

        # ==========================================================
        # VALIDACIÓN
        # ==========================================================

        if df.empty:

            print(json.dumps({"vacio": True}))

            return

        total = len(df)

        edadPromedio = round(df["p2_edad"].mean(), 2)
                # ==========================================================
        # PREGUNTA 1
        # ==========================================================

        p1 = []

        conteo = df["p1_filtro_aventura"].value_counts()

        for respuesta, total_respuestas in conteo.items():

            p1.append({

                "item": str(respuesta),

                "total": int(total_respuestas)

            })


        # ==========================================================
        # PREGUNTA 2
        # ==========================================================

        bins = [0, 25, 35, 45, 100]

        labels = [

            "18-25 años",

            "26-35 años",

            "36-45 años",

            "Más de 45 años"

        ]

        df["rango_edad"] = pd.cut(

            df["p2_edad"],

            bins=bins,

            labels=labels,

            right=True

        )

        edades = []

        conteo = df["rango_edad"].value_counts()

        for etiqueta in labels:

            edades.append({

                "item": etiqueta,

                "total": int(conteo.get(etiqueta, 0))

            })


        # ==========================================================
        # PREGUNTA 3
        # ==========================================================

        genero = []

        conteo = df["p3_genero"].value_counts()

        for respuesta, total_respuestas in conteo.items():

            genero.append({

                "item": str(respuesta),

                "total": int(total_respuestas)

            })


        # ==========================================================
        # PREGUNTA 4
        # ==========================================================

        procedencia = []

        conteo = df["p4_nacionalidad"].value_counts()

        for respuesta, total_respuestas in conteo.items():

            procedencia.append({

                "item": str(respuesta),

                "total": int(total_respuestas)

            })
                    # ==========================================================
        # PREGUNTA 5
        # ==========================================================

        factor = []

        conteo = df["p5_factor_importante"].value_counts()

        for respuesta, total_respuestas in conteo.items():

            factor.append({

                "item": str(respuesta),

                "total": int(total_respuestas)

            })


        # ==========================================================
        # PREGUNTA 6
        # ==========================================================

        medios = []

        conteo = df["p6_medio_informacion"].value_counts()

        for respuesta, total_respuestas in conteo.items():

            medios.append({

                "item": str(respuesta),

                "total": int(total_respuestas)

            })


        # ==========================================================
        # PREGUNTAS 7, 8, 9 Y 10 (LIKERT)
        # ==========================================================

        columnas = {

            "p7": "p7_likert_cero_residuos",

            "p8": "p8_likert_pago_justo",

            "p9": "p9_likert_certificaciones",

            "p10": "p10_likert_equipos_eco"

        }

        likert = {}

        for clave, columna in columnas.items():

            conteo = df[columna].value_counts().to_dict()

            niveles = []

            for nivel in range(1, 6):

                niveles.append({

                    "nivel": nivel,

                    "total": int(conteo.get(nivel, 0))

                })

            likert[clave] = niveles
                    # ==========================================================
        # PREGUNTA 11
        # ==========================================================

        premium = []

        conteo = df["p11_tarifa_premium"].value_counts()

        for respuesta, total_respuestas in conteo.items():

            premium.append({

                "item": str(respuesta),

                "total": int(total_respuestas)

            })


        # ==========================================================
        # PREGUNTA 12
        # ==========================================================

        montoExtra = []

        conteo = df["p12_monto_extra"].value_counts()

        for respuesta, total_respuestas in conteo.items():

            montoExtra.append({

                "item": str(respuesta),

                "total": int(total_respuestas)

            })


        # ==========================================================
        # PREGUNTA 13
        # ==========================================================

        recomendar = []

        conteo = df["p13_recomendar_redes"].value_counts()

        for respuesta, total_respuestas in conteo.items():

            recomendar.append({

                "item": str(respuesta),

                "total": int(total_respuestas)

            })


        # ==========================================================
        # CRUCE P5 vs P4
        # ==========================================================

        tabla = pd.crosstab(

            df["p5_factor_importante"],

            df["p4_nacionalidad"]

        )

        cruceFactores = []

        for indice, fila in tabla.iterrows():

            cruceFactores.append({

                "item": str(indice),

                "nac": int(fila.get("Peruano (Nacional)", 0)),

                "ext": int(fila.get("Extranjero", 0))

            })


        # ==========================================================
        # CRUCE P11 vs P4
        # ==========================================================

        tabla = pd.crosstab(

            df["p11_tarifa_premium"],

            df["p4_nacionalidad"]

        )

        crucePremium = []

        for indice, fila in tabla.iterrows():

            crucePremium.append({

                "item": str(indice),

                "nac": int(fila.get("Peruano (Nacional)", 0)),

                "ext": int(fila.get("Extranjero", 0))

            })


        # ==========================================================
        # JSON FINAL
        # ==========================================================

        resultado = {

            "vacio": False,

            "totalEncuestas": int(total),

            "edadPromedio": edadPromedio,

            "p1": p1,

            "edades": edades,

            "genero": genero,

            "procedencia": procedencia,

            "factor": factor,

            "medios": medios,

            "likert": likert,

            "premium": premium,

            "montoExtra": montoExtra,

            "recomendar": recomendar,

            "cruceFactores": cruceFactores,

            "crucePremium": crucePremium

        }

        print(

            json.dumps(

                resultado,

                ensure_ascii=False,

                indent=2

            )

        )

    except Exception as e:

        print(

            json.dumps(

                {

                    "vacio": True,

                    "error": str(e)

                },

                ensure_ascii=False,

                indent=2

            )

        )


if __name__ == "__main__":

    generar_reporte_estadistico()