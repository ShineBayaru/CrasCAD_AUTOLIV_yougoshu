export enum Category {
  GENERAL = '一般',
  ALJ_SPECIALIZED = 'ALJ専門',
  TOYOTA_TERMS = 'トヨタ用語',
  OTHER = 'その他',
  RESIN_MOLDING = '樹脂成型',
  RESIN_MOLD = '樹脂金型',
  DESIGN_SPECIALIZED = '設計専門',
}

export interface EditRecord {
  editedBy: string;
  editedAt: string;
}

export interface Term {
  id: number;           // Mapped from "мэдээж дугаарлалт"
  term: string;         // 語句
  reading: string;      // 読み方 (Furigana)
  alias?: string;       // 通称 (Optional)
  english: string;      // 英語
  meaning: string;      // 意味
  categories: Category[];   // Changed from single category to array of categories
  
  // Media
  imageUrl?: string;
  
  // Audit Trail
  createdBy?: string;
  createdAt?: string;
  history?: EditRecord[];
}