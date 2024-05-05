export interface Description {
    key: string;
    value: string;
}

export interface Model {
    documentID: string;
    bottom_text?: string;
    description?: Description[];
    functioning?: Description[];
    libraryName?: string;
    name?: string;
    subtitle?: string;
    imageURL?: string; // URL or reference to the image file
    videoURL?: string; // URL or reference to the video file
}