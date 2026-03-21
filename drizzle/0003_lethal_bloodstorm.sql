CREATE TABLE `agn_contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256),
	`phone` varchar(32),
	`displayName` varchar(256),
	`messageCount` int DEFAULT 0,
	`firstMessage` varchar(32),
	`lastMessage` varchar(32),
	`source` varchar(64) DEFAULT 'whatsapp_agn',
	`hasPlayed` boolean DEFAULT false,
	`linkedProfileId` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agn_contacts_id` PRIMARY KEY(`id`)
);
