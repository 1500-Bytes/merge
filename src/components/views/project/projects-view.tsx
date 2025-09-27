import { ProjectForm } from "@/components/custom/project-form";
import { AuroraText } from "@/components/magicui/aurora-text";

export function ProjectsView() {
  return (
    <div className="min-h-fit p-7">
      <div className="mt-30">
        <div className="flex flex-col gap-y-4 w-full">
          <div className="flex gap-y-6 flex-col max-w-3xl min-w-3xl mx-auto items-center">
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
              What can I help you{" "}
              <AuroraText>
                <span className="">Build?</span>
              </AuroraText>
            </h1>
            <ProjectForm />
          </div>
        </div>
      </div>
    </div>
  );
}
