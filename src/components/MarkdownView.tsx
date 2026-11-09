import React, { useMemo } from 'react';
import { marked } from 'marked';

interface MarkdownViewProps {
  content: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  const html = useMemo(() => {
    try {
      // Configure marked for clean, safe rendering
      marked.setOptions({
        gfm: true,
        breaks: true,
      });
      return marked.parse(content) as string;
    } catch (e) {
      return content;
    }
  }, [content]);

  return (
    <div
      className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm md:text-base
        [&>h3]:text-base [&>h3]:md:text-lg [&>h3]:font-bold [&>h3]:text-sky-950 [&>h3]:mt-3 [&>h3]:mb-2
        [&>h4]:text-sm [&>h4]:md:text-base [&>h4]:font-semibold [&>h4]:text-sky-900 [&>h4]:mt-2 [&>h4]:mb-1
        [&>ul]:my-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5
        [&>ol]:my-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5
        [&>li]:text-slate-700
        [&>p]:my-2
        [&>blockquote]:border-l-4 [&>blockquote]:border-sky-500 [&>blockquote]:bg-sky-50/70 [&>blockquote]:py-1.5 [&>blockquote]:px-3 [&>blockquote]:rounded-r-lg [&>blockquote]:my-2.5 [&>blockquote]:text-sky-900
        [&>table]:w-full [&>table]:my-3 [&>table]:border-collapse [&>table]:text-xs [&>table]:md:text-sm
        [&>table_th]:bg-sky-100/80 [&>table_th]:text-sky-900 [&>table_th]:font-semibold [&>table_th]:p-2 [&>table_th]:border [&>table_th]:border-sky-200
        [&>table_td]:p-2 [&>table_td]:border [&>table_td]:border-sky-100
        [&_strong]:font-semibold [&_strong]:text-slate-900
        [&_code]:bg-sky-50 [&_code]:text-sky-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-xs
        [&_a]:text-sky-600 [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-sky-800"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
