export interface Manuscript {
  _id: string;
  title: string;
  author?: string;
  category: string;
  createdAt: string;
  description: string;
  files: string[];
  language?: string;
  uploadType: "normal" | "detailed";
  isApproved?: boolean;
  uploadedBy?: string;
  keywords?: string[];
  isFeatured?: boolean;
}
     