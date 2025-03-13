-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: localhost    Database: sema_mama_db
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `sema_mama_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `sema_mama_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `sema_mama_db`;

--
-- Table structure for table `analytics_contentperformance`
--

DROP TABLE IF EXISTS `analytics_contentperformance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `analytics_contentperformance` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `views` int unsigned NOT NULL,
  `likes` int unsigned NOT NULL,
  `shares` int unsigned NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `content_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `analytics_contentper_content_id_2e9aac47_fk_content_c` (`content_id`),
  CONSTRAINT `analytics_contentper_content_id_2e9aac47_fk_content_c` FOREIGN KEY (`content_id`) REFERENCES `content_content` (`id`),
  CONSTRAINT `analytics_contentperformance_chk_1` CHECK ((`views` >= 0)),
  CONSTRAINT `analytics_contentperformance_chk_2` CHECK ((`likes` >= 0)),
  CONSTRAINT `analytics_contentperformance_chk_3` CHECK ((`shares` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analytics_contentperformance`
--

LOCK TABLES `analytics_contentperformance` WRITE;
/*!40000 ALTER TABLE `analytics_contentperformance` DISABLE KEYS */;
/*!40000 ALTER TABLE `analytics_contentperformance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `analytics_forumactivity`
--

DROP TABLE IF EXISTS `analytics_forumactivity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `analytics_forumactivity` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `posts_created` int unsigned NOT NULL,
  `comments_made` int unsigned NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `analytics_forumactivity_user_id_d5418654_fk_users_user_id` (`user_id`),
  CONSTRAINT `analytics_forumactivity_user_id_d5418654_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`),
  CONSTRAINT `analytics_forumactivity_chk_1` CHECK ((`posts_created` >= 0)),
  CONSTRAINT `analytics_forumactivity_chk_2` CHECK ((`comments_made` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analytics_forumactivity`
--

LOCK TABLES `analytics_forumactivity` WRITE;
/*!40000 ALTER TABLE `analytics_forumactivity` DISABLE KEYS */;
/*!40000 ALTER TABLE `analytics_forumactivity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `analytics_report`
--

DROP TABLE IF EXISTS `analytics_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `analytics_report` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `report_type` varchar(100) NOT NULL,
  `description` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `analytics_report_user_id_0fef5abb_fk_users_user_id` (`user_id`),
  CONSTRAINT `analytics_report_user_id_0fef5abb_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analytics_report`
--

LOCK TABLES `analytics_report` WRITE;
/*!40000 ALTER TABLE `analytics_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `analytics_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `analytics_smsusage`
--

DROP TABLE IF EXISTS `analytics_smsusage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `analytics_smsusage` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `messages_sent` int unsigned NOT NULL,
  `last_sent` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `analytics_smsusage_user_id_39ca6b4e_fk_users_user_id` (`user_id`),
  CONSTRAINT `analytics_smsusage_user_id_39ca6b4e_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`),
  CONSTRAINT `analytics_smsusage_chk_1` CHECK ((`messages_sent` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analytics_smsusage`
--

LOCK TABLES `analytics_smsusage` WRITE;
/*!40000 ALTER TABLE `analytics_smsusage` DISABLE KEYS */;
/*!40000 ALTER TABLE `analytics_smsusage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `analytics_useractivity`
--

DROP TABLE IF EXISTS `analytics_useractivity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `analytics_useractivity` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action` varchar(255) NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `analytics_useractivity_user_id_5018049a_fk_users_user_id` (`user_id`),
  CONSTRAINT `analytics_useractivity_user_id_5018049a_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analytics_useractivity`
--

LOCK TABLES `analytics_useractivity` WRITE;
/*!40000 ALTER TABLE `analytics_useractivity` DISABLE KEYS */;
/*!40000 ALTER TABLE `analytics_useractivity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointments_appointment`
--

DROP TABLE IF EXISTS `appointments_appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments_appointment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` longtext,
  `date` datetime(6) NOT NULL,
  `status` varchar(10) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  `provider_id` bigint DEFAULT NULL,
  `rejection_reason` longtext,
  `rescheduled_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `appointments_appointment_user_id_ae788a47_fk_users_user_id` (`user_id`),
  KEY `appointments_appointment_provider_id_301e66b6_fk_users_user_id` (`provider_id`),
  CONSTRAINT `appointments_appointment_provider_id_301e66b6_fk_users_user_id` FOREIGN KEY (`provider_id`) REFERENCES `users_user` (`id`),
  CONSTRAINT `appointments_appointment_user_id_ae788a47_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments_appointment`
--

LOCK TABLES `appointments_appointment` WRITE;
/*!40000 ALTER TABLE `appointments_appointment` DISABLE KEYS */;
INSERT INTO `appointments_appointment` VALUES (1,'Consultation','Appointment with healthcare provider','2025-03-09 12:00:00.000000','scheduled','2025-03-09 16:13:09.854727',38,NULL,NULL,NULL),(2,'Consultation','Appointment with healthcare provider','2025-03-09 00:00:00.000000','scheduled','2025-03-09 16:16:48.986547',38,NULL,NULL,NULL),(3,'Consultation','Appointment with healthcare provider','2025-03-09 00:00:00.000000','scheduled','2025-03-09 16:17:45.621552',42,NULL,NULL,NULL),(5,'Consultation','Appointment with healthcare provider','2025-03-09 00:00:00.000000','scheduled','2025-03-09 16:45:16.569565',52,NULL,NULL,NULL),(6,'Consultation','Appointment with healthcare provider','2025-03-09 00:00:00.000000','scheduled','2025-03-09 16:47:05.121784',52,NULL,NULL,NULL),(7,'Consultation','Appointment with healthcare provider','2025-03-09 00:00:00.000000','scheduled','2025-03-09 17:07:29.004393',52,NULL,NULL,NULL),(8,'Consultation','Appointment with healthcare provider','2025-03-09 00:00:00.000000','scheduled','2025-03-09 17:07:48.045774',52,NULL,NULL,NULL),(9,'Consultation','Appointment with healthcare provider','2025-03-09 00:00:00.000000','scheduled','2025-03-09 17:09:37.445619',52,NULL,NULL,NULL),(10,'Consultation','Appointment with healthcare provider','2025-03-09 00:00:00.000000','scheduled','2025-03-09 17:16:10.012813',52,NULL,NULL,NULL),(11,'Consultation','Appointment with healthcare provider','2025-03-09 00:00:00.000000','scheduled','2025-03-09 17:16:25.819445',52,NULL,NULL,NULL),(12,'Consultation','Appointment with healthcare provider','2025-03-09 00:00:00.000000','scheduled','2025-03-09 17:20:10.281024',52,NULL,NULL,NULL),(13,'Consultation','Appointment with healthcare provider','2025-03-09 00:00:00.000000','scheduled','2025-03-09 17:31:40.895777',52,NULL,NULL,NULL),(14,'Consultation','Appointment with healthcare provider','2025-03-09 00:00:00.000000','scheduled','2025-03-09 17:33:51.772033',52,NULL,NULL,NULL),(15,'Consultation','Appointment with healthcare provider','2025-03-09 00:00:00.000000','scheduled','2025-03-09 17:36:55.788098',52,NULL,NULL,NULL),(21,'TESTING APPOINTMENTS','I want to test the providers today','2025-03-10 22:36:00.000000','canceled','2025-03-10 19:36:24.718636',40,NULL,NULL,NULL),(22,'MILK','abc','2025-03-11 17:53:00.000000','canceled','2025-03-11 14:53:48.834913',40,NULL,NULL,NULL);
/*!40000 ALTER TABLE `appointments_appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
INSERT INTO `auth_group` VALUES (1,'Admin'),(2,'Health Providers'),(3,'Mothers');
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
INSERT INTO `auth_group_permissions` VALUES (1,1,1),(2,1,2),(3,1,3),(4,1,4),(5,1,5),(6,1,6),(7,1,7),(8,1,8),(9,1,9),(10,1,10),(11,1,11),(12,1,12),(13,1,13),(14,1,14),(15,1,15),(16,1,16),(17,1,17),(18,1,18),(19,1,19),(20,1,20),(21,1,21),(22,1,22),(23,1,23),(24,1,24),(25,1,25),(26,1,26),(27,1,27),(28,1,28),(49,3,4),(50,3,8),(51,3,12),(52,3,16),(53,3,20),(54,3,22),(55,3,24),(56,3,25),(57,3,26),(58,3,27),(59,3,28);
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add appointment',6,'add_appointment'),(22,'Can change appointment',6,'change_appointment'),(23,'Can delete appointment',6,'delete_appointment'),(24,'Can view appointment',6,'view_appointment'),(25,'Can add user',7,'add_user'),(26,'Can change user',7,'change_user'),(27,'Can delete user',7,'delete_user'),(28,'Can view user',7,'view_user'),(29,'Can add content',8,'add_content'),(30,'Can change content',8,'change_content'),(31,'Can delete content',8,'delete_content'),(32,'Can view content',8,'view_content'),(33,'Can add setting',9,'add_setting'),(34,'Can change setting',9,'change_setting'),(35,'Can delete setting',9,'delete_setting'),(36,'Can view setting',9,'view_setting'),(37,'Can add sms',10,'add_sms'),(38,'Can change sms',10,'change_sms'),(39,'Can delete sms',10,'delete_sms'),(40,'Can view sms',10,'view_sms'),(41,'Can send SMS',10,'can_send_sms'),(42,'Can delete SMS',10,'can_delete_sms'),(43,'Can add comment',11,'add_comment'),(44,'Can change comment',11,'change_comment'),(45,'Can delete comment',11,'delete_comment'),(46,'Can view comment',11,'view_comment'),(47,'Can add forum',12,'add_forum'),(48,'Can change forum',12,'change_forum'),(49,'Can delete forum',12,'delete_forum'),(50,'Can view forum',12,'view_forum'),(51,'Can add support group',13,'add_supportgroup'),(52,'Can change support group',13,'change_supportgroup'),(53,'Can delete support group',13,'delete_supportgroup'),(54,'Can view support group',13,'view_supportgroup'),(55,'Can add post',14,'add_post'),(56,'Can change post',14,'change_post'),(57,'Can delete post',14,'delete_post'),(58,'Can view post',14,'view_post'),(59,'Can add sms message',15,'add_smsmessage'),(60,'Can change sms message',15,'change_smsmessage'),(61,'Can delete sms message',15,'delete_smsmessage'),(62,'Can view sms message',15,'view_smsmessage'),(63,'Can add appointment',16,'add_appointment'),(64,'Can change appointment',16,'change_appointment'),(65,'Can delete appointment',16,'delete_appointment'),(66,'Can view appointment',16,'view_appointment'),(67,'Can add forum activity',17,'add_forumactivity'),(68,'Can change forum activity',17,'change_forumactivity'),(69,'Can delete forum activity',17,'delete_forumactivity'),(70,'Can view forum activity',17,'view_forumactivity'),(71,'Can add content performance',18,'add_contentperformance'),(72,'Can change content performance',18,'change_contentperformance'),(73,'Can delete content performance',18,'delete_contentperformance'),(74,'Can view content performance',18,'view_contentperformance'),(75,'Can add sms usage',19,'add_smsusage'),(76,'Can change sms usage',19,'change_smsusage'),(77,'Can delete sms usage',19,'delete_smsusage'),(78,'Can view sms usage',19,'view_smsusage'),(79,'Can add user activity',20,'add_useractivity'),(80,'Can change user activity',20,'change_useractivity'),(81,'Can delete user activity',20,'delete_useractivity'),(82,'Can view user activity',20,'view_useractivity'),(83,'Can add report',21,'add_report'),(84,'Can change report',21,'change_report'),(85,'Can delete report',21,'delete_report'),(86,'Can view report',21,'view_report'),(87,'Can add forum',22,'add_forum'),(88,'Can change forum',22,'change_forum'),(89,'Can delete forum',22,'delete_forum'),(90,'Can view forum',22,'view_forum'),(91,'Can add post',23,'add_post'),(92,'Can change post',23,'change_post'),(93,'Can delete post',23,'delete_post'),(94,'Can view post',23,'view_post'),(95,'Can add comment',24,'add_comment'),(96,'Can change comment',24,'change_comment'),(97,'Can delete comment',24,'delete_comment'),(98,'Can view comment',24,'view_comment');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_comment`
--

DROP TABLE IF EXISTS `community_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_comment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  `post_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `community_comment_user_id_702f6fde_fk_users_user_id` (`user_id`),
  KEY `community_comment_post_id_12b521a8_fk_community_post_id` (`post_id`),
  CONSTRAINT `community_comment_post_id_12b521a8_fk_community_post_id` FOREIGN KEY (`post_id`) REFERENCES `community_post` (`id`),
  CONSTRAINT `community_comment_user_id_702f6fde_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_comment`
--

LOCK TABLES `community_comment` WRITE;
/*!40000 ALTER TABLE `community_comment` DISABLE KEYS */;
INSERT INTO `community_comment` VALUES (23,'i liked it','2025-03-11 08:52:39.502687',39,12),(24,'they are cool','2025-03-11 13:14:18.853651',40,22),(25,'abd','2025-03-11 14:50:04.342710',40,23);
/*!40000 ALTER TABLE `community_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_comment_likes`
--

DROP TABLE IF EXISTS `community_comment_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_comment_likes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `community_comment_likes_comment_id_user_id_ddb824a0_uniq` (`comment_id`,`user_id`),
  KEY `community_comment_likes_user_id_3d69d764_fk_users_user_id` (`user_id`),
  CONSTRAINT `community_comment_li_comment_id_3ec95328_fk_community` FOREIGN KEY (`comment_id`) REFERENCES `community_comment` (`id`),
  CONSTRAINT `community_comment_likes_user_id_3d69d764_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_comment_likes`
--

LOCK TABLES `community_comment_likes` WRITE;
/*!40000 ALTER TABLE `community_comment_likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_comment_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_forum`
--

DROP TABLE IF EXISTS `community_forum`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_forum` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `visibility` varchar(10) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by_id` bigint DEFAULT NULL,
  `profile_picture` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `community_forum_name_ad3cdfe2_uniq` (`name`),
  KEY `community_forum_created_by_id_14fa9069_fk_users_user_id` (`created_by_id`),
  CONSTRAINT `community_forum_created_by_id_14fa9069_fk_users_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_forum`
--

LOCK TABLES `community_forum` WRITE;
/*!40000 ALTER TABLE `community_forum` DISABLE KEYS */;
INSERT INTO `community_forum` VALUES (1,'dada','sdfghj','public','2025-03-03 20:14:21.414933',1,NULL),(2,'asdfghjkl','wertyuil','public','2025-03-03 22:48:45.552887',1,'forum_pictures/bio3.png'),(3,'wee','fghjkl','public','2025-03-04 00:38:53.802686',1,'forum_pictures/bio7.png'),(4,'KUKU JOINT','LETS EAT','public','2025-03-05 08:55:58.072312',1,'forum_pictures/bio5.png'),(5,'BARAKA LINKS','i have friend with same simptoms','public','2025-03-05 10:21:40.542601',1,'forum_pictures/bio4.png'),(6,'VIO8 COMPANY','Fesh Milk','public','2025-03-06 00:35:28.595677',1,'forum_pictures/bio3_Its4O9N.png'),(7,'WOMEN OF THE 80sts','ertyu','public','2025-03-11 09:46:58.202418',1,'forum_pictures/bio5_fRSjBmb.png'),(8,'THE SIX TRIPPLE EIGHT','These were the women who ..','public','2025-03-11 09:52:16.386212',40,'forum_pictures/bio5_lFfVPyJ.png'),(9,'LISA SCHOOLS','Like i said','public','2025-03-11 11:27:57.409806',40,'forum_pictures/bio4_AbuNQTv.png'),(10,'SISO SISTERS','thousand women are looking','public','2025-03-11 11:43:31.288110',40,''),(11,'ABC','ABC','public','2025-03-11 11:44:21.775645',40,'forum_pictures/bio5_9EKFo9I.png'),(12,'def','def','public','2025-03-11 11:52:44.272171',40,'forum_pictures/bio7_Bev8JJI.png'),(13,'SOLARSYSTEMS','In the beginning','public','2025-03-11 12:05:25.138057',40,'forum_pictures/bio4_PRoI8Bd.png'),(14,'THE SECRET FIVE','Still wondering what a world','public','2025-03-11 13:15:04.439373',40,'forum_pictures/bio5_Z4mJkKE.png');
/*!40000 ALTER TABLE `community_forum` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_forum_members`
--

DROP TABLE IF EXISTS `community_forum_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_forum_members` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `forum_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `community_forum_members_forum_id_user_id_88eeb8c1_uniq` (`forum_id`,`user_id`),
  KEY `community_forum_members_user_id_5ebe8552_fk_users_user_id` (`user_id`),
  CONSTRAINT `community_forum_members_forum_id_4a482f69_fk_community_forum_id` FOREIGN KEY (`forum_id`) REFERENCES `community_forum` (`id`),
  CONSTRAINT `community_forum_members_user_id_5ebe8552_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_forum_members`
--

LOCK TABLES `community_forum_members` WRITE;
/*!40000 ALTER TABLE `community_forum_members` DISABLE KEYS */;
INSERT INTO `community_forum_members` VALUES (1,1,40),(2,2,40),(5,3,40),(3,4,40),(4,5,40),(7,5,52),(9,6,39),(6,6,40),(8,6,52),(10,7,40),(14,10,40),(12,11,40),(11,13,40),(13,14,40);
/*!40000 ALTER TABLE `community_forum_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_post`
--

DROP TABLE IF EXISTS `community_post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_post` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `forum_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `community_post_forum_id_04e9770d_fk_community_forum_id` (`forum_id`),
  KEY `community_post_user_id_f2274853_fk_users_user_id` (`user_id`),
  CONSTRAINT `community_post_forum_id_04e9770d_fk_community_forum_id` FOREIGN KEY (`forum_id`) REFERENCES `community_forum` (`id`),
  CONSTRAINT `community_post_user_id_f2274853_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_post`
--

LOCK TABLES `community_post` WRITE;
/*!40000 ALTER TABLE `community_post` DISABLE KEYS */;
INSERT INTO `community_post` VALUES (12,'hey','realy','2025-03-05 11:51:34.348599',2,40),(13,'LOOKING GOOG','ERY WEELL','2025-03-05 11:52:15.188021',2,40),(16,'hola','still working','2025-03-06 00:28:42.877326',2,40),(17,'BABIES','Amazing beings but sturborn sometimes','2025-03-06 09:50:17.473183',2,40),(18,'LADIES HEALTH','As ladies we need to be as Hyginic as we can','2025-03-06 10:34:51.477046',2,40),(19,'LADIES','we need to take actions','2025-03-06 10:35:38.376434',2,40),(20,'RElay','i want these shoes','2025-03-11 13:01:29.757224',2,40),(21,'Babies','What do you think abot babies','2025-03-11 13:10:04.849056',2,40),(22,'Babies','What do you think','2025-03-11 13:13:12.853596',2,40),(23,'FRIENDS','abc','2025-03-11 14:49:50.318336',2,40);
/*!40000 ALTER TABLE `community_post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_post_likes`
--

DROP TABLE IF EXISTS `community_post_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_post_likes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `post_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `community_post_likes_post_id_user_id_7155e6ea_uniq` (`post_id`,`user_id`),
  KEY `community_post_likes_user_id_88523dbc_fk_users_user_id` (`user_id`),
  CONSTRAINT `community_post_likes_post_id_3dbbbf10_fk_community_post_id` FOREIGN KEY (`post_id`) REFERENCES `community_post` (`id`),
  CONSTRAINT `community_post_likes_user_id_88523dbc_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_post_likes`
--

LOCK TABLES `community_post_likes` WRITE;
/*!40000 ALTER TABLE `community_post_likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_post_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_content`
--

DROP TABLE IF EXISTS `content_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_content` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `file` varchar(100) NOT NULL,
  `content_type` varchar(10) NOT NULL,
  `uploaded_at` datetime(6) NOT NULL,
  `uploaded_by_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `content_content_uploaded_by_id_d5c7fb0d_fk_users_user_id` (`uploaded_by_id`),
  CONSTRAINT `content_content_uploaded_by_id_d5c7fb0d_fk_users_user_id` FOREIGN KEY (`uploaded_by_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_content`
--

LOCK TABLES `content_content` WRITE;
/*!40000 ALTER TABLE `content_content` DISABLE KEYS */;
INSERT INTO `content_content` VALUES (1,'books','asdfghjkl','uploads/content/bio3.png','document','2025-02-28 21:42:36.861212',34),(2,'books','asdfghjkl','uploads/content/bio3_FN3DLJX.png','document','2025-02-28 21:42:37.095690',34),(3,'books','asdfghjkl','uploads/content/bio3_Q1CrbtA.png','document','2025-02-28 21:44:56.605200',34),(4,'books','asdfghjkl','uploads/content/bio3_VYGeDri.png','document','2025-02-28 21:45:15.607867',34),(5,'books','asdfghjkl','uploads/content/bio3_20fStUz.png','document','2025-02-28 21:45:50.681042',34),(6,'books','asdfghjkl','uploads/content/bio3_tibSRVG.png','document','2025-02-28 21:45:52.910362',34),(7,'cans','gfdsa','uploads/content/bio7.png','document','2025-02-28 21:56:26.239307',34),(9,'cans','gfdsa','uploads/content/bio5.png','document','2025-02-28 21:57:19.607179',34),(11,'cans','gfdsa','uploads/content/bio5_xxlUXJq.png','document','2025-02-28 21:59:38.837464',34),(12,'cans','gfdsa','uploads/content/bio5_To651Qp.png','document','2025-02-28 21:59:41.519764',34),(13,'cans','gfdsa','uploads/content/bio5_jZtAsU1.png','document','2025-02-28 22:01:10.971485',34),(14,'jkl','fghj','uploads/content/bio5_rsYtf6B.png','document','2025-02-28 22:01:12.980539',34),(15,'cans','sdfghjk','uploads/content/bio5_a5FbWjz.png','image','2025-02-28 22:25:03.737082',34),(16,'dfghj','dfghjk','uploads/content/bio5_oawtOth.png','image','2025-02-28 22:25:08.320556',34),(17,'cans','sdfghjk','uploads/content/bio5_q4Q1vbc.png','image','2025-02-28 22:26:20.650541',34),(18,'cans','sdfghjk','uploads/content/bio5_YycwhOi.png','image','2025-02-28 22:26:23.131623',34),(19,'rtyu','sdfghj','uploads/content/bio7_iRYW9YT.png','document','2025-02-28 22:35:47.671016',34),(20,'rtyu','sdfghj','uploads/content/bio7_9Ro6iRb.png','document','2025-02-28 22:35:49.873002',34),(21,'rtyu','sdfghj','uploads/content/bio5_vrLDsy7.png','document','2025-02-28 22:38:12.539495',34),(22,'rtyu','sdfghj','uploads/content/bio5_qQqzje8.png','document','2025-02-28 22:38:16.081033',34),(23,'rtyu','sdfghj','uploads/content/bio5_0UdVLHI.png','document','2025-02-28 22:38:53.337020',34),(24,'rtyu','sdfghj','uploads/content/bio5_Aw6SbgG.png','document','2025-02-28 22:38:56.529438',34),(25,'rtyu','sdfghj','uploads/content/bio5_tvMmyuX.png','document','2025-02-28 22:42:33.127439',34),(26,'rtyu','sdfghj','uploads/content/bio5_6QWtFwp.png','document','2025-02-28 22:42:35.225183',34),(27,'rtyu','sdfghj','uploads/content/bio5_t0pGekG.png','document','2025-02-28 22:43:09.697946',34),(28,'rtyu','sdfghj','uploads/content/bio5_h24LFVK.png','document','2025-02-28 22:43:11.640599',34),(29,'rtyu','sdfghjk','uploads/content/bio5_COq8mYx.png','image','2025-02-28 22:43:34.291654',34),(31,'rtyu','sdfghjk','uploads/content/bio5_4i8RAp3.png','image','2025-02-28 22:44:58.153143',34),(32,'rtyu','sdfghjk','uploads/content/bio5_dgW8WoC.png','image','2025-02-28 22:45:00.706021',34),(33,'thanks','sdfghjk','uploads/content/baobab.png','image','2025-02-28 22:46:22.828049',34),(35,'thanks','sdfghjk','uploads/content/baobab_v1M7yLW.png','image','2025-02-28 22:49:11.170311',34),(37,'thanks','sdfghjk','uploads/content/bio5_XdqI9k2.png','image','2025-02-28 22:51:38.962524',34),(38,'thanks','sdfghjk','uploads/content/bio5_qEDAyW8.png','image','2025-02-28 22:51:41.130142',34),(39,'books','asdfghjk','uploads/content/bio5_2Uzwcsb.png','document','2025-02-28 22:56:38.198343',34),(40,'books','asdfghjk','uploads/content/bio5_MAE4gJY.png','document','2025-02-28 22:56:40.467675',34),(41,'gals','asdfghjk','uploads/content/bio7_znxVUW8.png','document','2025-02-28 22:57:27.332258',34),(42,'gals','asdfghjk','uploads/content/bio7_ysQesdJ.png','document','2025-02-28 22:57:29.720742',34),(43,'books','srtyu','uploads/content/bio5_5jrwCjy.png','video','2025-02-28 22:59:41.168093',34),(44,'books','srtyu','uploads/content/bio5_H7qmP2r.png','video','2025-02-28 22:59:43.175363',34),(45,'books','srtyu','uploads/content/bichem2.png','image','2025-02-28 23:00:18.053035',34),(46,'books','srtyu','uploads/content/bichem2_mQXk5lR.png','image','2025-02-28 23:00:21.672694',34),(47,'phones','3sdfghjk','uploads/content/bio6.png','video','2025-02-28 23:03:40.314095',34),(48,'phones','3sdfghjk','uploads/content/bio6_m0Gyc52.png','video','2025-02-28 23:03:42.742928',34),(49,'books','sdfghjkl;','uploads/content/bio6_6qiRgxE.png','video','2025-02-28 23:10:43.223393',34),(50,'dfghjk','asdfghjkl;\'','uploads/content/bio6_BfuDROY.png','video','2025-02-28 23:18:16.611233',34),(51,'dfghjk','asdfghjkl;\'','uploads/content/bio6_dUmojeM.png','video','2025-02-28 23:18:18.882894',34),(52,'wertyui','wfghjkl;','uploads/content/bio6_p4b0HhJ.png','video','2025-02-28 23:18:48.065318',34),(55,'Prayers','asdfghjkl;','uploads/content/bio7_d2Oo4Lb.png','document','2025-02-28 23:40:10.422886',34),(56,'exrcises','ertyuio','uploads/content/bio7_5spha5k.png','image','2025-03-01 00:06:00.546788',22),(58,'books','sdfghjkl','uploads/content/bio5_d09qGX4.png','video','2025-03-01 00:17:11.208957',22),(59,'dogs','dfghjkl','uploads/content/bio4_0qWUHoj.png','document','2025-03-01 00:18:05.760086',22),(60,'books','sdfghjk','uploads/content/bio6_qtTNAUO.png','video','2025-03-01 00:24:43.982471',22),(61,'werty','xcvbnm,.','uploads/content/bio5_dAITPaW.png','video','2025-03-01 00:33:48.398679',22),(62,'sdfghj','sdfghjkl','uploads/content/bio5_BqVCGU8.png','video','2025-03-01 00:38:02.839756',22),(63,'ducks','asdfghjkl','uploads/content/bio7_YQQhwfT.png','video','2025-03-01 00:40:52.971285',22),(64,'BABYS','Our babies are important to us','uploads/content/Africaa.png','video','2025-03-05 19:40:56.072730',40),(65,'phones','very wee','uploads/content/bio6_N4yd5vm.png','document','2025-03-05 19:41:56.106325',40),(66,'books','i am great','uploads/content/bio5_Vr0Hi8f.png','image','2025-03-05 21:40:52.794147',40),(67,'books','Amazing Resources you should try out','uploads/content/bio7_vhNjHbq.png','document','2025-03-08 13:46:42.992559',53),(69,'COOKS','QUALITY CATERING SERVICES','uploads/content/bio4_zc2ufll.png','image','2025-03-08 14:08:04.638849',52),(70,'BREASTFEEDING','Milk is a health and....','uploads/content/bio7_AxvuSEs.png','video','2025-03-10 21:49:40.574473',52),(71,'BREASTFEEDING','abc','uploads/content/InShot_20240318_182529880.mp4','video','2025-03-11 14:52:28.420145',52);
/*!40000 ALTER TABLE `content_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_users_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2025-02-21 17:24:52.622422','1','Admin',1,'[{\"added\": {}}]',3,3),(2,'2025-02-21 17:27:07.510217','2','Health Providers',1,'[{\"added\": {}}]',3,3),(3,'2025-02-21 17:28:19.209104','3','Mothers',1,'[{\"added\": {}}]',3,3),(4,'2025-02-26 11:00:17.613107','1','PENDA DADA',1,'[{\"added\": {}}]',12,3),(5,'2025-03-09 14:31:45.185092','2','Health Providers',2,'[{\"changed\": {\"fields\": [\"Permissions\"]}}]',3,50);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(18,'analytics','contentperformance'),(17,'analytics','forumactivity'),(21,'analytics','report'),(19,'analytics','smsusage'),(20,'analytics','useractivity'),(16,'appointments','appointment'),(3,'auth','group'),(2,'auth','permission'),(24,'community','comment'),(22,'community','forum'),(23,'community','post'),(8,'content','content'),(4,'contenttypes','contenttype'),(6,'mama','appointment'),(9,'mama','setting'),(5,'sessions','session'),(10,'sms','sms'),(15,'sms','smsmessage'),(11,'support','comment'),(12,'support','forum'),(14,'support','post'),(13,'support','supportgroup'),(7,'users','user');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-02-08 15:43:49.013439'),(2,'contenttypes','0002_remove_content_type_name','2025-02-08 15:43:49.516622'),(3,'auth','0001_initial','2025-02-08 15:43:51.181100'),(4,'auth','0002_alter_permission_name_max_length','2025-02-08 15:43:51.637012'),(5,'auth','0003_alter_user_email_max_length','2025-02-08 15:43:51.653013'),(6,'auth','0004_alter_user_username_opts','2025-02-08 15:43:51.669387'),(7,'auth','0005_alter_user_last_login_null','2025-02-08 15:43:51.707559'),(8,'auth','0006_require_contenttypes_0002','2025-02-08 15:43:51.721981'),(9,'auth','0007_alter_validators_add_error_messages','2025-02-08 15:43:51.737536'),(10,'auth','0008_alter_user_username_max_length','2025-02-08 15:43:51.758270'),(11,'auth','0009_alter_user_last_name_max_length','2025-02-08 15:43:51.774925'),(12,'auth','0010_alter_group_name_max_length','2025-02-08 15:43:51.823150'),(13,'auth','0011_update_proxy_permissions','2025-02-08 15:43:51.841416'),(14,'auth','0012_alter_user_first_name_max_length','2025-02-08 15:43:51.856165'),(15,'users','0001_initial','2025-02-08 15:43:53.665402'),(16,'admin','0001_initial','2025-02-08 15:43:54.348059'),(17,'admin','0002_logentry_remove_auto_add','2025-02-08 15:43:54.408980'),(18,'admin','0003_logentry_add_action_flag_choices','2025-02-08 15:43:54.460077'),(19,'mama','0001_initial','2025-02-08 15:43:54.588251'),(20,'sessions','0001_initial','2025-02-08 15:43:54.759118'),(21,'content','0001_initial','2025-02-21 17:54:06.647930'),(22,'mama','0002_setting_delete_appointment','2025-02-21 18:13:55.397368'),(23,'sms','0001_initial','2025-02-21 18:16:21.811840'),(24,'support','0001_initial','2025-02-21 18:34:47.522957'),(25,'sms','0002_smsmessage_delete_sms','2025-02-21 18:41:06.753745'),(26,'appointments','0001_initial','2025-02-21 18:47:24.030139'),(27,'analytics','0001_initial','2025-02-21 19:14:55.784736'),(28,'users','0002_user_age_user_profile_photo','2025-02-22 10:56:30.609565'),(29,'community','0001_initial','2025-03-01 09:20:05.337518'),(30,'users','0003_remove_user_is_healthcare_provider_user_role','2025-03-01 10:39:43.851125'),(31,'users','0004_alter_user_role','2025-03-02 17:23:20.625203'),(32,'community','0002_alter_forum_name_alter_forum_visibility_post_comment','2025-03-02 21:47:43.058302'),(33,'community','0003_forum_members','2025-03-03 02:17:59.789069'),(34,'community','0004_forum_created_by_forum_profile_picture','2025-03-03 20:33:40.619876'),(35,'appointments','0002_appointment_provider_appointment_rejection_reason_and_more','2025-03-10 00:23:06.931993'),(36,'appointments','0003_alter_appointment_status','2025-03-12 17:20:36.679245');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('hhskyx5jxce2csy6mhh669a15qhn5xo6','.eJxVjEEOwiAQRe_C2pAyZYC6dO8ZyMCAVA0kpV0Z765NutDtf-_9l_C0rcVvPS1-ZnEWozj9boHiI9Ud8J3qrcnY6rrMQe6KPGiX18bpeTncv4NCvXxrwGB11pQRDXDSSANFSmyYlTUWMqlpGoeQjXLRxAB2dJkQwLgEGlm8P_MWOAQ:1tnxVr:IWlvYki8vOawgHT9Qvnm3DX8C2dPCueedjeHRco_URs','2025-03-14 10:22:35.427601'),('i0yaqfz5e5tlpfuu06oaoxlz67xnq98k','.eJxVjEEOwiAQRe_C2pAyZYC6dO8ZyMCAVA0kpV0Z765NutDtf-_9l_C0rcVvPS1-ZnEWozj9boHiI9Ud8J3qrcnY6rrMQe6KPGiX18bpeTncv4NCvXxrwGB11pQRDXDSSANFSmyYlTUWMqlpGoeQjXLRxAB2dJkQwLgEGlm8P_MWOAQ:1tispg:p9BrltoyIKKxAG4-4HA7x4hFy463SHg_pRB6Ev7pTj4','2025-02-28 10:22:04.669403'),('nglrp6ihahtikywkzpav104ubiqy2vtk','.eJxVjEEOwiAQRe_C2pAyZYC6dO8ZyMCAVA0kpV0Z765NutDtf-_9l_C0rcVvPS1-ZnEWozj9boHiI9Ud8J3qrcnY6rrMQe6KPGiX18bpeTncv4NCvXxrwGB11pQRDXDSSANFSmyYlTUWMqlpGoeQjXLRxAB2dJkQwLgEGlm8P_MWOAQ:1tiaQ7:oSmhbDDsJCANNHZmU8bYa0sujA-uhdyzvRXsskaxOtw','2025-02-27 14:42:27.152601'),('uyzujjmli6acan1h2wpl900ztayysxk0','.eJxVjE0OwiAYBe_C2hBoSwGX7j0D-f6QqqFJaVfGu2uTLnT7Zua9VIJtLWlrsqSJ1Vk5o06_IwI9pO6E71Bvs6a5rsuEelf0QZu-zizPy-H-HRRo5VuLDeANsmULEoaBqUMzorUZxXfsrRCHmGOfqQ-enHGC0eSRIxFD8Or9ASr_OSo:1tpxnn:zKaY4-BGXFjRzwE8WTTUfXu9GvOjWk2Ryyb0wximJfQ','2025-03-19 23:05:23.012299'),('y517a6kc4owyrbgqtc3vojtzhncbjoa2','.eJxVjEEOwiAQRe_C2pAyZYC6dO8ZyMCAVA0kpV0Z765NutDtf-_9l_C0rcVvPS1-ZnEWozj9boHiI9Ud8J3qrcnY6rrMQe6KPGiX18bpeTncv4NCvXxrwGB11pQRDXDSSANFSmyYlTUWMqlpGoeQjXLRxAB2dJkQwLgEGlm8P_MWOAQ:1tgrnt:RdFIQn5Tkg_bW-d_ql35yCR1x4nZbPXs24NiQ2915TI','2025-02-22 20:51:53.286106');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mama_setting`
--

DROP TABLE IF EXISTS `mama_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mama_setting` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `language` varchar(10) NOT NULL,
  `dark_mode` tinyint(1) NOT NULL,
  `notifications` varchar(10) NOT NULL,
  `privacy` varchar(10) NOT NULL,
  `timezone` varchar(10) NOT NULL,
  `content_preferences` json NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `mama_setting_user_id_dec2c95a_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mama_setting`
--

LOCK TABLES `mama_setting` WRITE;
/*!40000 ALTER TABLE `mama_setting` DISABLE KEYS */;
/*!40000 ALTER TABLE `mama_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sms_smsmessage`
--

DROP TABLE IF EXISTS `sms_smsmessage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sms_smsmessage` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `recipient` varchar(20) NOT NULL,
  `message` longtext NOT NULL,
  `status` varchar(10) NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `sender_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sms_smsmessage_sender_id_1dfbbd6b_fk_users_user_id` (`sender_id`),
  CONSTRAINT `sms_smsmessage_sender_id_1dfbbd6b_fk_users_user_id` FOREIGN KEY (`sender_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sms_smsmessage`
--

LOCK TABLES `sms_smsmessage` WRITE;
/*!40000 ALTER TABLE `sms_smsmessage` DISABLE KEYS */;
/*!40000 ALTER TABLE `sms_smsmessage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_supportgroup`
--

DROP TABLE IF EXISTS `support_supportgroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_supportgroup` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_supportgroup`
--

LOCK TABLES `support_supportgroup` WRITE;
/*!40000 ALTER TABLE `support_supportgroup` DISABLE KEYS */;
/*!40000 ALTER TABLE `support_supportgroup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_supportgroup_members`
--

DROP TABLE IF EXISTS `support_supportgroup_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_supportgroup_members` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `supportgroup_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `support_supportgroup_mem_supportgroup_id_user_id_8c09351a_uniq` (`supportgroup_id`,`user_id`),
  KEY `support_supportgroup_members_user_id_a6fc61d9_fk_users_user_id` (`user_id`),
  CONSTRAINT `support_supportgroup_members_user_id_a6fc61d9_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`),
  CONSTRAINT `support_supportgroup_supportgroup_id_f43213c9_fk_support_s` FOREIGN KEY (`supportgroup_id`) REFERENCES `support_supportgroup` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_supportgroup_members`
--

LOCK TABLES `support_supportgroup_members` WRITE;
/*!40000 ALTER TABLE `support_supportgroup_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `support_supportgroup_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_user`
--

DROP TABLE IF EXISTS `users_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `age` int unsigned DEFAULT NULL,
  `profile_photo` varchar(100) DEFAULT NULL,
  `role` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `phone_number` (`phone_number`),
  CONSTRAINT `users_user_chk_1` CHECK ((`age` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_user`
--

LOCK TABLES `users_user` WRITE;
/*!40000 ALTER TABLE `users_user` DISABLE KEYS */;
INSERT INTO `users_user` VALUES (1,'',NULL,0,'dee@g','','','akinyiotieno364@gmail.com',0,1,'2025-02-08 16:04:24.841156','0751238234',NULL,NULL,'regular'),(2,'pbkdf2_sha256$870000$H21CpupfdDk5TxXNrMAutH$OD7L3JGYjkENP+hFzr6RrD0FPTb/mF7sdPPbkKFYuRk=',NULL,0,'testuser','','','test@example.com',0,1,'2025-02-08 19:57:02.041727','1234567890',NULL,NULL,'regular'),(3,'pbkdf2_sha256$870000$ElH1TfeUM43mapT1B4k3SS$Ea1lGXEU9Q7qE/Yh8koI2VYPtb18ZzGwkQaCdSFjgvM=','2025-02-28 10:22:35.393096',1,'lenovo','','','lenovo@gmail.com',1,1,'2025-02-08 20:51:38.538385',NULL,NULL,NULL,'regular'),(4,'pbkdf2_sha256$870000$1xbkl1QAsgO19sYqBeAqLf$RyJGhQ+nzM2wtRnaHJrStldW2AHxXLe2b0iiwvtOp7s=',NULL,0,'clinton','','','clinton@example.com',0,1,'2025-02-13 15:13:17.119176','0712345678',NULL,NULL,'regular'),(5,'pbkdf2_sha256$870000$zEWCdd3S7RKpd2CHisNNVa$djLz13wgTjKY1t9DzgaguUebhwy5BbcoeUHP/QERa0Y=',NULL,0,'milton','','','',0,1,'2025-02-14 09:12:14.229749',NULL,NULL,NULL,'regular'),(6,'pbkdf2_sha256$870000$YkQYjTOYmpL4NDL5wkgEt6$tGpPxeY3lj3szJ69QrEyBfCo1uPzDEvD2oLGx56Z8YY=',NULL,0,'diana','','','',0,1,'2025-02-14 10:09:20.843774',NULL,NULL,NULL,'regular'),(7,'pbkdf2_sha256$870000$AAGUVmwIu1sLlvMcMWDqtW$j36varmcGJ/buwpmmoX7ETHFwUhaMW+r5FduNPygebA=',NULL,0,'dana','','','',0,1,'2025-02-14 13:09:26.470983',NULL,NULL,NULL,'regular'),(8,'pbkdf2_sha256$870000$mOr117YO3e5HbRBDSrU2P2$pE02VL6lZyJ8kAlfvI/1uHdlXvJQkQV2/H8ISvAeOWg=',NULL,0,'testittuser','','','test@example.com',0,1,'2025-02-21 20:14:47.887786',NULL,NULL,NULL,'regular'),(9,'pbkdf2_sha256$870000$Nd6TlMZIdVbqU2OXhSXaRP$OP2fjfp9IAQ+6aeFlhiVv/1aICkjHQyjISighjPykWU=',NULL,0,'diaa','','','dia@gmail.com',0,1,'2025-02-21 21:11:41.804926',NULL,NULL,NULL,'regular'),(10,'pbkdf2_sha256$870000$WVpv2HP9CKCsQLnQNjsi5h$kumjc5aRwSOZVvrkXKGy+AwoQJZ3fc4ORrxXRAen5HI=',NULL,0,'di','','','di@gmail.com',0,1,'2025-02-21 21:25:01.549391','0751233234',NULL,NULL,'regular'),(11,'pbkdf2_sha256$870000$CBNpxk7GhMMsKKJvZvMdVP$4SgyDL4bR/jQRZXsANkb/PB2AEEohK65mfai9NmL/gs=',NULL,0,'lolo','','','lolo@gmail.com',0,1,'2025-02-21 21:30:11.906840','0741238234',NULL,NULL,'regular'),(12,'pbkdf2_sha256$870000$ubUTaqM4XuYATPkF8XBR9W$aaZO6kXaGEnnHchcvwWpiY8Kcq8ln2QST+ngO3Hvy1A=',NULL,0,'bin','','','bin@gmail.com',0,1,'2025-02-22 09:04:05.022023','0751230234',NULL,NULL,'regular'),(13,'pbkdf2_sha256$870000$ZCvK2tIdgDgGJFzf6CqIMP$+Mm2Y3Kep0Lu+Cy2/J9+l+MAlkjDBPoehkWxzPlsT/8=',NULL,0,'mama','','','mama@gmail.com',0,1,'2025-02-22 09:16:19.286896','0751238232',NULL,NULL,'regular'),(14,'pbkdf2_sha256$870000$81JUZmSu5aWg54WqO3DfkH$zidpSGTDwogdciUfsBcDTx8WIdqaXwViFMYlRThnbZI=',NULL,0,'too','','','too@gmail.com',0,1,'2025-02-22 09:20:57.408340','0751238230',NULL,NULL,'regular'),(15,'pbkdf2_sha256$870000$QaUpmU3GyWy8BAs68NE0DT$7bg/XyDXs+ZVrpubDxQ/dSVlSCFM4zwQFmf17TunErc=',NULL,0,'reg','','','reg@gmail.com',0,1,'2025-02-22 09:25:29.766539','0751238254',NULL,NULL,'regular'),(16,'pbkdf2_sha256$870000$Pxnd4ZjfAfgfOHmVlxyPMD$FvfFMYjR4KmWhoQbzZKAX57FN7E2guNiDxtaDO2vt34=',NULL,0,'mee','','','mee@gmail.com',0,1,'2025-02-22 09:31:19.642318','0751239234',NULL,NULL,'regular'),(17,'pbkdf2_sha256$870000$dh7G6Qr27RjuduwrUnh1NB$Q1uDRAGJrxyOHXQPqwmBOyrywa2mq6vAePWDIJjEGzg=',NULL,0,'abok','','','abok@gmail.com',0,1,'2025-02-22 09:41:32.361099','0751238239',NULL,NULL,'regular'),(18,'pbkdf2_sha256$870000$xISRnZUWDj0YFPRPlfBl1H$c+8Zjz0rZhH058xgRq5SzEIHICsvJ9kfZ1fSaAnCKxU=',NULL,0,'boy','','','boy@gmail.com',0,1,'2025-02-22 09:48:33.155352','0751238231',NULL,NULL,'regular'),(19,'pbkdf2_sha256$870000$3AxcVrBBHsv1NC71gtpv4D$VOYINO7NBuh6IwyovyTCfUnNb+MFCHDrB6g5JbsePf4=',NULL,0,'us','','','us@gmail.com',0,1,'2025-02-22 10:15:58.535069','0751238200',NULL,'profile_photos/baobab.png','regular'),(20,'pbkdf2_sha256$870000$tNvRRM0M2BXyy745KBgfcP$PdKzmuX/jWA+1Zc0xEUCQJbyRWw0KVqRXy32Y9USfI8=',NULL,0,'lol','','','lol@gmail.com',0,1,'2025-02-22 10:17:25.356020','0751238204',NULL,NULL,'regular'),(21,'pbkdf2_sha256$870000$6LC0acOtqhzjiB3IY7IxIq$Rt48AdTCS4JOUFX3RsCzxPlpvWpAeJM+w8heW+vn5O4=',NULL,0,'poo','','','poo@gmail.com',0,1,'2025-02-22 12:08:41.781136','0751238207',NULL,'profile_photos/bichem2.png','regular'),(22,'pbkdf2_sha256$870000$FZhcJEG0hdywRdGejsxjUK$YHGMSwD3obBIOepx5+UaZKTUBdYgLR8Mb/Xc3p31HeI=',NULL,0,'alu','','','alu@gmail.com',0,1,'2025-02-26 10:00:41.731667','0751238237',NULL,'','regular'),(23,'pbkdf2_sha256$870000$36kaPKBWLO0IJ47sqj9WB3$5trWKE/8GR4gcxjwEj8fVe0EKCCwy7mB/RW5MCviHv0=',NULL,0,'cat','','','cat@gmail.com',0,1,'2025-02-26 14:07:15.920649','0751238277',NULL,'','regular'),(24,'pbkdf2_sha256$870000$jDv53dCEkHDZURyDh0dvoU$FfBZth4dWyIgZFhCQGq5X4NyjiVGqUxWMACXK4Yhp2c=',NULL,0,'faith','','','faith@gmail.com',0,1,'2025-02-27 09:52:06.484672','0751238001',NULL,'','regular'),(25,'pbkdf2_sha256$870000$vohZrTeYTxaZdoBb3SrI9B$8iLmetqHdDplCDSMUArdPGi/CkDxExKZZer7KQtJsM4=',NULL,0,'fai','','','fai@gmail.com',0,1,'2025-02-27 10:03:59.721112','0751238009',NULL,'','regular'),(26,'pbkdf2_sha256$870000$mYUoW5a6oWf7t7Brq804vj$Y1kab+hoeolHKfY3GTb9URZjqPSiPldv6GhrHoiNpG8=',NULL,0,'fay','','','fay@gmail.com',0,1,'2025-02-27 15:20:04.878704','0751230000',NULL,'','regular'),(27,'pbkdf2_sha256$870000$Ju6gkb6T0V2DO5Og44s0XZ$C4Wkx0rfSemnCF8RwqhYmym0Ah1X5qfcFpoP9UGqSlQ=',NULL,0,'food','','','food@gmail.com',0,1,'2025-02-27 15:27:01.784895','0751230001',NULL,'','regular'),(28,'pbkdf2_sha256$870000$R85iOzNj9AYUVJfhX6SOZZ$MRVkPIPM6NeFWMnwhFjm1pPD4gHE4tEPCDTj6xb6LkA=',NULL,0,'lulu','','','lulu@gmail.com',0,1,'2025-02-27 17:46:54.535201','0755238234',NULL,'','regular'),(29,'pbkdf2_sha256$870000$UCC4KvGg0QhryeFyugSYot$2nSWluCNuAyhGirV0BQV8LZGPBA0BECaWdRFueQpeSM=',NULL,0,'maa','','','maa@gmail.com',0,1,'2025-02-27 21:35:02.903187','0751208234',NULL,'','regular'),(30,'pbkdf2_sha256$870000$oITom1KIsYBSsZqSYdPQyQ$+YtzkYqbMV83j2OGnWWQl/QnL8tZdtVDy23snLH9Vug=',NULL,0,'simi','','','simi@gmail.com',0,1,'2025-02-27 21:46:33.457157','0701238200',NULL,'','regular'),(31,'pbkdf2_sha256$870000$yKAbHyJ7qAcN43O3Zl98AC$gjbNuVOJHXlK/523VDOg5EiArnCZE+ByQfdG+mu9W5k=',NULL,0,'lan','','','lan@gmail.com',0,1,'2025-02-28 20:10:30.291628','0750238200',NULL,'','regular'),(32,'pbkdf2_sha256$870000$G367d2X1qqIW5QODqCvDJ4$mYh7WD8hCzBlTPEzuDszrmghO3Tweh4EKkzSg1LNf40=',NULL,0,'tom','','','tom@gmail.com',0,1,'2025-02-28 21:25:38.055416','0711238234',NULL,'','regular'),(33,'pbkdf2_sha256$870000$G9vGqEIPihAUDewXTHpU80$EbleLlefc2s7DZRkWYkA3CIj3zCg6Jbc6ChxW0NBB80=',NULL,0,'pin','','','pin@gmail.com',0,1,'2025-02-28 21:38:50.336690','0750238234',NULL,'','regular'),(34,'pbkdf2_sha256$870000$97uW2u6P7J2P4g075073Ph$LZNBndO0wqXk5ST1Uo88P7jP7sREAk+Wd29I08CHjmQ=',NULL,0,'oboke','','','oboke@gmail.com',0,1,'2025-02-28 21:42:05.806319','0751238229',NULL,'','regular'),(35,'pbkdf2_sha256$870000$3mScRBGj04dso0JYC1EZHP$XvdvmI9q2bxuJsldwOefnoYz1INkL6sdRT1cZ6Q8CHM=',NULL,0,'bol','','','bol@gmail.com',0,1,'2025-03-01 10:10:37.461639','0701238234',NULL,'','regular'),(36,'pbkdf2_sha256$870000$g0o8v3RVy58UwEIMsodwmi$C1uY4Ovc03LgK3OdL5EaP9z7LK/8lItdScUWqdhZwCY=',NULL,0,'yoyo','','','yoyo@gmail.com',0,1,'2025-03-01 20:40:17.047749','0711298234',NULL,'','admin'),(37,'pbkdf2_sha256$870000$ilTTA9bKsj6kf2Wn0USjT7$ryAQ9/YHORqEh7HkCP2SAOxOYZQlOgu1JWdx+EkJjXQ=',NULL,0,'ban','','','ban@gmail.com',0,1,'2025-03-01 21:09:32.077752','0751238222',NULL,'','healthcare_provider'),(38,'pbkdf2_sha256$870000$bS7WhaXqErtKk6IbvmN1Qo$YBA8v2nbBgM5v8E8RFOw9aIuxBWBjKGalmkuwlHxsm0=',NULL,0,'ama','','','mama@gmail.com',0,1,'2025-03-01 21:20:26.404705','0751008234',NULL,'','mom'),(39,'pbkdf2_sha256$870000$YTmGnVciERuWbLxA0NAPFt$r24rAJaPwNw7u8577gjMozMlPtLo/2gIVDbozK5R4H4=',NULL,0,'admin','','','admin@gmail.com',0,1,'2025-03-01 21:30:07.361111','0758008234',NULL,'','admin'),(40,'pbkdf2_sha256$870000$KGVbjzDZcYXi4Iqgng0RVQ$Gu+DJmwnKRiIyq5mHNSCscAR/PbD6+VDPWuFLHpXZ0I=',NULL,0,'salama','','','salama@gmail.com',0,1,'2025-03-02 16:14:54.816536','0759238234',NULL,'profile_photos/bio5.png','mom'),(41,'pbkdf2_sha256$870000$9rLXch4dronrlxDt6837Lh$PoQOa9ii1Cd+rFKabXzRlwL4FlI1EFjYTb5L54vZg3M=',NULL,0,'kaka','','','kaka@gmail.com',0,1,'2025-03-02 17:02:43.908760','0700238234',NULL,'','mom'),(42,'pbkdf2_sha256$870000$xzSIjuTJBGCn9IWKyp63J9$MVOV0aRnPbVex1dWVLqqwTkXiX4ICgTO8zgmP3/mQz8=',NULL,0,'salt','','','salt@gmail.com',0,1,'2025-03-02 17:18:43.027395','0701238230',NULL,'','mom'),(43,'pbkdf2_sha256$870000$Zdeh3kgNfNZuUlRUFKZFKC$Ld8SLs2chCCrDK/GrsLvQB3XJrTw/F50NXjWiQ4qz88=',NULL,0,'regna','','','reg@gmail.com',0,1,'2025-03-02 17:44:59.119682','1701238234',NULL,'','mom'),(44,'pbkdf2_sha256$870000$eWpClagD218iZPAKe3cmcR$v+Qgp1atT6TVLU3x/6zi5VHDlUgMJtYtkPu5DQ8HHeU=',NULL,0,'modi','','','modi@gmail.com',0,1,'2025-03-02 18:11:39.717404','1801238234',NULL,'','healthcare_provider'),(45,'pbkdf2_sha256$870000$ZDQjKhGznMoxSkw2Bo3scG$PCEQ7XgKUwwdWuapb815ap1bRutEEhkkHrm3XowlunY=',NULL,0,'doc','','','doc@gmail.com',0,1,'2025-03-02 18:21:12.994238','0801238234',NULL,'','healthcare_provider'),(47,'pbkdf2_sha256$870000$jChuC6VCNwnUyX1BzjHxC4$3SohOegNy1YP/LfZarePtYvRV1/Aj/l/n6pah2Ca6kE=',NULL,0,'opon','','','opon@gmail.com',0,1,'2025-03-02 18:31:09.786063','9801238234',NULL,'','admin'),(48,'pbkdf2_sha256$870000$wsaTuZBjY1etr6NkBl76IF$ht9UD7N7Y7WlWCVyDC4HX/Lrhygn58ruz+whtv3byHM=',NULL,0,'baby','','','baby@gmail.com',0,1,'2025-03-02 20:22:15.775553','0001238234',NULL,'','mom'),(49,'pbkdf2_sha256$870000$Xwcssx8dIH6G5uicx8Zw7g$5/hGmy7ho7Z15ytRhq8ktVA5HcgZ7FoakM/mFUtBy7c=',NULL,0,'denoh','','','ropdenis577@gmail.com',0,1,'2025-03-05 22:14:10.564791','0726677566',NULL,'','healthcare_provider'),(50,'pbkdf2_sha256$870000$d9Bkg5GoFq8x9hucmpsU4X$qHRNeqt2Ou7V3ignkm9n6cEQeLU1AnYeNbxqBm3REG8=','2025-03-05 23:05:22.963869',1,'dede','','','dede@gmail.com',1,1,'2025-03-05 23:03:52.752653',NULL,NULL,'','mom'),(51,'pbkdf2_sha256$870000$JTDCDuIIah1IaJ1fHrTVE4$korlvdmAdT5BEoT/bgclQqM8WZTJK9djPN5hiLoJW5U=',NULL,0,'dinah','','','ropdeni577@gmail.com',0,1,'2025-03-05 23:16:17.975409','0726670566',NULL,'','mom'),(52,'pbkdf2_sha256$870000$nDD71HCIXg2bD6QwqOGvNw$wBpaz4k4K4IXt+Ly5mhqOZhvyq3WISQYvEDR5AHt4LU=',NULL,0,'somo','','','somo@gmail.com',0,1,'2025-03-08 08:52:49.450409','0751238294',NULL,'profile_photos/bio7_e8YIKCs.png','healthcare_provider'),(53,'pbkdf2_sha256$870000$ZzvESHhRdj8tDK6Ilhcq1n$Jd9GsgvXxUIuPdAobWuAvdiBUXGAuc4fjIZU0ZVrNJs=',NULL,0,'tola','','','tola@gmail.com',0,1,'2025-03-08 09:27:38.030326','0759238294',NULL,'profile_photos/baobab_bSYPDK2.png','healthcare_provider'),(54,'pbkdf2_sha256$870000$70o4POljBYp1odsnIdKLFr$H8O3Pn/dv1M61b98PBz+sB6MVtKC2tfuQ/7aSMwM6W0=',NULL,0,'Susan','','','susan@gmail.com',0,1,'2025-03-10 23:59:19.160327','0759038294',NULL,'','mom');
/*!40000 ALTER TABLE `users_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_user_groups`
--

DROP TABLE IF EXISTS `users_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_user_groups_user_id_group_id_b88eab82_uniq` (`user_id`,`group_id`),
  KEY `users_user_groups_group_id_9afc8d0e_fk_auth_group_id` (`group_id`),
  CONSTRAINT `users_user_groups_group_id_9afc8d0e_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `users_user_groups_user_id_5f6f5a90_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_user_groups`
--

LOCK TABLES `users_user_groups` WRITE;
/*!40000 ALTER TABLE `users_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_user_user_permissions`
--

DROP TABLE IF EXISTS `users_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_user_user_permissions_user_id_permission_id_43338c45_uniq` (`user_id`,`permission_id`),
  KEY `users_user_user_perm_permission_id_0b93982e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `users_user_user_perm_permission_id_0b93982e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `users_user_user_permissions_user_id_20aca447_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_user_user_permissions`
--

LOCK TABLES `users_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `users_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-13 15:56:19
