// config/sequelize.js
const { Sequelize } = require("sequelize");
// Importar fichero de configuración con variables de entorno
const config = require("./config");

// Instanciar sequelize  para conectar a mysql
const sequelize = new Sequelize(
  config.db.name, // nombre bd
  config.db.user, // usuario
  config.db.password, // password
  {
    // objeto con opciones de conexion
    host: config.db.host, // Cambia esto por la dirección del servidor MySQL
    port: config.db.port, // Cambia esto por el puerto del servidor MySql
    dialect: "mysql", // Especificar el dialecto de la base de datos
    // logging: false, // Desactiva el logging de las consultas SQL
    logging: (msg) => {
      if (msg.includes("ERROR")) {
        console.error("Error de Sequelize:", msg);
      }
    },
  }
);

// Probar la conexión
(async () => {
  let connected = false;
  let attempts = 0;

  while (!connected && attempts < 10) {
    try {
      await sequelize.authenticate();
      console.log("✔ Conexión a la base de datos establecida");
      connected = true;
    } catch (error) {
      attempts++;
      console.log(`⏳ Intento ${attempts}/10 - esperando MySQL...`);

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  if (!connected) {
    console.error("❌ No se pudo conectar a MySQL");
  }
})();

module.exports = sequelize; // Exportar la instancia de Sequelize para usarla en otros archivos