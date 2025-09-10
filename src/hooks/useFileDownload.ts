import { useState, useCallback } from 'react';

interface FileDownloadState {
    isLoading: boolean;
    error: string | null;
}

interface UseFileDownloadReturn {
    downloadFile: (path: string, filename?: string) => Promise<void>;
    openFile: (path: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

// Cache for file URLs to prevent duplicate API calls
class FileCache {
    private static cache = new Map<string, string>();
    private static pending = new Map<string, Promise<string>>();

    static get(path: string): string | null {
        return this.cache.get(path) || null;
    }

    static set(path: string, url: string): void {
        this.cache.set(path, url);
    }

    static async getOrFetch(path: string): Promise<string> {
        // Check cache first
        const cached = this.get(path);
        if (cached) return cached;

        // Check if already loading
        const existingPromise = this.pending.get(path);
        if (existingPromise) return existingPromise;

        // Start loading
        const promise = this.fetchFileUrl(path);
        this.pending.set(path, promise);

        try {
            const url = await promise;
            this.set(path, url);
            this.pending.delete(path);
            return url;
        } catch (error) {
            this.pending.delete(path);
            throw error;
        }
    }

    private static async fetchFileUrl(path: string): Promise<string> {
        try {
            const response = await fetch(
                `/api/files?path=${encodeURIComponent(path)}`
            );
            if (!response.ok) {
                throw new Error(`Failed to resolve file URL: ${response.statusText}`);
            }

            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error(`❌ Failed to fetch file URL for ${path}:`, error);
            throw error;
        }
    }
}

export const useFileDownload = (): UseFileDownloadReturn => {
    const [state, setState] = useState<FileDownloadState>({
        isLoading: false,
        error: null,
    });

    const downloadFile = useCallback(async (path: string, filename?: string) => {
        setState({ isLoading: true, error: null });

        try {
            // Get the file URL from our API
            const fileUrl = await FileCache.getOrFetch(path);

            if (process.env.NODE_ENV === 'development') {
                console.log(`📄 Downloading file from: ${fileUrl}`);
            }

            // Create a temporary anchor element to trigger download
            const link = document.createElement('a');
            link.href = fileUrl;

            // Set the download filename
            if (filename) {
                link.download = filename;
            } else {
                // Extract filename from path or URL
                const pathParts = path.split('/');
                const lastPart = pathParts[pathParts.length - 1];
                link.download = lastPart || 'download';
            }

            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setState({ isLoading: false, error: null });

            if (process.env.NODE_ENV === 'development') {
                console.log(`✅ File download initiated for: ${path}`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to download file';
            console.error(`❌ File download failed for ${path}:`, error);
            setState({ isLoading: false, error: errorMessage });
        }
    }, []);

    const openFile = useCallback(async (path: string) => {
        setState({ isLoading: true, error: null });

        try {
            // Get the file URL from our API
            const fileUrl = await FileCache.getOrFetch(path);

            if (process.env.NODE_ENV === 'development') {
                console.log(`📄 Opening file in new window: ${fileUrl}`);
            }

            // Open file in new window/tab
            const newWindow = window.open(fileUrl, '_blank', 'noopener,noreferrer');

            // Check if popup was blocked
            if (!newWindow) {
                throw new Error('Popup blocked. Please allow popups for this site to view the file.');
            }

            setState({ isLoading: false, error: null });

            if (process.env.NODE_ENV === 'development') {
                console.log(`✅ File opened in new window for: ${path}`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to open file';
            console.error(`❌ File open failed for ${path}:`, error);
            setState({ isLoading: false, error: errorMessage });
        }
    }, []);

    return {
        downloadFile,
        openFile,
        isLoading: state.isLoading,
        error: state.error,
    };
};
