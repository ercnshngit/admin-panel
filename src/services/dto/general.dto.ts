export interface GeneralDto {
  id: number;
  title: string;
  description?: string;
  slug: string;
  group?: string;
  image?: string;
  href?: string;
  button?: string;
  language_code?: string;
  status: number;
}
