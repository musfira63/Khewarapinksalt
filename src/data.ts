/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProductItem, StrataRow, MineralItem, PricingCategory } from "./types";

// @ts-ignore
import polishedSphereLamp from "./assets/images/sphere_salt_lamp_glowing_1784464477760.jpg";
// @ts-ignore
import naturalCrystalLamp from "./assets/images/natural_crystal_lamp_1784461745552.jpg";
// @ts-ignore
import basketChunksLamp from "./assets/images/basket_chunks_lamp_1784463762402.jpg";
// @ts-ignore
import blackSaltImage from "./assets/images/black_salt_kala_namak_1784403526169.jpg";
// @ts-ignore
import culinaryPinkSaltImage from "./assets/images/culinary_salt_premium_organic_1784409616063.jpg";
// @ts-ignore
import bathBodySoakImage from "./assets/images/bath_body_soak_jar_1784720268597.jpg";
// @ts-ignore
import saltTilesAndBricksImage from "./assets/images/cooking_blocks_plates_1784465770731.jpg";
// @ts-ignore
import animalMineralLickImage from "./assets/images/animal_mineral_lick_1784404468543.jpg";
// @ts-ignore
import deodorantCrystalStonesImage from "./assets/images/deodorant_crystal_stones_1784460975197.jpg";
// @ts-ignore
import soleBrineStartersImage from "./assets/images/sole_brine_jar_active_1784466358992.jpg";
// @ts-ignore
import cylinderLampImage from "./assets/images/cylinder_salt_lamp_glowing_1784465192588.jpg";
// @ts-ignore
import saltInhalerImage from "./assets/images/salt_inhaler_ceramic_1784466691058.jpg";
// @ts-ignore
import massageStonesImage from "./assets/images/massage_stones_wellness_1784467086786.jpg";
// @ts-ignore
import usbSaltLampImage from "./assets/images/usb_salt_lamp_glowing_1784467574023.jpg";
// @ts-ignore
import moonSaltLampImage from "./assets/images/moon_salt_lamp_glowing_1784467978086.jpg";
// @ts-ignore
import coloredSaltLampImage from "./assets/images/colored_salt_lamp_glowing_1784486554960.jpg";
// @ts-ignore
import colorChangingLampImage from "./assets/images/color_changing_lamp_1784644638882.jpg";
// @ts-ignore
import wellnessGiftSetImage from "./assets/images/himalayan_gift_set_1784644657225.jpg";

export const STRATA_LAYERS: StrataRow[] = [
  {
    depth: "0 ft",
    title: "Surface deposits",
    desc: "Pale, coarse-grained salt near the entrance — used mostly for industrial and de-icing grades, not sold under Khewara.",
  },
  {
    depth: "150 ft",
    title: "First hand-cut seams",
    desc: "Miners begin hand-extraction here, following veins by torchlight. Color starts to shift toward a soft blush.",
  },
  {
    depth: "450 ft",
    title: "The crystal halls",
    desc: "Wide chambers where the oldest, most compressed salt sits — dense, translucent, and carrying the strongest mineral banding.",
  },
  {
    depth: "800 ft",
    title: "Khewara's selection",
    desc: "The deepest seams we buy from — hand-sorted crystal by crystal for the deep rose-pink tone that defines the brand.",
  },
];

export const MINERALS_LIST: MineralItem[] = [
  {
    pct: "97–99%",
    name: "Sodium chloride",
    desc: "The base compound — chemically the same salt as table salt, just left in its natural crystal form with zero anti-caking additives.",
  },
  {
    pct: "<1%",
    name: "Iron oxide",
    desc: "Responsible for the gorgeous rose-to-terracotta color range across our different seams and grades.",
  },
  {
    pct: "trace",
    name: "Calcium & magnesium",
    desc: "Naturally occurring minerals that give the crystal its texture and slightly rounded, less sharp culinary bite.",
  },
  {
    pct: "trace",
    name: "Potassium",
    desc: "Present in small amounts alongside dozens of other trace elements typical of subterranean mineral formations.",
  },
];

export const PRODUCTS_LIST: ProductItem[] = [
  {
    id: "culinary-salt",
    name: "Culinary Pink Salt",
    description: "Fine and coarse crystals. Hand-mined, unwashed and unbleached, with all natural trace minerals left intact.",
    category: "culinary",
    localPrice: "Rs 350 - 600",
    intlPrice: "$3.00 - $6.00",
    wholesalePrice: "Rs 60",
    wholesalePriceUsd: "$0.45",
    moq: "1 Metric Ton",
    specs: "1 kg retail pouch / 25 kg commercial sack",
    imageUrl: culinaryPinkSaltImage,
    iconType: "salt-pouch",
  },
  {
    id: "natural-lamp",
    name: "Natural Raw Chunks Lamp",
    description: "Authentic flared black iron basket packed with rough hand-mined rose-pink salt nuggets that glow like embers when lit.",
    category: "lamps",
    localPrice: "Rs 1,200 - 4,500",
    intlPrice: "$18.00 - $55.00",
    wholesalePrice: "Rs 450",
    wholesalePriceUsd: "$3.50",
    moq: "100 Units",
    specs: "Small (1-2kg) to Large (4-7kg) tiers",
    imageUrl: basketChunksLamp,
    iconType: "lamp-natural",
  },
  {
    id: "bath-soak",
    name: "Bath & Body Soak",
    description: "Coarse crystal blended with organic dried rose petals and neroli oil for an incredibly relaxing, mineral-rich bath.",
    category: "body",
    localPrice: "Rs 2,800 - 4,200",
    intlPrice: "$5.95 - $18.95",
    wholesalePrice: "Rs 950",
    wholesalePriceUsd: "$7.20",
    moq: "200 Jars",
    specs: "226–240g reusable glass jar",
    imageUrl: bathBodySoakImage,
    iconType: "bath-jar",
  },
  {
    id: "sphere-lamp",
    name: "Hand-Polished Sphere Lamp",
    description: "Perfectly turned and smoothed globes. Radiates a completely even, soothing warm pink glow when illuminated.",
    category: "lamps",
    localPrice: "Rs 3,500 - 6,500",
    intlPrice: "$45.00 - $75.00",
    wholesalePrice: "Rs 1,200",
    wholesalePriceUsd: "$9.50",
    moq: "50 Units",
    specs: "Diameter: 6 inches / Timber stand included",
    imageUrl: polishedSphereLamp,
    iconType: "lamp-sphere",
  },
  {
    id: "cylinder-lamp",
    name: "Modern Cylinder Lamp",
    description: "Sleek hand-polished cylindrical pillars displaying beautiful natural pink, peach, and orange crystalline mineral veins.",
    category: "lamps",
    localPrice: "Rs 3,000 - 10,000",
    intlPrice: "$18.00 - $22.00",
    wholesalePrice: "Rs 1,000 - 4,000",
    wholesalePriceUsd: "$18.00 - $22.00",
    moq: "50 Units",
    specs: "Small (6\"), Medium (8\"), and Large (10\") tiers available",
    imageUrl: cylinderLampImage,
    iconType: "lamp-cylinder",
  },
  {
    id: "usb-lamp",
    name: "USB Salt Lamp",
    description: "Handy, portable salt lamps powered by USB. Perfect for office desks, nightstands, or work setups to provide a relaxing, warm amber glow.",
    category: "lamps",
    localPrice: "Rs 2,000 - 5,500",
    intlPrice: "$20.00 - $55.00",
    wholesalePrice: "Rs 800 - 2,500",
    wholesalePriceUsd: "$8.00 - $25.00",
    moq: "100 Units",
    specs: "Includes USB Mini, Desk, LED, Premium, and Color-Changing tiers",
    imageUrl: usbSaltLampImage,
    iconType: "lamp-natural",
  },
  {
    id: "moon-lamp",
    name: "Color-Changing Moon Lamp",
    description: "Exquisite crescent moon-shaped salt lamps carved from premium pink salt crystals, equipped with multi-color LED configurations.",
    category: "lamps",
    localPrice: "Rs 5,000 - 8,500",
    intlPrice: "$35.00 - $65.00",
    wholesalePrice: "Rs 2,500 - 5,000",
    wholesalePriceUsd: "$20.00 - $45.00",
    moq: "50 Units",
    specs: "Includes Mini, Color-Changing, Premium LED, and Luxury Remote tiers",
    imageUrl: moonSaltLampImage,
    iconType: "lamp-sphere",
  },
  {
    id: "colored-lamp",
    name: "Color Changing Lamp",
    description: "Naturally hand-carved flame-shaped pink salt lamps emitting rich, vibrant custom-colored glow gradients of magenta, indigo, and violet.",
    category: "lamps",
    localPrice: "Rs 7,500 - 27,500",
    intlPrice: "$45.00 - $165.00",
    wholesalePrice: "Rs 3,750 - 13,750",
    wholesalePriceUsd: "$22.50 - $82.50",
    moq: "30 Units",
    specs: "Small (1–2 kg) to Premium XL (8–10 kg) sizes",
    imageUrl: colorChangingLampImage,
    iconType: "lamp-natural",
  },
  {
    id: "gift-set",
    name: "Wellness Gift Set",
    description: "An exquisitely curated, hand-packed gift collection featuring organic pink bath soak, pure massage stones, mineral sole starters, and premium culinary salt jars.",
    category: "body",
    localPrice: "Rs 7,500 - 38,500",
    intlPrice: "$55.00 - $250.00",
    wholesalePrice: "Rs 3,750 - 19,250",
    wholesalePriceUsd: "$27.50 - $125.00",
    moq: "10 Units",
    specs: "Includes Mini, Classic, Premium, Luxury, and Executive tiers",
    imageUrl: wellnessGiftSetImage,
    iconType: "gift",
  },
  {
    id: "black-salt",
    name: "Black Salt (Kala Namak)",
    description: "The sulfur-rich cousin of pink salt. Hand-ground and volcanic-baked for a distinctive tangy and earthy culinary twist.",
    category: "culinary",
    localPrice: "Rs 600 - 2,500",
    intlPrice: "$7.50 - $10.50",
    wholesalePrice: "Rs 180",
    wholesalePriceUsd: "$1.40",
    moq: "500 kg",
    specs: "100g to 1kg sizes available",
    imageUrl: blackSaltImage,
    iconType: "black-salt-pouch",
  },
  {
    id: "salt-tiles",
    name: "Cooking Blocks & Plates",
    description: "Premium hand-cut culinary blocks and grilling plates. Designed to impart rich minerals and delicate salt seasoning to your food.",
    category: "specialty",
    localPrice: "Rs 2,000 - 8,000",
    intlPrice: "$15.00 - $23.00",
    wholesalePrice: "Rs 800 - 3,500",
    wholesalePriceUsd: "$15.00 - $23.00",
    moq: "100 Units",
    specs: "Small (8\"x4\"x1\"), Medium (8\"x8\"x2\"), and Large (12\"x8\"x2\") tiers available",
    imageUrl: saltTilesAndBricksImage,
    iconType: "brick",
  },
  {
    id: "animal-licks",
    name: "Animal Mineral Licks",
    description: "Highly compressed mineral-rich blocks designed for livestock. Fitted with durable ropes for pasture hanging.",
    category: "industrial",
    localPrice: "Rs 900 - 3,000",
    intlPrice: "$4.99 - $14.99",
    wholesalePrice: "Rs 180",
    wholesalePriceUsd: "$1.35",
    moq: "500 Units",
    specs: "1 kg to 5 kg hanging blocks",
    imageUrl: animalMineralLickImage,
    iconType: "lick-rope",
  },
  {
    id: "deodorant-stone",
    name: "Deodorant Crystal Stones",
    description: "Completely natural, water-activated deodorant. Smoothed into an ergonomic bar that leaves a protective mineral veil.",
    category: "body",
    localPrice: "Rs 1,000 - 2,900",
    intlPrice: "$7.99 - $14.99",
    wholesalePrice: "Rs 280",
    wholesalePriceUsd: "$2.10",
    moq: "300 Units",
    specs: "60g to 180g naturally smoothed bars",
    imageUrl: deodorantCrystalStonesImage,
    iconType: "deodorant",
  },
  {
    id: "sole-starters",
    name: "Sole Brine Starters",
    description: "Highly saturated pure crystalline salt starters. Easily prepare mineral-rich, pure daily electrolyte brine in glass jars.",
    category: "body",
    localPrice: "Rs 450 - 2,200",
    intlPrice: "$8.00 - $30.00",
    wholesalePrice: "Rs 450 - 1,500",
    wholesalePriceUsd: "$8.00 - $20.00",
    moq: "100 Jars",
    specs: "Available in 250 ml, 500 ml, and 1 L glass jars",
    imageUrl: soleBrineStartersImage,
    iconType: "sole-jar",
  },
  {
    id: "salt-inhaler",
    name: "Salt Inhaler",
    description: "Ergonomic salt inhalation devices for natural dry-salt therapy. Refilled with organic Khewara pink salt crystals to soothe your respiratory system.",
    category: "body",
    localPrice: "Rs 3,500 - 4,500",
    intlPrice: "$35.00 - $45.00",
    wholesalePrice: "Rs 1,500 - 2,500",
    wholesalePriceUsd: "$15.00 - $25.00",
    moq: "100 Units",
    specs: "Available in Standard and Premium Ceramic tiers",
    imageUrl: saltInhalerImage,
    iconType: "wind",
  },
  {
    id: "massage-stones",
    name: "Therapeutic Massage Stones",
    description: "Smooth, hand-polished pink salt stones for hot/cold stone massage therapy. Perfect for muscle relaxation and spa-grade wellness rituals.",
    category: "body",
    localPrice: "Rs 1,500 - 7,500",
    intlPrice: "$18.00 - $75.00",
    wholesalePrice: "Rs 700 - 4,000",
    wholesalePriceUsd: "$8.00 - $40.00",
    moq: "50 Sets / Units",
    specs: "Available as individual stones (S, M, L) or curated 4-pc and 6-pc wellness sets",
    imageUrl: massageStonesImage,
    iconType: "gem",
  },
];

export const DETAIL_PRICING_CATALOG: PricingCategory[] = [
  {
    categoryTitle: "Fine Culinary Pink Salt",
    items: [
      { name: "Retail Bag (500 g)", localPrice: "Rs 200", intlPrice: "$1.99", wholesalePrice: "Rs 45", unit: "per bag", moq: "1,000 bags" },
      { name: "Standard Bag (1 kg)", localPrice: "Rs 350", intlPrice: "$3.00", wholesalePrice: "Rs 80", unit: "per bag", moq: "500 bags" },
      { name: "Bulk Catering Sack (25 kg)", localPrice: "Rs 6,500", intlPrice: "$35.00", wholesalePrice: "Rs 1,500", unit: "per sack", moq: "40 sacks (1 Ton)" },
    ],
  },
  {
    categoryTitle: "Cooking Blocks & Plates",
    items: [
      { name: "Small Cooking Block (8\"×4\"×1\")", localPrice: "Rs 2,000", intlPrice: "$15.00", wholesalePrice: "Rs 800", unit: "per block", moq: "100 blocks" },
      { name: "Medium Cooking Block (8\"×8\"×2\")", localPrice: "Rs 5,000", intlPrice: "$18.00", wholesalePrice: "Rs 2,000", unit: "per block", moq: "100 blocks" },
      { name: "Large Cooking Block (12\"×8\"×2\")", localPrice: "Rs 8,000", intlPrice: "$23.00", wholesalePrice: "Rs 3,500", unit: "per block", moq: "50 blocks" },
    ],
  },
  {
    categoryTitle: "Hand-Carved Lamps",
    items: [
      { name: "Small Natural Raw Chunks (1–2 kg)", localPrice: "Rs 1,200", intlPrice: "$18.00", wholesalePrice: "Rs 450", unit: "per unit", moq: "100 units" },
      { name: "Medium Natural Raw Chunks (2–4 kg)", localPrice: "Rs 2,500", intlPrice: "$35.00", wholesalePrice: "Rs 900", unit: "per unit", moq: "50 units" },
      { name: "Large Natural Raw Chunks (4–7 kg)", localPrice: "Rs 4,500", intlPrice: "$60.00", wholesalePrice: "Rs 1,600", unit: "per unit", moq: "30 units" },
      { name: "Polished Sphere (6\" diameter)", localPrice: "Rs 3,500", intlPrice: "$45.00", wholesalePrice: "Rs 1,200", unit: "per unit", moq: "50 units" },
      { name: "Small Modern Cylinder Lamp (6\" height)", localPrice: "Rs 3,000", intlPrice: "$18.00", wholesalePrice: "Rs 1,000", unit: "per unit", moq: "50 units" },
      { name: "Medium Modern Cylinder Lamp (8\" height)", localPrice: "Rs 7,000", intlPrice: "$20.00", wholesalePrice: "Rs 2,500", unit: "per unit", moq: "50 units" },
      { name: "Large Modern Cylinder Lamp (10\" height)", localPrice: "Rs 10,000", intlPrice: "$22.00", wholesalePrice: "Rs 4,000", unit: "per unit", moq: "50 units" },
      { name: "Pyramid Lamp (7\" height)", localPrice: "Rs 4,000", intlPrice: "$50.00", wholesalePrice: "Rs 1,400", unit: "per unit", moq: "50 units" },
      { name: "USB Mini Salt Lamp", localPrice: "Rs 2,000", intlPrice: "$20.00", wholesalePrice: "Rs 800", unit: "per unit", moq: "100 units" },
      { name: "USB Desk Salt Lamp", localPrice: "Rs 2,800", intlPrice: "$28.00", wholesalePrice: "Rs 1,200", unit: "per unit", moq: "100 units" },
      { name: "USB LED Salt Lamp", localPrice: "Rs 3,500", intlPrice: "$35.00", wholesalePrice: "Rs 1,600", unit: "per unit", moq: "100 units" },
      { name: "Premium USB Salt Lamp", localPrice: "Rs 4,500", intlPrice: "$45.00", wholesalePrice: "Rs 2,000", unit: "per unit", moq: "100 units" },
      { name: "Color-Changing USB Salt Lamp", localPrice: "Rs 5,500", intlPrice: "$55.00", wholesalePrice: "Rs 2,500", unit: "per unit", moq: "100 units" },
      { name: "Mini Moon Lamp", localPrice: "Rs 5,000", intlPrice: "$35.00", wholesalePrice: "Rs 2,500", unit: "per unit", moq: "50 units" },
      { name: "Color-Changing Moon Lamp", localPrice: "Rs 6,500", intlPrice: "$45.00", wholesalePrice: "Rs 3,200", unit: "per unit", moq: "50 units" },
      { name: "Premium LED Moon Lamp", localPrice: "Rs 7,500", intlPrice: "$55.00", wholesalePrice: "Rs 3,800", unit: "per unit", moq: "50 units" },
      { name: "Luxury Moon Lamp (Remote + Multi-Color)", localPrice: "Rs 8,500", intlPrice: "$65.00", wholesalePrice: "Rs 4,500", unit: "per unit", moq: "50 units" },
      { name: "Small Color Changing Lamp (1–2 kg)", localPrice: "Rs 7,500", intlPrice: "$45.00", wholesalePrice: "Rs 3,750", unit: "per unit", moq: "30 units" },
      { name: "Medium Color Changing Lamp (2–4 kg)", localPrice: "Rs 10,500", intlPrice: "$65.00", wholesalePrice: "Rs 5,250", unit: "per unit", moq: "30 units" },
      { name: "Large Color Changing Lamp (4–6 kg)", localPrice: "Rs 15,500", intlPrice: "$90.00", wholesalePrice: "Rs 7,750", unit: "per unit", moq: "30 units" },
      { name: "Extra Large Color Changing Lamp (6–8 kg)", localPrice: "Rs 20,500", intlPrice: "$125.00", wholesalePrice: "Rs 10,250", unit: "per unit", moq: "30 units" },
      { name: "Premium XL Color Changing Lamp (8–10 kg)", localPrice: "Rs 27,500", intlPrice: "$165.00", wholesalePrice: "Rs 13,750", unit: "per unit", moq: "30 units" },
    ],
  },
  {
    categoryTitle: "Wellness Gift Sets",
    items: [
      { name: "Mini Gift Set", localPrice: "Rs 7,500", intlPrice: "$55.00", wholesalePrice: "Rs 3,750", unit: "per set", moq: "10 sets" },
      { name: "Classic Gift Set", localPrice: "Rs 12,500", intlPrice: "$85.00", wholesalePrice: "Rs 6,250", unit: "per set", moq: "10 sets" },
      { name: "Premium Gift Set", localPrice: "Rs 18,500", intlPrice: "$125.00", wholesalePrice: "Rs 9,250", unit: "per set", moq: "10 sets" },
      { name: "Luxury Gift Set", localPrice: "Rs 27,500", intlPrice: "$175.00", wholesalePrice: "Rs 13,750", unit: "per set", moq: "10 sets" },
      { name: "Executive Gift Collection", localPrice: "Rs 38,500", intlPrice: "$250.00", wholesalePrice: "Rs 19,250", unit: "per set", moq: "5 sets" },
    ],
  },
  {
    categoryTitle: "Wellness & Bath",
    items: [
      { name: "Sole Brine Jar (250 ml)", localPrice: "Rs 450–700", intlPrice: "$8.00–12.00", wholesalePrice: "Rs 450", unit: "per jar", moq: "200 jars" },
      { name: "Sole Brine Jar (500 ml)", localPrice: "Rs 800–1,200", intlPrice: "$12.00–18.00", wholesalePrice: "Rs 800", unit: "per jar", moq: "150 jars" },
      { name: "Sole Brine Jar (1 L)", localPrice: "Rs 1,500–2,200", intlPrice: "$20.00–30.00", wholesalePrice: "Rs 1,500", unit: "per jar", moq: "100 jars" },
      { name: "Bath Scrub Jar (226 g)", localPrice: "Rs 2,800", intlPrice: "$5.95", wholesalePrice: "Rs 950", unit: "per jar", moq: "200 jars" },
      { name: "Standard Salt Inhaler", localPrice: "Rs 3,500", intlPrice: "$35.00", wholesalePrice: "Rs 1,500", unit: "per unit", moq: "100 units" },
      { name: "Premium Ceramic Salt Inhaler", localPrice: "Rs 4,500", intlPrice: "$45.00", wholesalePrice: "Rs 2,500", unit: "per unit", moq: "100 units" },
      { name: "Deodorant Stone (60g bar)", localPrice: "Rs 1,000", intlPrice: "$7.99", wholesalePrice: "Rs 280", unit: "per unit", moq: "300 units" },
      { name: "Small Massage Stone", localPrice: "Rs 1,500", intlPrice: "$18.00", wholesalePrice: "Rs 700", unit: "per stone", moq: "100 stones" },
      { name: "Medium Massage Stone", localPrice: "Rs 2,500", intlPrice: "$28.00", wholesalePrice: "Rs 1,200", unit: "per stone", moq: "80 stones" },
      { name: "Large Massage Stone", localPrice: "Rs 3,500", intlPrice: "$38.00", wholesalePrice: "Rs 1,800", unit: "per stone", moq: "50 stones" },
      { name: "Premium Massage Stone Set (4 pcs)", localPrice: "Rs 5,500", intlPrice: "$55.00", wholesalePrice: "Rs 2,800", unit: "per set", moq: "50 sets" },
      { name: "Luxury Massage Stone Set (6 pcs)", localPrice: "Rs 7,500", intlPrice: "$75.00", wholesalePrice: "Rs 4,000", unit: "per set", moq: "30 sets" },
    ],
  },
  {
    categoryTitle: "Construction & Agricultural",
    items: [
      { name: "Salt Brick (8\"×4\"×2\")", localPrice: "Rs 1,500", intlPrice: "$10.99", wholesalePrice: "Rs 320", unit: "per brick", moq: "250 bricks" },
      { name: "Salt Tile (8\"×8\"×1\")", localPrice: "Rs 2,000", intlPrice: "$14.99", wholesalePrice: "Rs 450", unit: "per tile", moq: "200 tiles" },
      { name: "Livestock Lick (2 kg with Rope)", localPrice: "Rs 1,500", intlPrice: "$7.99", wholesalePrice: "Rs 360", unit: "per unit", moq: "200 units" },
      { name: "Livestock Lick Block (10 kg)", localPrice: "Rs 5,500", intlPrice: "$24.99", wholesalePrice: "Rs 1,450", unit: "per unit", moq: "100 units" },
    ],
  },
];
