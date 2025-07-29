type ShowSnackbarFn = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
export declare const handleCSVUpload: (event: React.ChangeEvent<HTMLInputElement>, showSnackbar: ShowSnackbarFn, onUploadComplete?: () => void, onProgress?: (progress: number) => void) => Promise<void>;
export {};
