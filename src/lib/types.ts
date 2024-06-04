export interface Model {
    documentID: string;
    name: string;
    category: string;
    subtitle?: string;
    sections?: {
        name: string,
        entries: {
            key: string,
            value: string 
        }[] }[];
    bottom_text?: string;
    imageURL: string;
    videoURL?: string;
    glbURL?: string;
    usdzURL?: string;
    qrCodeURL?: string;

}

