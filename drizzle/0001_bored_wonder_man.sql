ALTER TABLE `user` ADD `github_id` text;--> statement-breakpoint
ALTER TABLE `user` ADD `username` text;--> statement-breakpoint
CREATE UNIQUE INDEX `user_github_id_unique` ON `user` (`github_id`);