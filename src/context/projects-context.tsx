"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type ProjectContextType = {
  isGenerationError: string | null;
  selectedModal: string;
  isCreatingProject: boolean;
  isGeneratingContent: boolean;
  setSelectedModal: (modal: string) => void;
  setIsCreatingProject: (creating: boolean) => void;
  setIsGeneratingContent: (generating: boolean) => void;
  setGenerationError: (error: string | null) => void;
};

const ProjectContext = createContext<ProjectContextType | null>(null);

type ProjectProviderProps = {
  children: ReactNode;
};

const ProjectContextProvider = ({ children }: ProjectProviderProps) => {
  const [selectedModal, setSelectedModal] = useState<string>("");
  const [isCreatingProject, setIsCreatingProject] = useState<boolean>(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState<boolean>(false);
  const [isGenerationError, setGenerationError] = useState<string | null>(null);

  const contextValue = {
    isGenerationError,
    selectedModal,
    isCreatingProject,
    isGeneratingContent,
    setSelectedModal,
    setIsCreatingProject,
    setIsGeneratingContent,
    setGenerationError,
  };

  return (
    <ProjectContext.Provider value={contextValue}>{children}</ProjectContext.Provider>
  );
};

const useProjectContext = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectContextProvider");
  }
  return context;
};

export { ProjectContextProvider, useProjectContext };
