"use client";

import { ProjectForm } from "@/components/custom/project-form";
import { Highlighter } from "@/components/magicui/highlighter";

function Page() {
  return (
    <div className="min-h-screen p-7">
      {/*input area*/}
      <div className="mt-50">
        <div className="flex flex-col gap-y-4 w-full">
          <div className="flex gap-y-6 flex-col max-w-3xl min-w-3xl mx-auto items-center">
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
              What can I help you{" "}
              <Highlighter color="#FF1616" action="highlight">
                Build?
              </Highlighter>
            </h1>
            <ProjectForm />
          </div>
        </div>
      </div>
      {/*favourite projects*/}
    </div>
  );
}

export default Page;
