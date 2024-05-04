export interface Description {
  key: string;
  value: string;
}

export interface Model {
  bottom_text: string;
  description: Description[];
  functioning: Description[];
  libraryName: string;
  name: string;
  subtitle: string;
}