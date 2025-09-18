interface Manuscript {
  _id: string;
  title: string;
  description: string;
  category: string;
  language: string;
  period: string;
  author: string;
  keywords: string[];
  files: string[];
  uploadType: 'normal' | 'detailed';
  uploadedBy: string;

  // Optional fields used in detail page
  status?: string;
  submittedBy?: string;
  images?: string[]; // for carousel
}
