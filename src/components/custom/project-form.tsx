"use client";
import { AI_MODELS, suggestions } from "@/lib/constants";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GlobeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { AIProviderSelector } from "../ai-elements/ai-provider-selector";
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "../ai-elements/prompt-input";
import { Suggestion, Suggestions } from "../ai-elements/suggestion";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useState } from "react";
import { ChatStatus } from "ai";
import { useProjectContext } from "@/context/projects-context";

const formSchema = z.object({
  prompt: z
    .string()
    .min(1, { message: "Prompt is required" })
    .max(10000, { message: "Prompt is too long" }),
  model: z.string().min(1, { message: "Model is required" }).max(100),
  webSearch: z.boolean(),
});

export function ProjectForm() {
  const { isGeneratingContent, setSelectedModal, setIsGeneratingContent } =
    useProjectContext();
  const [status, setStatus] = useState<ChatStatus | undefined>();
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutateAsync: createProject, isPending } = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        setIsGeneratingContent(true);
        console.log({ "from project from": isGeneratingContent });
        setStatus("submitted");
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions({}));
        router.push(`/projects/${data.id}`);
      },
      onError: (error) => {
        setStatus("error");
        console.error(error);
        toast.error("Failed to create project");
      },
    }),
  );

  const handleSuggestionClick = (prompt: string) => {
    form.setValue("prompt", prompt, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const form = useForm<z.Infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      model: AI_MODELS[0].value, // Make this explicit
      webSearch: false,
    },
  });

  const onSubmit = async (values: z.Infer<typeof formSchema>) => {
    setSelectedModal(values.model);
    await createProject({
      prompt: values.prompt,
    });
    setStatus("submitted");
  };

  const isDisabled = isPending || !form.formState.isValid;
  return (
    <div className="flex flex-col items-center max-w-4xl gap-y-4">
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
                      <AIProviderSelector
                        isDisabled={isPending}
                        onModelChange={field.onChange}
                        selectedModel={field.value}
                      />
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
      <div className="mx-auto">
        <Suggestions className="flex flex-wrap gap-2 items-center justify-center w-full ">
          {suggestions.map((suggestion) => {
            const Icon = suggestion.Icon;
            return (
              <Suggestion
                onClick={handleSuggestionClick}
                className="text-xs"
                key={suggestion.title}
                suggestion={suggestion.prompt}
              >
                {Icon}
                <span>{suggestion.title}</span>
              </Suggestion>
            );
          })}
        </Suggestions>
      </div>
    </div>
  );
}
