-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: db1
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;a
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

-- DROP TABLE IF EXISTS `account`;
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
INSERT INTO `address` VALUES (1,'Province A','District A','Ward A','Note A',1,'DINH QUOC HUNG',327247263,1),(2,'a','a','a','123',3,'1',1,1),(3,'Province B','District B','Ward B','Note B',2,'A',327247263,0),(7,'Cà Mau','Thới Bìnhhh','Trí phải','huyện sử',15,'ngan',32724562,1),(9,'Sóc Trăng','Mỹ tú','châu thành','123 lam lam',3,'kim ngân',359032559,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (7,10,2,2),(8,3,1,2),(9,4,3,2),(10,4,4,2),(33,2,2,17),(34,2,2,15),(40,1,2,3),(41,1,1,15);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `color`
--

LOCK TABLES `color` WRITE;
/*!40000 ALTER TABLE `color` DISABLE KEYS */;
INSERT INTO `color` VALUES (1,'red'),(2,'blue'),(3,'black'),(4,'white');
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderdetails`
--

LOCK TABLES `orderdetails` WRITE;
/*!40000 ALTER TABLE `orderdetails` DISABLE KEYS */;
INSERT INTO `orderdetails` VALUES (14,31,210200.00,1,1),(19,37,656566.00,2,1),(20,37,210200.00,4,1),(21,37,420400.00,1,2);
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
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (9,1,'2024-09-30 13:20:05',1,'',1,1,1),(10,1,'2024-09-30 13:22:11',1,'',2,1,1),(11,1,'2024-09-30 13:25:24',1,'',2,1,1),(31,15,'2024-10-11 11:41:07',7,'abc',2,1,1),(37,1,'2024-10-21 13:23:29',1,'',2,1,1);
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
INSERT INTO `product_flashsale` VALUES (1,1,10.00);
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productimages`
--

LOCK TABLES `productimages` WRITE;
/*!40000 ALTER TABLE `productimages` DISABLE KEYS */;
INSERT INTO `productimages` VALUES (1,1,'sanpham1.jpg'),(2,2,'sanpham2.jpg'),(3,1,'sanpham1-1.jpg'),(4,1,'sanpham1-2.jpg'),(5,1,'sanpham1-3.jpg');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'áo sơ mi',210200.00,'mo tả ','2024-09-18 22:03:38',1),(2,'áo thun',656566.00,'ma tổ','2024-09-18 22:03:38',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rating`
--

LOCK TABLES `rating` WRITE;
/*!40000 ALTER TABLE `rating` DISABLE KEYS */;
INSERT INTO `rating` VALUES (1,31,1,4,'Chất lượng vãi tốt','2024-09-30 13:25:24'),(2,11,1,5,'good','2024-09-30 13:25:24'),(3,11,1,5,'oke babu','2024-10-21 13:45:56');
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
INSERT INTO `size` VALUES (1,1,'M',16,1),(2,2,'L',0,4),(3,1,'L',16,1),(4,1,'L',11,2);
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

-- Dump completed on 2024-10-22 14:08:41
