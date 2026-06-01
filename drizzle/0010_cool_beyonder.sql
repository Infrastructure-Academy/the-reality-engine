CREATE TABLE `fire_card_responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`profileId` int NOT NULL,
	`cardNumber` int NOT NULL,
	`cardGroup` varchar(32) NOT NULL,
	`cardName` varchar(128) NOT NULL,
	`responseType` enum('comparison','empathy_choice','creative_connection','ranking','isi_assessment') NOT NULL,
	`responseValue` json,
	`isCorrect` boolean,
	`axisContribution` enum('I','E','C') NOT NULL,
	`pointsEarned` int DEFAULT 0,
	`timeTakenMs` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fire_card_responses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fire_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`iScore` float,
	`eScore` float,
	`cScore` float,
	`hScore` float,
	`seesawRatio` float,
	`seesawState` enum('body_heavy','balanced','mind_heavy'),
	`fireFitsType` enum('senser','intuitive','thinker','feeler','balanced'),
	`cardsCompleted` int DEFAULT 0,
	`totalCards` int DEFAULT 48,
	`sessionDurationSec` int,
	CONSTRAINT `fire_sessions_id` PRIMARY KEY(`id`)
);
