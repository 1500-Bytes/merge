import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GlobeIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "../ai-elements/prompt-input";
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
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutateAsync: createMessage, isPending } = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        form.reset();
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({
            projectId,
          }),
        );
      },
      onError: (error) => {
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
    await createMessage({
      projectId: projectId,
      prompt: values.prompt,
    });
  };

  const isDisabled = isPending || !form.formState.isValid;

  return (
    <Form {...form}>
      <PromptInput onSubmit={form.handleSubmit(onSubmit)} className="bg-muted">
        <FormField
          disabled={isPending}
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem className="border-none">
              <FormControl>
                <PromptInputTextarea {...field} />
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
                    <PromptInputModelSelect
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <PromptInputModelSelectTrigger>
                        <PromptInputModelSelectValue />
                      </PromptInputModelSelectTrigger>
                      <PromptInputModelSelectContent>
                        {models.map((model) => (
                          <PromptInputModelSelectItem
                            key={model.value}
                            value={model.value}
                          >
                            {model.name}
                          </PromptInputModelSelectItem>
                        ))}
                      </PromptInputModelSelectContent>
                    </PromptInputModelSelect>
                  </FormControl>
                </FormItem>
              )}
            />
          </PromptInputTools>
          <PromptInputSubmit disabled={isDisabled} />
        </PromptInputToolbar>
      </PromptInput>
    </Form>
  );
}
