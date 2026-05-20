-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: proyectointermodular
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comentario`
--

DROP TABLE IF EXISTS `comentario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comentario` (
  `idusuario` int NOT NULL,
  `idrespuesta` int DEFAULT NULL,
  `idobra` int NOT NULL,
  `idcomentario` int NOT NULL AUTO_INCREMENT,
  `fechapublicacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `texto` varchar(350) NOT NULL,
  `likes` int DEFAULT '0',
  PRIMARY KEY (`idcomentario`),
  KEY `usuariofk_idx` (`idusuario`),
  KEY `respuestafk_idx` (`idrespuesta`),
  KEY `obracomentariofk_idx` (`idobra`),
  CONSTRAINT `obracomentariofk` FOREIGN KEY (`idobra`) REFERENCES `obra` (`idobra`) ON DELETE CASCADE,
  CONSTRAINT `respuestafk` FOREIGN KEY (`idrespuesta`) REFERENCES `comentario` (`idcomentario`) ON DELETE CASCADE,
  CONSTRAINT `usuariocomentariofk` FOREIGN KEY (`idusuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `likescomentario`
--

DROP TABLE IF EXISTS `likescomentario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likescomentario` (
  `idUsuario` int NOT NULL,
  `idComentario` int NOT NULL,
  `leDioLike` tinyint NOT NULL,
  PRIMARY KEY (`idUsuario`,`idComentario`),
  KEY `comentarioFk_idx` (`idComentario`),
  CONSTRAINT `comentarioLikesFk` FOREIGN KEY (`idComentario`) REFERENCES `comentario` (`idcomentario`) ON DELETE CASCADE,
  CONSTRAINT `usuarioLikesFk` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lista`
--

DROP TABLE IF EXISTS `lista`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lista` (
  `idlista` int NOT NULL AUTO_INCREMENT,
  `idusuario` int NOT NULL,
  `nombrelista` varchar(45) NOT NULL,
  PRIMARY KEY (`idlista`),
  UNIQUE KEY `unique_lista_usuario_nombre` (`idusuario`,`nombrelista`),
  KEY `usuariolistafk_idx` (`idusuario`),
  CONSTRAINT `usuariolistafk` FOREIGN KEY (`idusuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `listaobra`
--

DROP TABLE IF EXISTS `listaobra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listaobra` (
  `idlista` int NOT NULL,
  `idobra` int NOT NULL,
  `fechaadicion` date DEFAULT (curdate()),
  PRIMARY KEY (`idlista`,`idobra`),
  KEY `obrafk_idx` (`idobra`),
  CONSTRAINT `listafk` FOREIGN KEY (`idlista`) REFERENCES `lista` (`idlista`) ON DELETE CASCADE,
  CONSTRAINT `obrafk` FOREIGN KEY (`idobra`) REFERENCES `obra` (`idobra`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `obra`
--

DROP TABLE IF EXISTS `obra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obra` (
  `idobra` int NOT NULL AUTO_INCREMENT,
  `tipo` enum('anime','manga') NOT NULL,
  `titulo` varchar(1000) NOT NULL,
  `sinopsis` varchar(2000) DEFAULT NULL,
  `genero` varchar(100) NOT NULL,
  `fechalanzamiento` date DEFAULT NULL,
  `estudio` varchar(200) DEFAULT NULL,
  `autor` varchar(200) DEFAULT NULL,
  `estado` enum('cancelado','finalizado','en emision','proximamente','pausado','eliminada') NOT NULL,
  `portada` mediumblob NOT NULL,
  `idApi` int DEFAULT NULL,
  `popularidad` int DEFAULT NULL,
  `puntuacion` decimal(4,2) DEFAULT NULL,
  `trailer` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`idobra`),
  UNIQUE KEY `idApi_UNIQUE` (`idApi`)
) ENGINE=InnoDB AUTO_INCREMENT=221 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;



--
-- Table structure for table `obra_traducciones`
--

DROP TABLE IF EXISTS `obra_traducciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obra_traducciones` (
  `id_traduccion` int NOT NULL AUTO_INCREMENT,
  `obra_id` int NOT NULL,
  `idioma` varchar(45) DEFAULT NULL,
  `titulo` varchar(1000) NOT NULL,
  PRIMARY KEY (`id_traduccion`,`obra_id`),
  KEY `traduccion_fk_idx` (`obra_id`),
  CONSTRAINT `traduccion_fk` FOREIGN KEY (`obra_id`) REFERENCES `obra` (`idobra`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=515 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `puntua`
--

DROP TABLE IF EXISTS `puntua`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `puntua` (
  `idusuario` int NOT NULL,
  `idobra` int NOT NULL,
  `puntuacion` decimal(2,1) DEFAULT '0.0',
  PRIMARY KEY (`idusuario`,`idobra`),
  KEY `obrapuntuafk_idx` (`idobra`),
  CONSTRAINT `obrapuntuafk` FOREIGN KEY (`idobra`) REFERENCES `obra` (`idobra`) ON DELETE CASCADE,
  CONSTRAINT `usuariofk` FOREIGN KEY (`idusuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `email` varchar(90) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `contraseña` varchar(90) NOT NULL,
  `img_perfil` longblob,
  `biografia` varchar(200) DEFAULT NULL,
  `puntuacionquiz` int NOT NULL DEFAULT '0',
  `rol` enum('cliente','administrador') NOT NULL DEFAULT 'cliente',
  `bloqueado` tinyint DEFAULT '0',
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `Email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-05 14:12:35
