import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crawler Workspace | Advanced Web Crawling Platform",
  description: "Advanced workspace for web crawling projects with real-time monitoring and data extraction",
  viewport: "width=device-width, initial-scale=1",
};

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 