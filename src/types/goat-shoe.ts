/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

const genders = ["men", "women", "youth", "infant"] as const;

const shoeConditions = ["new_no_defects", "used", "new_with_defects"] as const;

export type Gender = (typeof genders)[number];

export type ShoeCondition = (typeof shoeConditions)[number];

export const FiltersSchema = z.object({
  gender: z.enum(genders),
  condition: z.enum(shoeConditions),
});

export type Filters = z.infer<typeof FiltersSchema>;

export type GoatShoe = {
  // [key: string]: any | undefined;
  name: string;
  brand_name: string;
  // box_condition: BoxCondition | null,
  color: string;
  designer: string; // can be empty string
  details: string; // can be empty string
  gender: Gender[]; // often len 1
  grid_glow_picture_url: string; // has a glow around it
  grid_picture_url: string;
  original_picture_url: string;
  main_glow_picture_url: string;
  main_picture_url: string;
  has_picture: boolean;
  has_stock: boolean;
  has_under_retail_availability: boolean;
  id: number;
  is_fashion_product: boolean;
  is_raffle_product: boolean;
  is_under_retail: boolean;
  is_wantable: boolean;
  keywords: string[];
  //<editor-fold desc='lower_price_cents'>
  // can be 0
  retail_price_cents: number;
  retail_price_cents_eur: number;
  retail_price_cents_gbp: number;
  retail_price_cents_usd: number;
  //
  lowest_price_cents: number | null;
  lowest_price_cents_eur: number | null;
  lowest_price_cents_gbp: number | null;
  lowest_price_cents_usd: number | null;
  //
  instant_ship_lowest_price_cents: number | null;
  instant_ship_lowest_price_cents_eur: number | null;
  instant_ship_lowest_price_cents_gbp: number | null;
  instant_ship_lowest_price_cents_usd: number | null;
  //</editor-fold>
  midsole: string | null;
  nickname: string;
  objectID: string;
  release_date: string | null; // json date, need to parse
  release_date_name: string | null; // empty string?
  // release_month: number | null;
  // release_year: number | null;
  resellable: boolean;

  // sku: string;
  slug: string;
  search_sku: string;

  season: any | null;
  season_year: any | null;

  shoe_condition: ShoeCondition | null;
  silhouette: string;
  //<editor-fold desc='Size'>
  size: number | null;
  size_brand: string; // == brand_name.lowercase
  presentation_size: string; // number/number/empty string
  size_eu_infant: number | null;
  size_eu_men: number | null;
  size_eu_women: number | null;
  size_eu_youth: number | null;
  size_range: number[];
  size_uk_infant: number | null;
  size_uk_men: number | null;
  size_uk_women: number | null;
  size_uk_youth: number | null;
  size_us_infant: number | null;
  size_us_men: number | null;
  size_us_women: number | null;
  size_us_youth: number | null;
  //</editor-fold>
  special_display_price_cents: number; // can be 0
  status: string; // all 'active' ?
  upper_material: string | null; // can be empty string
};
