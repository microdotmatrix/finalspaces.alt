export type ActionState = {
  error?: string;
  success?: boolean | string;
  [key: string]: any; // This allows for additional properties
};
