import prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";

import { useEffect } from "react";
import "./code-theme.css";

type CodePreviewProps = {
  lang: string;
  code: string;
};
export function CodePreview({ lang, code }: CodePreviewProps) {
  useEffect(() => {
    prism.highlightAll();
  }, [lang, code]);

  return (
    <pre className="p-2 bg-transparent border-none rounded-none text-sm whitespace-pre overflow-x-auto">
      <code className={`lang-${lang}`}>{code}</code>
    </pre>
  );
}
