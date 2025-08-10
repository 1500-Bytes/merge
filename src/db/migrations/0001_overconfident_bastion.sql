ALTER TABLE "fragment" RENAME TO "fragments";--> statement-breakpoint
ALTER TABLE "message" RENAME TO "messages";--> statement-breakpoint
ALTER TABLE "fragments" DROP CONSTRAINT "fragment_message_id_unique";--> statement-breakpoint
ALTER TABLE "fragments" DROP CONSTRAINT "fragment_message_id_message_id_fk";
--> statement-breakpoint
ALTER TABLE "fragments" ADD CONSTRAINT "fragments_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fragments" ADD CONSTRAINT "fragments_message_id_unique" UNIQUE("message_id");