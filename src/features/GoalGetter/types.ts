export interface PredefinedOption {
  Id: number;
  Name: string;
  Description?: string;
  Default_Image?: string;
  Icon: string;
}
export interface PredefinedOptionOptions {
  predefinedOptions: PredefinedOption[];
}
