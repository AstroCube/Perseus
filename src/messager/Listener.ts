export interface Listener {
    name: string;
    action: (message : any) => void;
}
