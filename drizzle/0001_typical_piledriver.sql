CREATE TABLE `characters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`fitsType` enum('senser','intuitive','thinker','feeler','balanced') NOT NULL,
	`abilityScores` json,
	`rollsRemaining` int DEFAULT 3,
	`level` int DEFAULT 1,
	`thesisTitle` varchar(256),
	`thesisProgress` int DEFAULT 0,
	`academicGrade` varchar(16),
	`perspectivePattern` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `characters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int,
	`guestId` varchar(64),
	`mode` enum('explorer','flight_deck','scholar') NOT NULL,
	`chatRole` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`relayContext` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dearden_nodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`relayNumber` int NOT NULL,
	`webName` varchar(64) NOT NULL,
	`label` varchar(128),
	`description` text,
	`xpValue` bigint DEFAULT 50000,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dearden_nodes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `discoveries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`relayId` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`description` text,
	`xpValue` bigint DEFAULT 10000,
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `discoveries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leaderboard` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`displayName` varchar(128),
	`mode` enum('explorer','flight_deck','scholar') NOT NULL,
	`totalXp` bigint DEFAULT 0,
	`relaysCompleted` int DEFAULT 0,
	`isGuru` boolean DEFAULT false,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leaderboard_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `node_activations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`nodeId` int NOT NULL,
	`activated` boolean DEFAULT false,
	`activatedAt` timestamp,
	CONSTRAINT `node_activations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `player_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`guestId` varchar(64),
	`mode` enum('explorer','flight_deck','scholar') NOT NULL,
	`displayName` varchar(128),
	`fitsType` enum('senser','intuitive','thinker','feeler','balanced'),
	`craftId` varchar(32),
	`totalXp` bigint DEFAULT 0,
	`bitPoints` bigint DEFAULT 0,
	`isGuru` boolean DEFAULT false,
	`currentRelay` int DEFAULT 1,
	`characterData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `player_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `relay_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`relayNumber` int NOT NULL,
	`discoveredItems` json,
	`completionPct` int DEFAULT 0,
	`xpEarned` bigint DEFAULT 0,
	`completedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `relay_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `relays` (
	`id` int AUTO_INCREMENT NOT NULL,
	`number` int NOT NULL,
	`name` varchar(64) NOT NULL,
	`subtitle` varchar(128),
	`emoji` varchar(8),
	`era` varchar(64),
	`quote` text,
	`quoteAuthor` varchar(128),
	`narrative` text,
	`missionObjective` text,
	`sagePath` text,
	`builderPath` text,
	`webType` varchar(32),
	`energy` varchar(64),
	`tier` varchar(32) DEFAULT 'student',
	`xpReward` bigint DEFAULT 0,
	`inventionCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `relays_id` PRIMARY KEY(`id`),
	CONSTRAINT `relays_number_unique` UNIQUE(`number`)
);
--> statement-breakpoint
CREATE TABLE `webs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(64) NOT NULL,
	`description` text,
	`color` varchar(16),
	`icon` varchar(8),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `webs_id` PRIMARY KEY(`id`),
	CONSTRAINT `webs_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `xp_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`amount` bigint NOT NULL,
	`source` varchar(64) NOT NULL,
	`sourceId` varchar(64),
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `xp_transactions_id` PRIMARY KEY(`id`)
);
