type PageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

async function Page({ params }: PageProps) {
  const { projectId } = await params;

  return <div>Project {projectId}</div>;
}

export default Page;
