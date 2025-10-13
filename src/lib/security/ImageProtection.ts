/**
 * Image Protection Utilities
 * Provides watermarking, canvas-based protection, and download prevention
 */

export interface WatermarkOptions {
    text: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    opacity?: number;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    margin?: number;
}

export interface ProtectionOptions {
    enableWatermark?: boolean;
    watermarkOptions?: WatermarkOptions;
    preventRightClick?: boolean;
    preventDragDrop?: boolean;
    preventSelection?: boolean;
    replaceWithCanvas?: boolean;
}

export class ImageProtection {
    private static defaultWatermarkOptions: Required<WatermarkOptions> = {
        text: '© NEST-Haus',
        fontSize: 24,
        fontFamily: 'Arial, sans-serif',
        color: 'rgba(255, 255, 255, 0.7)',
        opacity: 0.7,
        position: 'bottom-right',
        margin: 20,
    };

    /**
     * Add watermark to image using canvas
     */
    static async addWatermark(
        imageUrl: string,
        options: WatermarkOptions = {}
    ): Promise<string> {
        const config = { ...this.defaultWatermarkOptions, ...options };

        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            if (!ctx) {
                reject(new Error('Canvas context not available'));
                return;
            }

            img.onload = () => {
                try {
                    canvas.width = img.width;
                    canvas.height = img.height;

                    // Draw original image
                    ctx.drawImage(img, 0, 0);

                    // Configure text style
                    ctx.font = `${config.fontSize}px ${config.fontFamily}`;
                    ctx.fillStyle = config.color;
                    ctx.globalAlpha = config.opacity;

                    // Calculate text position
                    const textMetrics = ctx.measureText(config.text);
                    const textWidth = textMetrics.width;
                    const textHeight = config.fontSize;

                    let x: number, y: number;

                    switch (config.position) {
                        case 'top-left':
                            x = config.margin;
                            y = config.margin + textHeight;
                            break;
                        case 'top-right':
                            x = canvas.width - textWidth - config.margin;
                            y = config.margin + textHeight;
                            break;
                        case 'bottom-left':
                            x = config.margin;
                            y = canvas.height - config.margin;
                            break;
                        case 'bottom-right':
                            x = canvas.width - textWidth - config.margin;
                            y = canvas.height - config.margin;
                            break;
                        case 'center':
                            x = (canvas.width - textWidth) / 2;
                            y = (canvas.height + textHeight) / 2;
                            break;
                        default:
                            x = canvas.width - textWidth - config.margin;
                            y = canvas.height - config.margin;
                    }

                    // Draw watermark text
                    ctx.fillText(config.text, x, y);

                    // Reset alpha
                    ctx.globalAlpha = 1;

                    resolve(canvas.toDataURL('image/jpeg', 0.9));
                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };

            // Handle CORS for external images
            img.crossOrigin = 'anonymous';
            img.src = imageUrl;
        });
    }

    /**
     * Replace image element with protected canvas
     */
    static async replaceImageWithCanvas(
        imgElement: HTMLImageElement,
        options: ProtectionOptions = {}
    ): Promise<HTMLCanvasElement> {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('Canvas context not available');
        }

        // Set canvas dimensions
        canvas.width = imgElement.naturalWidth || imgElement.width;
        canvas.height = imgElement.naturalHeight || imgElement.height;
        canvas.style.width = imgElement.style.width || `${imgElement.width}px`;
        canvas.style.height = imgElement.style.height || `${imgElement.height}px`;

        // Copy image classes and attributes
        canvas.className = imgElement.className;
        canvas.id = imgElement.id;

        // Draw image to canvas
        if (options.enableWatermark && options.watermarkOptions) {
            // Create watermarked version
            const watermarkedDataUrl = await this.addWatermark(imgElement.src, options.watermarkOptions);
            const watermarkedImg = new Image();

            return new Promise((resolve, reject) => {
                watermarkedImg.onload = () => {
                    ctx.drawImage(watermarkedImg, 0, 0);
                    resolve(canvas);
                };
                watermarkedImg.onerror = reject;
                watermarkedImg.src = watermarkedDataUrl;
            });
        } else {
            // Draw original image
            ctx.drawImage(imgElement, 0, 0);
            return canvas;
        }
    }

    /**
     * Apply comprehensive protection to image elements
     */
    static protectImages(
        selector: string = 'img.protected',
        options: ProtectionOptions = {}
    ): void {
        const defaultOptions: ProtectionOptions = {
            enableWatermark: true,
            watermarkOptions: this.defaultWatermarkOptions,
            preventRightClick: true,
            preventDragDrop: true,
            preventSelection: true,
            replaceWithCanvas: true,
        };

        const config = { ...defaultOptions, ...options };

        // Find all images to protect
        const images = document.querySelectorAll(selector) as NodeListOf<HTMLImageElement>;

        images.forEach(async (img) => {
            try {
                // Replace with canvas if enabled
                if (config.replaceWithCanvas) {
                    const canvas = await this.replaceImageWithCanvas(img, config);
                    img.parentNode?.replaceChild(canvas, img);
                }

                // Apply event-based protections
                if (config.preventRightClick) {
                    this.preventRightClick(img);
                }

                if (config.preventDragDrop) {
                    this.preventDragDrop(img);
                }

                if (config.preventSelection) {
                    this.preventSelection(img);
                }
            } catch (error) {
                console.error('Failed to protect image:', error);
            }
        });
    }

    /**
     * Prevent right-click context menu
     */
    static preventRightClick(element: HTMLElement): void {
        element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    }

    /**
     * Prevent drag and drop
     */
    static preventDragDrop(element: HTMLElement): void {
        element.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();
            return false;
        });

        // Make element non-draggable
        element.setAttribute('draggable', 'false');
    }

    /**
     * Prevent text/image selection
     */
    static preventSelection(element: HTMLElement): void {
        element.style.userSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitTouchCallout = 'none';
        element.style.webkitTapHighlightColor = 'transparent';

        element.addEventListener('selectstart', (e) => {
            e.preventDefault();
            return false;
        });
    }

    /**
     * Apply global protection styles
     */
    static applyGlobalProtectionStyles(): void {
        const style = document.createElement('style');
        style.textContent = `
      .protected-content {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
      }

      .protected-content img {
        pointer-events: none;
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
      }

      .protected-image {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
        pointer-events: none;
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
      }
    `;
        document.head.appendChild(style);
    }

    /**
     * Initialize global image protection
     */
    static initialize(options: ProtectionOptions = {}): void {
        // Apply global styles
        this.applyGlobalProtectionStyles();

        // Protect existing images
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.protectImages('img.protected', options);
            });
        } else {
            this.protectImages('img.protected', options);
        }

        // Protect dynamically added images
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLElement) {
                        const images = node.querySelectorAll('img.protected') as NodeListOf<HTMLImageElement>;
                        if (images.length > 0) {
                            this.protectImages('img.protected', options);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
}

