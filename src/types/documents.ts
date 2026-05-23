export type TemplateType = 'ID_CARD' | 'LEAVING_CERTIFICATE' | 'CHARACTER_CERTIFICATE';

export interface Template {
  id: number;
  name: string;
  type: TemplateType;
  config: any;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateIDCardsDto {
  studentIds: number[];
  templateId?: number;
}

export interface GenerateCertificateDto {
  studentId: number;
  templateId?: number;
  type: TemplateType;
  date?: string;
  issueNumber?: string;
}
