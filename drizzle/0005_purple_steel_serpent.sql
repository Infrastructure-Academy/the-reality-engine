CREATE TABLE `media_catalogue` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(256) NOT NULL,
	`cdnUrl` text NOT NULL,
	`category` varchar(64) NOT NULL,
	`bridge` varchar(64) NOT NULL,
	`description` text,
	`blockRef` varchar(32),
	`tags` text,
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `media_catalogue_id` PRIMARY KEY(`id`)
);
