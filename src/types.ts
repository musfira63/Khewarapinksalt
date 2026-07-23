/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CustomerSegment = "local" | "intl" | "wholesale";

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  category: "culinary" | "lamps" | "body" | "specialty" | "industrial";
  localPrice: string; // e.g. "Rs 350 - 600"
  intlPrice: string; // e.g. "$3.00 - $6.00"
  wholesalePrice: string; // e.g. "Rs 60 / kg"
  wholesalePriceUsd: string; // e.g. "$0.45 / kg"
  moq: string; // e.g. "1 Metric Ton" or "50 units"
  specs: string; // e.g. "1kg bag" or "Small size (1-2kg)"
  imageUrl?: string;
  iconType: string;
}

export interface StrataRow {
  depth: string;
  title: string;
  desc: string;
}

export interface MineralItem {
  pct: string;
  name: string;
  desc: string;
}

export interface PricingCategory {
  categoryTitle: string;
  items: {
    name: string;
    localPrice: string;
    intlPrice: string;
    wholesalePrice: string;
    unit: string;
    moq: string;
  }[];
}

