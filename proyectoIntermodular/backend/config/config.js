module.exports = {
  port: process.env.PORT || 3000,
  db: {
    host:  process.env.DB_HOST || "localhost",
    user:  process.env.DB_USER || "proyectointermodular",
    password: process.env.DB_PASSWORD || "proyectointermodular",
    name: process.env.DB_NAME || "proyectointermodular",
    port: process.env.DB_PORT || 3306,
  }
};
