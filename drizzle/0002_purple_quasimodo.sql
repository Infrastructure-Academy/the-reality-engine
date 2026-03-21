CREATE TABLE `challenge_invites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(16) NOT NULL,
	`senderProfileId` int NOT NULL,
	`senderName` varchar(128),
	`senderArchetype` varchar(128),
	`senderXp` bigint DEFAULT 0,
	`senderRelays` int DEFAULT 0,
	`message` text,
	`acceptedBy` int,
	`acceptedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `challenge_invites_id` PRIMARY KEY(`id`),
	CONSTRAINT `challenge_invites_code_unique` UNIQUE(`code`)
);
