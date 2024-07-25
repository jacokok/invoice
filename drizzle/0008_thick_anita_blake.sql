CREATE TABLE `user_detail` (
	`user_id` text PRIMARY KEY NOT NULL,
	`invoice_number` integer NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`contact_number` text NOT NULL,
	`address` text NOT NULL,
	`bank_name` text NOT NULL,
	`bank_account_number` text NOT NULL,
	`bank_branch_code` text NOT NULL,
	`bank_holder_name` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
