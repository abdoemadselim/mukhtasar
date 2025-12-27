import { Request } from "express";

export type UrlType = {
  id: number;
  alias: string;
  domain: string;
  original_url: string;
  user_id: number;
  analytics_enabled?: boolean;
  created_at?: string;
  short_url?: string;
  description: string;
  qr_purpose_only?: boolean;
  has_qr?: boolean;
};

export type UrlInputType = {
  short_url?: string;
  description: string;
  user_id: number;
  analytics_enabled?: boolean;
  alias: string;
  domain: string;
  original_url: string;
  qr_purpose_only?: boolean;
  has_qr?: boolean;
}

export interface IRequest extends Request {
  user?: {
    id: number
  }
}
