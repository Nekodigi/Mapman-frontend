export type DCategory =
  | "info"
  | "note"
  | "ticket"
  | "record"
  | "fun"
  | "others";
export type DType = "text" | "image" | "audio";

export type Document = {
  name: string;
  Category: DCategory;
  link?: string;
  type: DType;
  status: status;
};
