export type UrlType = {
  id: number;
  alias: string;
  domain: string;
  original_url: string;
  click_count?: number;
  user_id: number;
  analytics_enabled?: boolean;
  created_at?: string;
  short_url?: string;
  description: string;
};

export type UrlInputType = {
  short_url?: string;
  description: string;
  user_id: number;
  analytics_enabled?: boolean;
  alias: string;
  domain: string;
  original_url: string;
}