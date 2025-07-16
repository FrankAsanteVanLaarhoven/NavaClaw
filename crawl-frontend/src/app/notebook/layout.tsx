import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DataBricks Notebook | Advanced Data Analysis Platform",
  description: "Collaborative notebook environment for data science, machine learning, and analytics with web crawler integration",
  viewport: "width=device-width, initial-scale=1",
};

export default function NotebookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 