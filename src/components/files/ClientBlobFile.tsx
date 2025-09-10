"use client";

import React, { ReactNode } from "react";
import { useFileDownload } from "@/hooks/useFileDownload";

interface ClientBlobFileProps {
  path: string;
  filename?: string;
  children: ReactNode;
  className?: string;
  mode?: "download" | "open"; // 'download' for download, 'open' for new window
  onDownloadStart?: () => void;
  onDownloadComplete?: () => void;
  onError?: (error: string) => void;
}

/**
 * ClientBlobFile component for downloading or opening files from Vercel blob storage
 *
 * Usage:
 * ```tsx
 * // Download file
 * <ClientBlobFile path="anleitung.pdf" filename="Anleitung.pdf" mode="download">
 *   <Button>Download PDF</Button>
 * </ClientBlobFile>
 *
 * // Open file in new window
 * <ClientBlobFile path="anleitung.pdf" mode="open">
 *   <Button>View PDF</Button>
 * </ClientBlobFile>
 * ```
 */
const ClientBlobFile: React.FC<ClientBlobFileProps> = ({
  path,
  filename,
  children,
  className = "",
  mode = "download", // Default to download mode
  onDownloadStart,
  onDownloadComplete,
  onError,
}) => {
  const { downloadFile, openFile, isLoading, error } = useFileDownload();

  const handleFileAction = async () => {
    try {
      if (onDownloadStart) {
        onDownloadStart();
      }

      if (mode === "open") {
        await openFile(path);
      } else {
        await downloadFile(path, filename);
      }

      if (onDownloadComplete) {
        onDownloadComplete();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `${mode === "open" ? "Open" : "Download"} failed`;
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
      onClick={handleFileAction}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleFileAction();
        }
      }}
      aria-label={`${mode === "open" ? "Open" : "Download"} ${filename || path}`}
    >
      {children}
      {isLoading && <span className="ml-2 inline-block animate-spin">⏳</span>}
    </div>
  );
};

export default ClientBlobFile;
