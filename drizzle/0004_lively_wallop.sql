CREATE TABLE `time` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`description` integer NOT NULL,
	`hours` integer NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
