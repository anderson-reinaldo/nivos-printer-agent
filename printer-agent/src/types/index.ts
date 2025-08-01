export interface Printer {
    id: string;
    name: string;
    status: 'online' | 'offline' | 'error';
}

export interface PrintJob {
    jobId: string;
    printerId: string;
    documentName: string;
    pages: number;
    status: 'pending' | 'printing' | 'completed' | 'failed';
}

export interface User {
    userId: string;
    username: string;
    email: string;
}