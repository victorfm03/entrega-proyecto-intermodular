const config=require("./config/config");

const express=require("express");
const usuarioRoutes=require("./routes/usuarioRoutes");

const obraRoutes=require("./routes/obraRoutes");

const comentarioRoutes=require("./routes/comentarioRoutes");

const listaRoutes=require("./routes/listaRoutes");

const listaObraRoutes=require("./routes/listaObraRoutes");

const puntuaRoutes=require("./routes/puntuaRoutes");


const cors=require("cors");

const app=express();

app.use(express.json({ limit: '50MB' }));
app.use(express.urlencoded({ limit: '50MB', extended: true }));


app.use(cors());

app.use("/api/usuario",usuarioRoutes);

app.use("/api/obra",obraRoutes);
app.use("/api/comentario",comentarioRoutes);

app.use("/api/lista",listaRoutes);

app.use("/api/listaobra",listaObraRoutes);

app.use("/api/puntua",puntuaRoutes);


app.listen(config.port, () => console.log("Servidor corriendo en http://localhost:" + config.port));