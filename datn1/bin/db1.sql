-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: db1
-- ------------------------------------------------------
-- Server version	8.0.39
create database db1;
use db1


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
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) DEFAULT NULL,
  `Fullname` varchar(100) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Image` varchar(255) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Password` varchar(100) DEFAULT NULL,
  `Activated` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (1,'admin','giám đốc','john11@example.com','john.jpg','1234567890','$2a$10$fue.2Yh5RjbfMd1VAMO5LeOlZYPdLc1NUBInsN/wO7vZE2EAkv1yS',1),(2,'staff','Nhan vien','jane1@example.com','jane.jpg','0987654321','$2a$10$UHnEnJ/QK9ChuaDDTl4ZNe4PkCFM7PDUpiL.jMpj3qNxb3Uu22Qb.',1),(3,'user','người dùng','janeasassa@example.com','jane.jpg','0987654321','$2a$10$/ttYTCyWW7yt6xnJeJGepOiyvG.i1QWU5ZIKY/NUAMuVBZoTNLxPK',1),(15,'Đinh Hưng','Đinh Hưng','so5so6vaso9@gmail.com',NULL,NULL,NULL,1),(17,'Dinh Quoc Hung (FPL CT)','Dinh Quoc Hung (FPL CT)','hungdqpc06637@fpt.edu.vn',NULL,NULL,NULL,1),(19,'Nguyen Nhat Duy (FPL CT)','Nguyen Nhat Duy (FPL CT)','duynnpc06626@fpt.edu.vn',NULL,NULL,NULL,1);
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Province` varchar(100) DEFAULT NULL,
  `District` varchar(100) DEFAULT NULL,
  `Ward` varchar(100) DEFAULT NULL,
  `Note` varchar(255) DEFAULT NULL,
  `AccountID` int DEFAULT NULL,
  `Fullname` varchar(200) DEFAULT NULL,
  `Phone` int DEFAULT NULL,
  `isdefault` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY `FK_Address_Account` (`AccountID`),
  CONSTRAINT `FK_Address_Account` FOREIGN KEY (`AccountID`) REFERENCES `account` (`ID`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES (1,'Province A','District A','Ward A','Note A',1,'DINH QUOC HUNG',327247263,1),(2,'a','a','a','123',3,'1',1,0),(3,'Province B','District B','Ward B','Note B',2,'A',327247263,0),(7,'Cà Mau','Thới Bìnhhh','Trí phải','huyện sử',15,'ngan',32724562,1),(9,'Sóc Trăng','Mỹ tú','châu thành','123 lam lam',3,'kim ngân',359032559,0);
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authorities`
--

DROP TABLE IF EXISTS `authorities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authorities` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `AccountID` int DEFAULT NULL,
  `RoleID` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_Authorities_Account` (`AccountID`),
  KEY `FK_Authorities_Role` (`RoleID`),
  CONSTRAINT `FK_Authorities_Account` FOREIGN KEY (`AccountID`) REFERENCES `account` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_Authorities_Role` FOREIGN KEY (`RoleID`) REFERENCES `roles` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authorities`
--

LOCK TABLES `authorities` WRITE;
/*!40000 ALTER TABLE `authorities` DISABLE KEYS */;
INSERT INTO `authorities` VALUES (1,1,1),(2,2,2),(3,3,3),(46,15,3),(47,17,3),(48,19,3);
/*!40000 ALTER TABLE `authorities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Quantity` int DEFAULT NULL,
  `SizeID` int DEFAULT NULL,
  `AccountID` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_Carts_Account` (`AccountID`),
  KEY `FK_Carts_Size` (`SizeID`),
  CONSTRAINT `FK_Carts_Account` FOREIGN KEY (`AccountID`) REFERENCES `account` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_Carts_Size` FOREIGN KEY (`SizeID`) REFERENCES `size` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (7,10,2,2),(8,3,1,2),(9,4,3,2),(10,4,4,2),(22,1,2,1),(23,1,4,1),(24,2,1,1),(33,2,2,17),(34,2,2,15),(40,1,2,3);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Áo'),(2,'Quần'),(3,'Giày');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `color`
--

DROP TABLE IF EXISTS `color`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `color` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `color`
--

LOCK TABLES `color` WRITE;
/*!40000 ALTER TABLE `color` DISABLE KEYS */;
INSERT INTO `color` VALUES (1,'red'),(2,'blue'),(3,'black'),(4,'white'),(5,'blue');
/*!40000 ALTER TABLE `color` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favourite`
--

DROP TABLE IF EXISTS `favourite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favourite` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `SizeID` int DEFAULT NULL,
  `AccountID` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_Favourite_Account` (`AccountID`),
  KEY `FK_Favourite_Size` (`SizeID`),
  CONSTRAINT `FK_Favourite_Account` FOREIGN KEY (`AccountID`) REFERENCES `account` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_Favourite_Size` FOREIGN KEY (`SizeID`) REFERENCES `size` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favourite`
--

LOCK TABLES `favourite` WRITE;
/*!40000 ALTER TABLE `favourite` DISABLE KEYS */;
INSERT INTO `favourite` VALUES (4,2,3,4),(5,1,3,13),(6,2,15,1);
/*!40000 ALTER TABLE `favourite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flashsale`
--

DROP TABLE IF EXISTS `flashsale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flashsale` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Startdate` datetime NOT NULL,
  `Enddate` datetime NOT NULL,
  `Isactive` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flashsale`
--

LOCK TABLES `flashsale` WRITE;
/*!40000 ALTER TABLE `flashsale` DISABLE KEYS */;
INSERT INTO `flashsale` VALUES (1,'Flash Sale Tháng 10','2024-10-15 00:00:00','2024-10-20 23:59:59',1),(2,'Flash Sale Black Friday','2024-11-24 00:00:00','2024-11-25 23:59:59',1);
/*!40000 ALTER TABLE `flashsale` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderdetails`
--

DROP TABLE IF EXISTS `orderdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderdetails` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `OrderID` int DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `SizeID` int DEFAULT NULL,
  `Quantity` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_OrderDetails_Orders` (`OrderID`),
  KEY `FK_OrderDetails_Size` (`SizeID`),
  CONSTRAINT `FK_OrderDetails_Orders` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_OrderDetails_Size` FOREIGN KEY (`SizeID`) REFERENCES `size` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderdetails`
--

LOCK TABLES `orderdetails` WRITE;
/*!40000 ALTER TABLE `orderdetails` DISABLE KEYS */;
INSERT INTO `orderdetails` VALUES (14,31,210200.00,1,1);
/*!40000 ALTER TABLE `orderdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `AccountID` int DEFAULT NULL,
  `Date` datetime DEFAULT CURRENT_TIMESTAMP,
  `AddressID` int DEFAULT NULL,
  `Note` varchar(255) DEFAULT NULL,
  `PaymentID` int DEFAULT NULL,
  `shipping_method_id` int DEFAULT NULL,
  `Status` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_Orders_Account` (`AccountID`),
  KEY `FK_Orders_Address` (`AddressID`),
  KEY `FK_Orders_Payment` (`PaymentID`),
  KEY `FK_Orders_ShippingMethod` (`shipping_method_id`),
  CONSTRAINT `FK_Orders_Account` FOREIGN KEY (`AccountID`) REFERENCES `account` (`ID`) ON DELETE SET NULL,
  CONSTRAINT `FK_Orders_Address` FOREIGN KEY (`AddressID`) REFERENCES `address` (`ID`) ON DELETE SET NULL,
  CONSTRAINT `FK_Orders_Payment` FOREIGN KEY (`PaymentID`) REFERENCES `payment` (`ID`) ON DELETE SET NULL,
  CONSTRAINT `FK_Orders_ShippingMethod` FOREIGN KEY (`shipping_method_id`) REFERENCES `shippingmethods` (`ID`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (9,1,'2024-09-30 13:20:05',1,'',1,1,1),(10,1,'2024-09-30 13:22:11',1,'',2,1,1),(11,1,'2024-09-30 13:25:24',1,'',2,1,1),(31,15,'2024-10-11 11:41:07',7,'abc',2,1,1);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Method` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,'Thanh toán qua ví VNPay'),(2,'Thanh toán khi nhận hàng');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_flashsale`
--

DROP TABLE IF EXISTS `product_flashsale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_flashsale` (
  `ProductID` int NOT NULL,
  `FlashsaleID` int NOT NULL,
  `Discount` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`ProductID`,`FlashsaleID`),
  KEY `FlashsaleID` (`FlashsaleID`),
  CONSTRAINT `product_flashsale_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `product_flashsale_ibfk_2` FOREIGN KEY (`FlashsaleID`) REFERENCES `flashsale` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_flashsale`
--

LOCK TABLES `product_flashsale` WRITE;
/*!40000 ALTER TABLE `product_flashsale` DISABLE KEYS */;
INSERT INTO `product_flashsale` VALUES (1,1,NULL);
/*!40000 ALTER TABLE `product_flashsale` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productimages`
--

DROP TABLE IF EXISTS `productimages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productimages` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ProductsID` int DEFAULT NULL,
  `Image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_ProductImages_Products` (`ProductsID`),
  CONSTRAINT `FK_ProductImages_Products` FOREIGN KEY (`ProductsID`) REFERENCES `products` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=766 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productimages`
--

LOCK TABLES `productimages` WRITE;
/*!40000 ALTER TABLE `productimages` DISABLE KEYS */;
INSERT INTO `productimages` VALUES (1,1,'sanpham1.jpg'),(2,2,'sanpham2.jpg'),(3,1,'sanpham1-1.jpg'),(4,1,'sanpham1-2.jpg'),(5,1,'sanpham1-3.jpg'),(32,3,'somi1.webp'),(33,3,'somi1-1.webp'),(34,3,'som1-2.webp'),(35,3,'somi1-3.webp'),(36,4,'somi2.webp'),(37,4,'somi2-1.webp'),(38,4,'somi2-2.webp'),(39,4,'somi2-3.webp'),(40,5,'somi3.webp'),(41,5,'somi3-1.webp'),(42,5,'somi3-2.webp'),(43,5,'somi3-3.webp'),(44,6,'somi4.webp'),(45,6,'somi4-1.webp'),(46,6,'somi4-2.webp'),(47,6,'somi4-3.webp'),(48,7,'somi5.webp'),(49,7,'somi5-1.webp'),(50,7,'somi5-2.webp'),(51,7,'somi5-3.webp'),(52,8,'somi6.webp'),(53,8,'somi6-1.webp'),(54,8,'som6-2.webp'),(55,8,'somi6-3.webp'),(56,9,'somi7.webp'),(57,9,'somi7-1.webp'),(58,9,'somi7-2.webp'),(59,9,'somi7-3.webp'),(60,10,'somi8.webp'),(61,10,'somi8-1.webp'),(62,10,'somi8-2.webp'),(63,10,'somi8-3.webp'),(64,11,'somi9.webp'),(65,11,'somi9-1.webp'),(66,11,'somi9-2.webp'),(67,11,'somi9-3.webp'),(68,12,'somi10.webp'),(69,12,'somi10-1.webp'),(70,12,'somi10-2.webp'),(71,12,'somi10-3.webp'),(72,13,'somi11.webp'),(73,13,'somi11-1.webp'),(74,13,'somi11-2.webp'),(75,13,'somi11-3.webp'),(76,14,'somi12.webp'),(77,14,'somi12-1.webp'),(78,14,'somi12-2.webp'),(79,14,'somi12-3.webp'),(80,15,'somi13.webp'),(81,15,'somi13-1.webp'),(82,15,'somi13-2.webp'),(83,15,'somi13-3.webp'),(84,16,'somi14.webp'),(85,16,'somi14-1.webp'),(86,16,'somi14-2.webp'),(87,16,'somi14-3.webp'),(88,17,'somi15.webp'),(89,17,'somi15-1.webp'),(90,17,'somi15-2.webp'),(91,17,'somi15-3.webp'),(92,18,'somi16.webp'),(93,18,'somi16-1.webp'),(94,18,'somi16-2.webp'),(95,18,'somi16-3.webp'),(96,19,'somi17.webp'),(97,19,'somi17-1.webp'),(98,19,'somi17-2.webp'),(99,19,'somi17-3.webp'),(100,20,'somi18.webp'),(101,20,'somi18-1.webp'),(102,20,'somi18-2.webp'),(103,20,'somi18-3.webp'),(594,21,'somi19.webp'),(595,21,'somi19-1.webp'),(596,21,'somi19-2.webp'),(597,21,'somi19-3.webp'),(598,22,'somi20.webp'),(599,22,'somi20-1.webp'),(600,22,'somi20-2.webp'),(601,22,'somi20-3.webp'),(602,23,'somi21.webp'),(603,23,'somi21-1.webp'),(604,23,'somi21-2.webp'),(605,23,'somi21-3.webp'),(606,24,'somi22.webp'),(607,24,'somi22-1.webp'),(608,24,'somi22-2.webp'),(609,24,'somi22-3.webp'),(610,25,'somi23.webp'),(611,25,'somi23-1.webp'),(612,25,'somi23-2.webp'),(613,25,'somi23-3.webp'),(614,26,'somi24.webp'),(615,26,'somi24-1.webp'),(616,26,'somi24-2.webp'),(617,26,'somi24-3.webp'),(618,27,'somi25.webp'),(619,27,'somi25-1.webp'),(620,27,'somi25-2.webp'),(621,27,'somi25-3.webp'),(622,28,'somi26.webp'),(623,28,'somi26-1.webp'),(624,28,'somi26-2.webp'),(625,28,'somi26-3.webp'),(626,29,'somi27.webp'),(627,29,'somi27-1.webp'),(628,29,'somi27-2.webp'),(629,29,'somi27-3.webp'),(630,30,'somi28.webp'),(631,30,'somi28-1.webp'),(632,30,'somi28-2.webp'),(633,30,'somi28-3.webp'),(634,31,'somi29.webp'),(635,31,'somi29-1.webp'),(636,31,'somi29-2.webp'),(637,31,'somi29-3.webp'),(638,32,'somi30.webp'),(639,32,'somi30-1.webp'),(640,32,'somi30-2.webp'),(641,32,'somi30-3.webp'),(642,33,'somi31.webp'),(643,33,'somi31-1.webp'),(644,33,'somi31-2.webp'),(645,33,'somi31-3.webp'),(646,34,'somi32.webp'),(647,34,'somi32-1.webp'),(648,34,'somi32-2.webp'),(649,34,'somi32-3.webp'),(650,35,'somi33.webp'),(651,35,'somi33-1.webp'),(652,35,'somi33-2.webp'),(653,35,'somi33-3.webp'),(654,36,'somi34.webp'),(655,36,'somi34-1.webp'),(656,36,'somi34-2.webp'),(657,36,'somi34-3.webp'),(658,37,'somi35.webp'),(659,37,'somi35-1.webp'),(660,37,'somi35-2.webp'),(661,37,'somi35-3.webp'),(662,38,'somi36.webp'),(663,38,'somi36-1.webp'),(664,38,'somi36-2.webp'),(665,38,'somi36-3.webp'),(666,39,'somi37.webp'),(667,39,'somi37-1.webp'),(668,39,'somi37-2.webp'),(669,39,'somi37-3.webp'),(670,40,'somi38.webp'),(671,40,'somi38-1.webp'),(672,40,'somi38-2.webp'),(673,40,'somi38-3.webp'),(674,41,'somi39.webp'),(675,41,'somi39-1.webp'),(676,41,'somi39-2.webp'),(677,41,'somi39-3.webp'),(678,42,'somi40.webp'),(679,42,'somi40-1.webp'),(680,42,'somi40-2.webp'),(681,42,'somi40-3.webp'),(682,43,'somi41.webp'),(683,43,'somi41-1.webp'),(684,43,'somi41-2.webp'),(685,43,'somi41-3.webp'),(686,44,'somi42.webp'),(687,44,'somi42-1.webp'),(688,44,'somi42-2.webp'),(689,44,'somi42-3.webp'),(690,45,'somi43.webp'),(691,45,'somi43-1.webp'),(692,45,'somi43-2.webp'),(693,45,'somi43-3.webp'),(694,46,'somi44.webp'),(695,46,'somi44-1.webp'),(696,46,'somi44-2.webp'),(697,46,'somi44-3.webp'),(698,47,'somi45.webp'),(699,47,'somi45-1.webp'),(700,47,'somi45-2.webp'),(701,47,'somi45-3.webp'),(702,48,'somi46.webp'),(703,48,'somi46-1.webp'),(704,48,'somi46-2.webp'),(705,48,'somi46-3.webp'),(706,49,'somi47.webp'),(707,49,'somi47-1.webp'),(708,49,'somi47-2.webp'),(709,49,'somi47-3.webp'),(710,50,'somi48.webp'),(711,50,'somi48-1.webp'),(712,50,'somi48-2.webp'),(713,50,'somi48-3.webp'),(714,51,'quan1.webp'),(715,51,'quan1-1.webp'),(716,52,'quan2.webp'),(717,53,'quan3.webp'),(718,53,'quan3-1.webp'),(719,54,'quan4.webp'),(720,54,'quan4-1.webp'),(721,56,'quan6.webp'),(722,56,'quan6-1.webp'),(723,56,'quan6-2.webp'),(724,56,'quan6-3.webp'),(725,57,'quan7.webp'),(726,57,'quan7-1.webp'),(727,57,'quan7-2.webp'),(728,57,'quan7-3.webp'),(729,58,'quan8.webp'),(730,58,'quan8-1.webp'),(731,58,'quan8-2.webp'),(732,58,'quan8-3.webp'),(733,59,'quan9.webp'),(734,59,'quan9-1.webp'),(735,59,'quan9-2.webp'),(736,59,'quan9-3.webp'),(737,60,'quan10.webp'),(738,60,'quan10-1.webp'),(739,60,'quan10-2.webp'),(740,60,'quan10-3.webp'),(741,61,'quan11.webp'),(742,61,'quan11-1.webp'),(743,61,'quan11-2.webp'),(744,61,'quan11-3.webp'),(745,62,'quan12.webp'),(746,62,'quan12-1.webp'),(747,63,'quan13.webp'),(748,63,'quan13-1.webp'),(749,64,'quan14.webp'),(750,64,'quan14-1.webp'),(751,65,'quan15.webp'),(752,65,'quan15-1.webp'),(753,66,'quan16.webp'),(754,66,'quan16-1.webp'),(755,67,'quan18.webp'),(756,68,'quan19.webp'),(757,68,'quan19-1.webp'),(758,69,'quan20.webp'),(759,69,'quan20-1.webp'),(760,70,'quan21.webp'),(761,70,'quan21-1.webp'),(762,71,'quan22.webp'),(763,71,'quan22-1.webp'),(764,55,'quan5.webp'),(765,55,'quan5-1.webp');
/*!40000 ALTER TABLE `productimages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `Description` varchar(1000) DEFAULT NULL,
  `Create_Date` datetime DEFAULT CURRENT_TIMESTAMP,
  `CategoryID` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_Products_Category` (`CategoryID`),
  CONSTRAINT `FK_Products_Category` FOREIGN KEY (`CategoryID`) REFERENCES `category` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'áo sơ mi',210200.00,'- Chất liệu: Bamboo, Polyester','2024-09-18 22:03:38',1),(2,'áo thun',656566.00,'- Chất liệu: Bamboo, Polyester','2024-09-18 22:03:38',1),(3,'Áo sơ mi nam caro Merriman mã THMOS486 sợi bamboo cao cấp',711818.00,'- Chất liệu: Bamboo, Polyester','2024-10-21 12:48:46',1),(4,'Áo somi dài tay Vitimex ARD7780',565000.00,'Kiểu dáng: Form dáng Regular Fit ngắn tay suông nhẹ, thoải mái','2024-10-21 13:18:27',1),(5,'Sơ mi dài tay Vitimex ARD7588',600000.00,'Chất liệu: 54%Visco Rayon+46%Microfiber','2024-10-21 13:18:27',1),(6,'Sơ mi dài tay Regular Vitimex ARD7795',625000.00,'Kiểu dáng: Form dáng Regular Fit dài tay suông nhẹ, thoải mái','2024-10-21 13:18:27',1),(7,'Áo sơ mi dài tay Vitimex ASD7831',625000.00,'Kiểu dáng: Form dáng Slimfit ôm gọn, tôn dáng','2024-10-21 14:12:47',1),(8,'Áo sơ mi dài tay Vitimex ASD7880',650000.00,'Chất liệu: 48,5%Bamboo + 48,5%Spun + 3% Spandex','2024-10-21 14:12:47',1),(9,'Áo sơ mi dài tay dáng ôm ASD7841',650000.00,'Thành phần: 48,5% bamboo+48,5% spun+3% spandex','2024-10-21 14:12:47',1),(10,'Áo sơ mi dài tay dáng ôm ASD7840',675000.00,'Chất liệu: 48,5%Bamboo + 48,5%Spun + 3% Spandex','2024-10-21 14:12:47',1),(11,'Áo sơ mi dài tay dáng ôm ASD7830',675000.00,'Thành phần: 48,5% bamboo+48,5% spun+3% spandex','2024-10-21 14:12:47',1),(12,'Áo sơ mi dài tay dáng rộng ARD7868',625000.00,'Thành phần: 54%Visco Rayon+46%Polyester','2024-10-21 14:12:47',1),(13,'Áo sơ mi dài tay dáng rộng ARD7867',620000.00,'Thành phần: 54%Visco Rayon+46%Polyester','2024-10-21 14:12:47',1),(14,'Áo sơ mi dài tay dáng rộng ARD7866',775000.00,'Thành phần: 54%Visco Rayon+46%Polyester','2024-10-21 14:12:47',1),(15,'Áo sơ mi dài tay dáng rộng ARD7851',625000.00,'Thành phần: 54%Visco Rayon+46%Polyester','2024-10-21 14:12:47',1),(16,'Áo sơ mi dài tay dáng rộng ARD7850',625000.00,'Thành phần: 54%Visco Rayon+46%Polyester','2024-10-21 14:12:47',1),(17,'Sơ mi dài tay dáng ôm Vitimex ASD7862',625000.00,'Kiểu dáng: Form dáng Slimfit ôm gọn, tôn dáng','2024-10-21 14:12:47',1),(18,'Áo sơ mi dài tay dáng rộng ARD7843',625000.00,'Kiểu dáng: Form dáng Regular Fit dài tay suông nhẹ, thoải mái','2024-10-21 14:12:47',1),(19,'Áo sơ mi dài tay dáng rộng ARD7805',650000.00,'Kiểu dáng: Form dáng Regular Fit dài tay suông nhẹ, thoải mái','2024-10-21 14:12:47',1),(20,'Sơ mi dài tay body không túi Vitimex ABD7656',495000.00,'Kiểu dáng: Form dáng Slimfit ôm gọn, tôn dáng','2024-10-21 14:12:47',1),(21,'Sơ mi dài tay Regular Vitimex ARD7875',625000.00,'Kiểu dáng: Form dáng Regular Fit dài tay suông nhẹ, thoải mái','2024-10-23 15:32:10',1),(22,'Sơ mi dài tay Regular Vitimex ARD7874',625000.00,'Kiểu dáng: Form dáng Regular Fit dài tay suông nhẹ, thoải mái','2024-10-23 15:32:10',1),(23,'Áo sơ mi dài tay dáng rộng ARD7701',625000.00,'Kiểu dáng: Form dáng Regular Fit dài tay suông nhẹ, thoải mái','2024-10-23 15:32:10',1),(24,'Áo sơ mi dài tay dáng ôm ASD7829',625000.00,'Kiểu dáng: Form dáng Slimfit ôm gọn, tôn dáng','2024-10-23 15:32:10',1),(25,'Áo sơ mi dài tay phom ôm ASD7823',650000.00,'Kiểu dáng: Form dáng Slimfit ôm gọn, tôn dáng','2024-10-23 15:32:10',1),(26,'Áo sơ mi dài tay phom ôm ASD7821',625000.00,'Kiểu dáng: Form dáng Slimfit ôm gọn, tôn dáng','2024-10-23 15:32:10',1),(27,'Áo somi dài tay Vitimex ARD7789',625000.00,'Kiểu dáng: Form dáng Regular Fit ngắn tay suông nhẹ, thoải mái','2024-10-23 15:32:10',1),(28,'Áo sơ mi dài tay dang ôm ASD7810',650000.00,'Kiểu dáng: Form dáng Slimfit ôm gọn, tôn dáng','2024-10-23 15:32:10',1),(29,'Sơ mi dài tay Vitimex ARD7800',625000.00,'Kiểu dáng: Form dáng Regular Fit dài tay suông nhẹ, thoải mái','2024-10-23 15:32:10',1),(30,'Sơ mi dài tay dáng ôm Vitimex ASD7822',625000.00,'Kiểu dáng: Form dáng Slimfit ôm gọn, tôn dáng','2024-10-23 15:32:10',1),(31,'Áo sơ mi dài tay Vitimex ARD7783',565000.00,'Kiểu dáng: Form dáng Regular Fit ngắn tay suông nhẹ, thoải mái','2024-10-23 15:32:10',1),(32,'Áo sơ mi dài tay Vitimex ARD7782',565000.00,'Kiểu dáng: Form dáng Regular Fit ngắn tay suông nhẹ, thoải mái','2024-10-23 15:32:10',1),(33,'Áo sơ mi dài tay Vitimex ARD7779',565000.00,'Kiểu dáng: Form dáng Regular Fit ngắn tay suông nhẹ, thoải mái','2024-10-23 15:32:10',1),(34,'Áo sơ mi dài tay Vitimex ARD7777',565000.00,'Kiểu dáng: Form dáng Regular Fit ngắn tay suông nhẹ, thoải mái','2024-10-23 15:32:10',1),(35,'Áo sơ mi dài tay Vitimex ARD7770',565000.00,'Kiểu dáng: Form dáng Regular Fit ngắn tay suông nhẹ, thoải mái','2024-10-23 15:32:10',1),(36,'Áo sơ mi dài tay Vitimex ARD7685',450000.00,'Kiểu dáng: Form dáng Regular Fit dài tay suông nhẹ, thoải mái','2024-10-23 15:32:10',1),(37,'Áo sơ mi dài tay Vitimex ARD7684',450000.00,'Kiểu dáng: Form dáng Regular Fit dài tay suông nhẹ, thoải mái','2024-10-23 15:32:10',1),(38,'Áo sơ mi dài tay Vitimex ARD7578',450000.00,'Kiểu dáng: Form dáng Regular Fit ngắn tay suông nhẹ, thoải mái','2024-10-23 15:32:10',1),(39,'Sơ mi ngắn tay Vitimex ARC7765',545000.00,'Kiểu dáng: Form dáng Regular Fit ngắn tay suông nhẹ, thoải mái','2024-10-23 15:32:10',1),(40,'Sơ mi ngắn tay Vitimex ARC7801',495000.00,'Kiểu dáng: Form dáng Regular Fit ngắn tay suông nhẹ, thoải mái','2024-10-23 15:32:10',1),(41,'Sơ mi ngắn tay Vitimex ARC7685',490000.00,'Kiểu dáng: Form dáng Regular Fit ngắn tay suông nhẹ, thoải mái','2024-10-24 21:58:30',1),(42,'Áo polo nam Vitimex ATR3039',495000.00,'Kiểu dáng: Form dáng Regular Fit ngắn tay suông nhẹ, thoải mái','2024-10-24 21:58:30',1),(43,'Áo polo nam Vitimex ATR3038',495000.00,'Kiểu dáng: Form dáng Regular Fit ngắn tay suông nhẹ, thoải mái','2024-10-24 21:58:30',1),(44,'Áo polo nam Vitimex ATS3023',565000.00,'Kiểu dáng: Form dáng Regular Fit ngắn tay suông nhẹ, thoải mái','2024-10-24 21:58:30',1),(45,'Áo Polo nam Vitimex ATS3033',495000.00,'Kiểu dáng: Form dáng Regular Fit ngắn tay suông nhẹ, thoải mái','2024-10-24 21:58:30',1),(46,'Áo len nam Vitimex ALN3004',445000.00,'Kiểu dáng: Thân áo và tay áo thiết kế ôm nhẹ vào người đem đến cảm giác gọn gàng, lịch sự','2024-10-24 22:05:58',1),(47,'Áo len nam Vitimex ALNT004',160000.00,'Thành phần: 55%Acrylic + 45%Cotton','2024-10-24 22:05:58',1),(48,'Áo len nam Vitimex ALN3009',445000.00,'Thành phần: 55%Acrylic + 45%Cotton','2024-10-24 22:05:58',1),(49,'Áo len nam Vitimex ALNT003',160000.00,'Kiểu dáng: Thân áo và tay áo thiết kế ôm nhẹ vào người đem đến cảm giác gọn gàng, lịch sự','2024-10-24 22:05:58',1),(50,'Áo len nam Vitimex ALN9006',212000.00,'Kiểu dáng: Thân áo và tay áo thiết kế ôm nhẹ vào người đem đến cảm giác gọn gàng, lịch sự','2024-10-24 22:05:58',1),(51,'Quần âu dáng ôm Vitimex QSK7526',415000.00,'Kiểu dáng: Form Slim Fit ôm gọn, tôn dáng','2024-10-24 22:21:36',2),(52,'Quần âu dáng rộng Vitimex QKK9085',645000.00,'Kiểu dáng: Form dáng Regular Fit suông nhẹ, thoải mái','2024-10-24 22:21:36',2),(53,'Quần âu dáng rộng Vitimex QKK9053',545000.00,'Kiểu dáng: Form dáng Regular Fit suông nhẹ, thoải mái','2024-10-24 22:21:36',2),(54,'Quần âu dáng ôm Vitimex QSK9071',545000.00,'Kiểu dáng: Form Slim Fit ôm gọn, tôn dáng','2024-10-24 22:21:36',2),(55,'Quần âu có ly Vitimex QLK9127',645000.00,'Kiểu dáng: Quần xếp ly ngược thoải mái, phù hợp với người có vòng 2 lớn','2024-10-24 22:21:36',2),(56,'Quần Jean nam Vitimex QJN4002',599000.00,'Kiểu dáng: Form ôm gọn, tôn dáng','2024-10-24 22:21:36',2),(57,'Quần Jean nam Vitimex QJN4001',590000.00,'Kiểu dáng: Form ôm gọn, tôn dáng','2024-10-24 22:21:36',2),(58,'Quần kaki Vitimex KSS7618',625000.00,'Kiểu dáng: Form Slim Fit ôm gọn, tôn dáng','2024-10-24 22:21:36',2),(59,'Quần kaki dáng ôm Vitimex KSG7617',625000.00,'Kiểu dáng: Form Slim Fit ôm gọn, tôn dáng','2024-10-24 22:21:36',2),(60,'Quần kaki dáng ôm Vitimex KSG7606',620000.00,'Kiểu dáng: Form Slim Fit ôm gọn, tôn dáng','2024-10-24 22:21:36',2),(61,'Quần kaki dáng rộng Vitimex KRG7615',625000.00,'Kiểu dáng: Form Slim Fit ôm gọn, tôn dáng','2024-10-24 22:21:36',2),(62,'Quần kaki dáng ôm Vitimex KSS4008',625000.00,'Kiểu dáng: Form Slim Fit ôm gọn, tôn dáng','2024-10-24 22:21:36',2),(63,'Quần kaki dáng rộng Vitimex KRS4006',625000.00,'Kiểu dáng: Form Slim Fit ôm gọn, tôn dáng','2024-10-24 22:21:36',2),(64,'Quần kaki có ly Vitimex KCG4004',625000.00,'Kiểu dáng: Form Slim Fit ôm gọn, tôn dáng','2024-10-24 22:21:36',2),(65,'Quần kaki dáng rộng Vitimex KRG7493',625000.00,'Kiểu dáng: Form Slim Fit ôm gọn, tôn dáng','2024-10-24 22:26:45',2),(66,'Quần kaki dáng rộng Vitimex KRS7606',625000.00,'Kiểu dáng: Form Slim Fit ôm gọn, tôn dáng','2024-10-24 22:26:45',2),(67,'Quần kaki dáng ôm Vitimex KSS7619',625000.00,'Kiểu dáng: Form Slim Fit ôm gọn, tôn dáng','2024-10-24 22:26:45',2),(68,'Quần kaki dáng ôm Vitimex KSS7617',625000.00,'Kiểu dáng: Form Slim Fit ôm gọn, tôn dáng','2024-10-24 22:26:45',2),(69,'Quần kaki dáng rộng Vitimex KRS7644',625000.00,'Kiểu dáng: Form Slim Fit ôm gọn, tôn dáng','2024-10-24 22:26:45',2),(70,'Quần kaki dáng rộng Vitimex KRS7635',620000.00,'Kiểu dáng: Form Slim Fit ôm gọn, tôn dáng','2024-10-24 22:26:45',2),(71,'Quần kaki dáng rộng Vitimex KRS7627',650000.00,'Kiểu dáng: Form Slim Fit ôm gọn, tôn dáng','2024-10-24 22:26:45',2);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rating`
--

DROP TABLE IF EXISTS `rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rating` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `OrderID` int DEFAULT NULL,
  `SizeID` int DEFAULT NULL,
  `Stars` int DEFAULT NULL,
  `Review` varchar(255) DEFAULT NULL,
  `Date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  KEY `FK_Rating_Orders` (`OrderID`),
  KEY `FK_Rating_SizeID` (`SizeID`),
  CONSTRAINT `FK_Rating_Orders` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_Rating_Size` FOREIGN KEY (`SizeID`) REFERENCES `size` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `rating_chk_1` CHECK ((`Stars` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rating`
--

LOCK TABLES `rating` WRITE;
/*!40000 ALTER TABLE `rating` DISABLE KEYS */;
INSERT INTO `rating` VALUES (1,31,1,4,'Chất lượng vãi tốt','2024-09-30 13:25:24'),(2,11,1,5,'good','2024-09-30 13:25:24');
/*!40000 ALTER TABLE `rating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN'),(2,'STAFF'),(3,'USER');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shippingmethods`
--

DROP TABLE IF EXISTS `shippingmethods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shippingmethods` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `MethodName` varchar(100) DEFAULT NULL,
  `Fee` decimal(10,2) DEFAULT NULL,
  `EstimatedDeliveryTime` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shippingmethods`
--

LOCK TABLES `shippingmethods` WRITE;
/*!40000 ALTER TABLE `shippingmethods` DISABLE KEYS */;
INSERT INTO `shippingmethods` VALUES (1,'Giao hàng tiêu chuẩn',25000.00,'nhận hàng sau 3 - 5 ngày'),(2,'Giao hàng nhanh',35000.00,'nhận hàng sau 1 -3 ngày');
/*!40000 ALTER TABLE `shippingmethods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `size`
--

DROP TABLE IF EXISTS `size`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `size` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ProductID` int DEFAULT NULL,
  `Name` varchar(50) DEFAULT NULL,
  `Quantity_In_Stock` int DEFAULT NULL,
  `ColorID` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_Size_Products` (`ProductID`),
  KEY `FK_Size_Color` (`ColorID`),
  CONSTRAINT `FK_Size_Color` FOREIGN KEY (`ColorID`) REFERENCES `color` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_Size_Products` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `size`
--

LOCK TABLES `size` WRITE;
/*!40000 ALTER TABLE `size` DISABLE KEYS */;
INSERT INTO `size` VALUES (1,1,'M',18,1),(2,2,'L',1,4),(3,1,'L',16,1),(4,1,'L',12,2);
/*!40000 ALTER TABLE `size` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-25 16:23:44
