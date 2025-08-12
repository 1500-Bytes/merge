ALTER TABLE "fragments" RENAME TO "fragment";--> statement-breakpoint
ALTER TABLE "messages" RENAME TO "message";--> statement-breakpoint
ALTER TABLE "projects" RENAME TO "project";--> statement-breakpoint
ALTER TABLE "users" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "fragment" DROP CONSTRAINT "fragments_message_id_unique";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "fragment" DROP CONSTRAINT "fragments_message_id_messages_id_fk";
--> statement-breakpoint
ALTER TABLE "message" DROP CONSTRAINT "messages_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "fragment" ADD CONSTRAINT "fragment_message_id_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fragment" ADD CONSTRAINT "fragment_message_id_unique" UNIQUE("message_id");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");