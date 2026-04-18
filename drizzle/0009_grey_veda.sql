CREATE TABLE `igo_interest` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`name` varchar(256),
	`email` varchar(320),
	`interestRole` enum('player','educator','institution','sponsor','backer','other') NOT NULL,
	`organisation` varchar(256),
	`message` text,
	`appPreRegister` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `igo_interest_id` PRIMARY KEY(`id`)
);
