-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: אוגוסט 05, 2023 בזמן 12:05 PM
-- גרסת שרת: 10.6.12-MariaDB-cll-lve
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u836564938_vacationdb`
--

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `followers`
--

CREATE TABLE `followers` (
  `user_id` int(11) NOT NULL,
  `vacation_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `followers`
--

INSERT INTO `followers` (`user_id`, `vacation_id`) VALUES
(10, 10),
(11, 1),
(11, 6),
(11, 9),
(11, 11),
(11, 12),
(11, 15),
(11, 16),
(11, 18),
(11, 21),
(11, 50),
(11, 52),
(19, 1),
(19, 2),
(19, 4),
(19, 5),
(19, 21),
(19, 27),
(19, 28),
(19, 29),
(19, 33),
(19, 50),
(19, 52),
(27, 5),
(27, 50),
(27, 52),
(28, 1),
(28, 4),
(28, 24),
(28, 28),
(28, 32),
(28, 34),
(28, 50),
(30, 1),
(30, 11),
(30, 17),
(30, 33),
(30, 50);

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('regular','admin') DEFAULT 'regular'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `role`) VALUES
(10, 'Admin', 'User', 'admin.user@gmail.com', '123456', 'admin'),
(11, 'Liron', 'Avraham', 'liron.avraham@gmail.com', '123456', 'regular'),
(19, 'lili', 'lili', 'liron@mail.com', '123456', 'regular'),
(25, 'Ola', 'Sinilov', 'ola@mail.com', '123456', 'regular'),
(27, 'asia', 'davidov', 'asia@mail.com', '123456', 'regular'),
(28, 'rotem', 'levi', 'ashts@walla.com', '123456', 'regular'),
(30, 'Ron', 'Sharon', 'Ron.Sharon@mail.com', '123456', 'regular');

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `vacations`
--

CREATE TABLE `vacations` (
  `vacation_id` int(11) NOT NULL,
  `vacation_destination` varchar(100) NOT NULL,
  `vacation_description` text DEFAULT NULL,
  `vacation_start` date NOT NULL,
  `vacation_end` date NOT NULL,
  `price` decimal(10,2) NOT NULL CHECK (`price` >= 0 and `price` <= 10000),
  `vacation_image_file_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `vacations`
--

INSERT INTO `vacations` (`vacation_id`, `vacation_destination`, `vacation_description`, `vacation_start`, `vacation_end`, `price`, `vacation_image_file_name`) VALUES
(1, 'Paris', 'A romantic vacation in Paris', '2023-08-10', '2023-08-20', '2000.00', 'paris.jpg'),
(2, 'Rome', 'A historical tour of Rome', '2023-08-15', '2023-08-25', '1800.00', 'rome.jpg'),
(3, 'Sydney', 'A relaxing vacation in Sydney', '2023-08-18', '2023-08-28', '2500.00', 'sydney.jpg'),
(4, 'Tokyo', 'Experience the culture of Tokyo', '2023-09-01', '2023-09-11', '2200.00', 'tokyo.jpg'),
(5, 'New York', 'A city tour of New York', '2023-09-05', '2023-09-15', '2300.00', 'newyork.jpg'),
(6, 'London', 'A royal tour of London', '2023-09-10', '2023-09-20', '2100.00', 'london.jpg'),
(7, 'Cairo', 'Explore the pyramids of Cairo', '2023-09-15', '2023-09-25', '1500.00', 'cairo.jpg'),
(8, 'Rio de Janeiro', 'Enjoy the beaches of Rio', '2023-09-18', '2023-09-28', '1700.00', 'rio.jpg'),
(9, 'Los Angeles', 'A Hollywood vacation in LA', '2023-09-20', '2023-09-30', '2400.00', 'la.jpg'),
(10, 'Berlin', 'A cultural tour of Berlin', '2023-10-01', '2023-10-11', '1900.00', 'berlin.jpg'),
(11, 'Bangkok', 'Explore the city of Bangkok', '2023-10-05', '2023-10-15', '1600.00', 'bangkok.jpg'),
(12, 'Copenhagen', 'A cool vacation in Copenhagen', '2023-10-10', '2023-10-20', '2200.00', 'copenhagen.jpg'),
(15, 'Amsterdam', 'Experience the charm of Amsterdam', '2023-10-15', '2023-10-25', '1900.00', 'amsterdam.jpg'),
(16, 'Dubai', 'Explore the modern city of Dubai', '2023-10-20', '2023-10-30', '2500.00', 'dubai.jpg'),
(17, 'Athens', 'A historical tour of Athens', '2023-11-01', '2023-11-11', '1800.00', 'athens.jpg'),
(18, 'Barcelona', 'Enjoy the vibrant city of Barcelona', '2023-11-05', '2023-11-15', '2100.00', 'barcelona.jpg'),
(19, 'Venice', 'A romantic trip to Venice', '2023-11-10', '2023-11-20', '2200.00', 'venice.jpg'),
(20, 'Madrid', 'Experience the lively culture of Madrid', '2023-11-25', '2023-12-05', '2100.00', 'madrid.jpg'),
(21, 'Istanbul', 'Explore the historic city of Istanbul', '2023-12-01', '2023-12-11', '1900.00', 'istanbul.jpg'),
(22, 'Vienna', 'Enjoy the music and art in Vienna', '2023-12-10', '2023-12-20', '2200.00', 'vienna.jpg'),
(23, 'Prague', 'Experience the architectural beauty of Prague', '2023-12-15', '2024-01-01', '2000.00', 'prague.jpg'),
(24, 'Lisbon', 'Explore the coastal city of Lisbon', '2024-01-05', '2024-01-15', '1900.00', 'lisbon.jpg'),
(25, 'Budapest', 'A cultural tour of Budapest', '2024-01-10', '2024-01-20', '1800.00', 'budapest.jpg'),
(26, 'Helsinki', 'A cool vacation in Helsinki', '2024-01-15', '2024-01-25', '2000.00', 'helsinki.jpg'),
(27, 'Warsaw', 'Experience the historical city of Warsaw', '2024-01-20', '2024-02-01', '1800.00', 'warsaw.jpg'),
(28, 'Dublin', 'Enjoy the vibrant city life in Dublin', '2024-01-25', '2024-02-05', '1900.00', 'dublin.jpg'),
(29, 'Oslo', 'Explore the natural beauty of Oslo', '2024-02-01', '2024-02-11', '2100.00', 'oslo.jpg'),
(30, 'Stockholm', 'A cultural tour of Stockholm', '2024-02-10', '2024-02-20', '2200.00', 'stockholm.jpg'),
(31, 'Zurich', 'Experience the high living standards in Zurich', '2024-02-15', '2024-02-25', '2300.00', 'zurich.jpg'),
(32, 'Brussels', 'Taste the finest chocolates in Brussels', '2024-02-20', '2024-03-02', '2000.00', 'brussels.jpg'),
(33, 'Munich', 'Enjoy the beer culture in Munich', '2024-02-25', '2024-03-07', '2200.00', 'munich.jpg'),
(34, 'Edinburgh', 'Explore the historic city of Edinburgh', '2024-03-01', '2024-03-11', '2100.00', 'edinburgh.jpg'),
(50, 'Israel', 'A romantic vacation in Israel', '2023-08-13', '2023-09-21', '1500.00', 'Israel.jpg'),
(52, 'Hawaii', 'A relaxing vacation in Hawaii', '2023-08-02', '2023-09-02', '2500.00', 'Hawaii.jpg'),
(53, 'Jordan', 'A relaxing vacation in Jordan', '2023-08-17', '2023-09-12', '6500.00', 'Jordan.jpg');

--
-- Indexes for dumped tables
--

--
-- אינדקסים לטבלה `followers`
--
ALTER TABLE `followers`
  ADD PRIMARY KEY (`user_id`,`vacation_id`),
  ADD KEY `vacation_id` (`vacation_id`);

--
-- אינדקסים לטבלה `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- אינדקסים לטבלה `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`vacation_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `vacation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- הגבלות לטבלאות שהוצאו
--

--
-- הגבלות לטבלה `followers`
--
ALTER TABLE `followers`
  ADD CONSTRAINT `followers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `followers_ibfk_2` FOREIGN KEY (`vacation_id`) REFERENCES `vacations` (`vacation_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
