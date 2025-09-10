"use client";

import React, { ReactNode } from "react";
import { useFileDownload } from "@/hooks/useFileDownload";

interface ClientBlobFileProps {
  path: string;
  filename?: string;
  children: ReactNode;
  className?: string;
  onDownloadStart?: () => void;
  onDownloadComplete?: () => void;
  onError?: (error: string) => void;
}

/**
 * ClientBlobFile component for downloading files from Vercel blob storage
 *
 * Usage:
 * ```tsx
 * <ClientBlobFile path="anleitung.pdf" filename="Anleitung.pdf">
 *   <Button>Download PDF</Button>
 * </ClientBlobFile>
 * ```
 */
const ClientBlobFile: React.FC<ClientBlobFileProps> = ({
  path,
  filename,
  children,
  className = "",
  onDownloadStart,
  onDownloadComplete,
  onError,
}) => {
  const { downloadFile, isLoading, error } = useFileDownload();

  const handleDownload = async () => {
    try {
      if (onDownloadStart) {
        onDownloadStart();
      }

      await downloadFile(path, filename);

      if (onDownloadComplete) {
        onDownloadComplete();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Download failed";
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  // Show error state if there's an error
  if (error && onError) {
    onError(error);
  }

  return (
    <div
      className={`cursor-pointer ${isLoading ? "opacity-50 pointer-events-none" : ""} ${className}`}
      onClick={handleDownload}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleDownload();
        }
      }}
      aria-label={`Download ${filename || path}`}
    >
      {children}
      {isLoading && <span className="ml-2 inline-block animate-spin">⏳</span>}
    </div>
  );
};

export default ClientBlobFile;
