import { useProjectContext } from "@/context/projects-context";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatStatus } from "ai";
import { GlobeIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "../ai-elements/prompt-input";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem } from "../ui/form";

const models = [
  {
    name: "gpt-4.1",
    value: "openai/gpt-4.1",
  },
  {
    name: "gemini-2.5-flash",
    value: "google/gemini-2.5-flash",
  },
];

const formSchema = z.object({
  prompt: z
    .string()
    .min(1, { message: "Prompt is required" })
    .max(10000, { message: "Prompt is too long" }),
  model: z.string().min(1, { message: "Model is required" }).max(100),
  webSearch: z.boolean(),
});

type MessageFormProps = {
  projectId: string;
};

export function MessageForm({ projectId }: MessageFormProps) {
  const [status, setStatus] = useState<ChatStatus | undefined>();
  const { setGenerationError, selectedModal, setIsGeneratingContent } =
    useProjectContext();

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutateAsync: createMessage, isPending } = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        setIsGeneratingContent(false);
        form.reset();
        setStatus("submitted");
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({
            projectId,
          }),
        );
      },
      onError: (error) => {
        setIsGeneratingContent(false);
        setGenerationError(error.message);
        setStatus("error");
        console.error(error);
        toast.error("Failed to create message");
      },
    }),
  );

  const form = useForm<z.Infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      model: models[0].value,
      webSearch: false,
    },
  });

  const onSubmit = async (values: z.Infer<typeof formSchema>) => {
    setIsGeneratingContent(true);
    await createMessage({
      projectId: projectId,
      prompt: values.prompt,
    });
  };

  const isDisabled = isPending || !form.formState.isValid;

  return (
    <Form {...form}>
      <PromptInput
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-card/50 border border-border rounded-lg shadow-sm p-2"
      >
        <FormField
          disabled={isPending}
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem className="border-none">
              <FormControl>
                <PromptInputTextarea minHeight="24" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <PromptInputToolbar>
          <PromptInputTools>
            <FormField
              disabled={isPending}
              control={form.control}
              name="webSearch"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PromptInputButton
                      disabled={true}
                      variant={field.value ? "default" : "ghost"}
                      onClick={() => field.onChange(!field.value)}
                      className="text-foreground/70 hover:text-foreground"
                    >
                      <GlobeIcon size={16} />
                      <span>Search</span>
                    </PromptInputButton>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled={isPending}
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Button variant={"ghost"} disabled={true}>
                      {selectedModal}
                    </Button>
                  </FormControl>
                </FormItem>
              )}
            />
          </PromptInputTools>
          <PromptInputSubmit
            status={status}
            disabled={isDisabled}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          />
        </PromptInputToolbar>
      </PromptInput>
    </Form>
  );
}
