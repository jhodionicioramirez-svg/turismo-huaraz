const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "1234",
    database: "turismo_huaraz",
    port: 5432
});

/*=========================================================
=            GUARDAR ENCUESTA EN POSTGRESQL               =
=========================================================*/

app.post("/api/encuestas", async (req, res) => {

    try {

        const {
            p1,
            p2,
            p3,
            p4,
            p5,
            p6,
            p7,
            p8,
            p9,
            p10,
            p11,
            p12,
            p13
        } = req.body;

        await pool.query(
            `INSERT INTO encuestas(
                p1_filtro_aventura,
                p2_edad,
                p3_genero,
                p4_nacionalidad,
                p5_factor_importante,
                p6_medio_informacion,
                p7_likert_cero_residuos,
                p8_likert_pago_justo,
                p9_likert_certificaciones,
                p10_likert_equipos_eco,
                p11_tarifa_premium,
                p12_monto_extra,
                p13_recomendar_redes
            )
            VALUES(
                $1,$2,$3,$4,$5,$6,
                $7,$8,$9,$10,
                $11,$12,$13
            )`,
            [
                p1,
                parseInt(p2),
                p3,
                p4,
                p5,
                p6,
                parseInt(p7),
                parseInt(p8),
                parseInt(p9),
                parseInt(p10),
                p11,
                p12,
                p13
            ]
        );

        res.status(201).json({
            ok: true,
            mensaje: "Encuesta guardada correctamente."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            error: error.message
        });

    }

});


/*=========================================================
=                 DASHBOARD ESTADÍSTICO                   =
=========================================================*/

app.get("/api/dashboard-unasam", (req, res) => {

    const script = path.join(__dirname, "procesamiento.py");

    exec(
        `python "${script}"`,
        {
            encoding: "utf8"
        },
        (error, stdout, stderr) => {

            if (error) {

                console.error(stderr);

                return res.status(500).json({
                    vacio: true,
                    error: error.message
                });

            }

            try {

                res.setHeader(
                    "Content-Type",
                    "application/json; charset=utf-8"
                );

                const datos = JSON.parse(stdout);

                res.json(datos);

            } catch (e) {

                console.error(e);

                console.log(stdout);

                res.status(500).json({
                    vacio: true,
                    error: "JSON inválido generado por Python."
                });

            }

        }
    );

});


/*=========================================================
=                 DEBUG DE TEXTO                          =
=========================================================*/

app.get("/api/debug-texto", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                p4_nacionalidad,
                p5_factor_importante,
                p6_medio_informacion,
                p12_monto_extra
            FROM encuestas
        `);

        res.setHeader(
            "Content-Type",
            "application/json; charset=utf-8"
        );

        res.json(result.rows);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


/*=========================================================
=                 PROBAR CONEXIÓN                         =
=========================================================*/

app.get("/api/test", async (req, res) => {

    try {

        const r = await pool.query("SELECT NOW()");

        res.json({
            ok: true,
            servidor: r.rows[0]
        });

    } catch (e) {

        res.status(500).json({
            ok: false,
            error: e.message
        });

    }

});


/*=========================================================
=                 INICIAR SERVIDOR                        =
=========================================================*/

app.listen(PORT, () => {

    console.log("");
    console.log("====================================");
    console.log("Servidor Node iniciado correctamente");
    console.log("Puerto :", PORT);
    console.log("Base de datos :", "turismo_huaraz");
    console.log("====================================");

});