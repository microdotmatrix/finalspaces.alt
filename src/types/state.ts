export type ActionState = {
  result?: number | number[];
  error?: string;
  success?: string;
  [key: string]: any; // This allows for additional properties
};
