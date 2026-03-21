CREATE TABLE `bridge_sync_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bridge` varchar(64) NOT NULL,
	`syncType` varchar(64) NOT NULL,
	`status` enum('success','failed','partial') NOT NULL,
	`recordsFound` int DEFAULT 0,
	`recordsUpdated` int DEFAULT 0,
	`errorMessage` text,
	`responseData` json,
	`syncedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bridge_sync_log_id` PRIMARY KEY(`id`)
);
