CREATE TABLE `player_decisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`relayNumber` int NOT NULL,
	`choiceId` varchar(64) NOT NULL,
	`choiceLabel` varchar(256) NOT NULL,
	`dilemmaTitle` varchar(256) NOT NULL,
	`archetype` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `player_decisions_id` PRIMARY KEY(`id`)
);
