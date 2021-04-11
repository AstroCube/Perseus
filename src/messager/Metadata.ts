export interface Metadata {
    headers: Headers[];
    messageId: string;
    appId: string;
    instanceId: string;
    timestamp: Date;
}

export interface Message<T> {
    metadata: Metadata;
    message: T;
}

export interface Headers {
    string: string;
    object: any;
}
