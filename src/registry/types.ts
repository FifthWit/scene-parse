export type HandlerConfig = {
  field: string;
  regex: RegExp | string;
  type: "string" | "number" | "boolean" | "string[]" | "number[]";
  priority?: number;
  description?: string;
  postProcess?: (match: RegExpMatchArray) => unknown;
};

export type RegisteredHandler = HandlerConfig & {
  id: string;
  createdAt: Date;
};
