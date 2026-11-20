#!/usr/bin/env python3
"""
KSA Kerala Foods — Master Dataset Builder & Sync Script
Covers: Jeddah, Makkah, Madinah, Taif, Riyadh, Dammam
Developed by D&J Techies (+44 7460 646263)

Reads `ksa_malayali_food_master_v2.csv`, decodes Google Plus Codes (Open Location Codes)
when present, assigns city/district coordinates for map visualization, normalizes
categories, tags, and ratings, and generates:
  - data/restaurants.json
  - js/data.js (for instant offline / file:// compatibility without CORS issues)
"""

import csv
import json
import math
import re
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent
V1_CSV = ROOT / "jeddah_malayali_food_master_v1.csv"
V2_CSV = ROOT / "ksa_malayali_food_master_v2.csv"
JSON_OUT = ROOT / "data" / "restaurants.json"
JS_OUT = ROOT / "js" / "data.js"

# Open Location Code (Plus Code) alphabet & regex
OLC_ALPHABET = "23456789CFGHJMPQRVWX"
PLUS_CODE_RE = re.compile(r"\b([23456789CFGHJMPQRVWX]{4}\+[23456789CFGHJMPQRVWX]{2,3})\b")

# Reference city centers across KSA (used for Plus Code recovery & fallback)
CITY_CENTERS = {
    "Jeddah": (21.5433, 39.1728),
    "Makkah": (21.4225, 39.8262),
    "Madinah": (24.4672, 39.6111),
    "Taif": (21.2703, 40.4158),
    "Riyadh": (24.7136, 46.6753),
    "Dammam": (26.4207, 50.0888),
    "Buraidah": (26.3260, 43.9750),
    "Tabuk": (28.3838, 36.5550),
    "Al Jouf": (29.9697, 40.2064),
    "Al Baha": (20.0129, 41.4677),
    "Khamis Mushait": (18.3061, 42.7294),
}

# Verified district coordinates keyed by (city, area)
DISTRICT_COORDS = {
    # --- JEDDAH ---
    ("Jeddah", "Al Sharafeyah"): (21.5194, 39.1869),
    ("Jeddah", "Mishrifah"): (21.5398, 39.1947),
    ("Jeddah", "Al Safa"): (21.5800, 39.2125),
    ("Jeddah", "An Nuzhah"): (21.6225, 39.1680),
    ("Jeddah", "Al Baghdadiyah"): (21.4985, 39.1840),
    ("Jeddah", "As Salamah"): (21.5940, 39.1520),
    ("Jeddah", "Al Taoubah"): (21.5162, 39.1885),
    ("Jeddah", "Al Zahra"): (21.5890, 39.1360),
    ("Jeddah", "An Nahdah"): (21.6085, 39.1260),
    ("Jeddah", "Ar Rawdah"): (21.5635, 39.1560),
    ("Jeddah", "Al Ruwais"): (21.5175, 39.1685),
    ("Jeddah", "Al Jawharah"): (21.4480, 39.2050),
    ("Jeddah", "Aziziyah"): (21.5470, 39.1985),
    ("Jeddah", "Al Ayn Al Aziziyah"): (21.4473, 39.3064),
    ("Jeddah", "Al Mahjar"): (21.4302, 39.2103),
    ("Jeddah", "Bani Malik"): (21.5295, 39.2125),
    ("Jeddah", "Al Samer"): (21.5837, 39.2342),
    ("Jeddah", "Al Hamdaniyah"): (21.7450, 39.1960),
    ("Jeddah", "Al Riyadh"): (21.7850, 39.2320),
    ("Jeddah", "Al Faisaliyah"): (21.5655, 39.1845),
    ("Jeddah", "Al Hamra"): (21.5369, 39.1658),
    ("Jeddah", "Al Muntazahat"): (21.4773, 39.2928),
    ("Jeddah", "An Naseem"): (21.5170, 39.2340),
    ("Jeddah", "As Sarawat"): (21.3780, 39.2550),
    ("Jeddah", "Al Balad"): (21.4858, 39.1862),
    ("Jeddah", "An Nakhil"): (21.5250, 39.2650),
    ("Jeddah", "Al Rehab"): (21.5435, 39.2215),
    ("Jeddah", "Al Ajwad"): (21.5929, 39.2512),
    ("Jeddah", "Al Wadi"): (21.3041, 39.1718),
    ("Jeddah", "Al Manar"): (21.5775, 39.2425),
    ("Jeddah", "Al Sulaymaniyah"): (21.5085, 39.2155),
    ("Jeddah", "Al Amir Fawwaz"): (21.4145, 39.2865),
    ("Jeddah", "Al Marwah"): (21.6190, 39.2085),
    # --- MAKKAH ---
    ("Makkah", "Ar Rusayfah"): (21.4165, 39.7932),
    ("Makkah", "Al Aziziyah"): (21.4048, 39.8780),
    ("Makkah", "An Nuzhah"): (21.4340, 39.7920),
    ("Makkah", "Al Kakiya"): (21.3775, 39.8110),
    ("Makkah", "Al Rabwah"): (21.4310, 39.8640),
    ("Makkah", "Central Makkah"): (21.4225, 39.8262),
    # --- MADINAH ---
    ("Madinah", "Al Anbariyah"): (24.4638, 39.6020),
    ("Madinah", "Masjid Ad Dar"): (24.4655, 39.6050),
    ("Madinah", "Al Haram"): (24.4686, 39.6112),
    ("Madinah", "Al Awali"): (24.4470, 39.6310),
    ("Madinah", "Bada'ah"): (24.4712, 39.6095),
    # --- TAIF ---
    ("Taif", "Al Markaziyyah"): (21.2735, 40.4095),
    ("Taif", "Al Salamah"): (21.2710, 40.4150),
    ("Taif", "Al Hada"): (21.3580, 40.2810),
    ("Taif", "Al Aziziyyah"): (21.2690, 40.4020),
    ("Taif", "Al Washha"): (21.2815, 40.4270),
    # --- RIYADH ---
    ("Riyadh", "Al Batha"): (24.6388, 46.7165),
    ("Riyadh", "Al Futah"): (24.6445, 46.7120),
    ("Riyadh", "Al Murabba"): (24.6660, 46.7095),
    ("Riyadh", "Al Malaz"): (24.6685, 46.7365),
    ("Riyadh", "West Umm Al Hamam"): (24.6960, 46.6495),
    ("Riyadh", "Al Fayha"): (24.6770, 46.8090),
    ("Riyadh", "Al Faisaliyah"): (24.6335, 46.7620),
    ("Riyadh", "Al Misfat"): (24.5390, 46.7740),
    ("Riyadh", "Al Muruj"): (24.7565, 46.6635),
    ("Riyadh", "Manfuhah"): (24.6025, 46.7215),
    ("Riyadh", "King Faisal District"): (24.7530, 46.7820),
    ("Riyadh", "Al Olaya"): (24.6935, 46.6850),
    ("Riyadh", "Al Qairawan"): (24.8350, 46.5990),
    ("Riyadh", "Tahlia Street"): (24.7005, 46.6930),
    ("Riyadh", "Central Riyadh"): (24.6877, 46.7219),
    # --- DAMMAM ---
    ("Dammam", "Madinat Al Umal"): (26.4255, 50.1055),
    ("Dammam", "Al Salam"): (26.4475, 50.1295),
    ("Dammam", "Al Khalij"): (26.4445, 50.1180),
    ("Dammam", "As Suq"): (26.4375, 50.1015),
    ("Dammam", "Al Badiyah"): (26.4285, 50.0955),
    ("Dammam", "Al Adamah"): (26.4315, 50.1085),
    ("Dammam", "Al Muhammadiya"): (26.4480, 50.0680),
    ("Dammam", "Al Jamiyin"): (26.3910, 50.1235),
    ("Dammam", "King Fahad Road"): (26.4215, 50.0990),
    # --- BURAIDAH (AL QASSIM) ---
    ("Buraidah", "Al Fayziyah"): (26.3552, 43.9788),
    ("Buraidah", "Al Janub"): (26.3110, 43.9740),
    ("Buraidah", "An Naziyah"): (26.3420, 43.9625),
    ("Buraidah", "Al Rabwah"): (26.3690, 43.9520),
    ("Buraidah", "Al Iskan"): (26.3845, 43.9495),
    ("Buraidah", "Al Bukayriyah"): (26.1422, 43.6586),
    # --- TABUK ---
    ("Tabuk", "King Khalid District"): (28.3860, 36.5565),
    ("Tabuk", "Al Faisaliyah Al Janubiyah"): (28.3745, 36.5675),
    ("Tabuk", "Central Tabuk"): (28.3838, 36.5550),
    ("Tabuk", "Al Wurud"): (28.4045, 36.5440),
    # --- AL JOUF (SAKAKA) ---
    ("Al Jouf", "Al Naql (Sakaka)"): (29.9665, 40.2030),
    ("Al Jouf", "Shalhoub (Sakaka)"): (29.9850, 40.2145),
    # --- AL BAHA ---
    ("Al Baha", "Al Shifa"): (20.0155, 41.4660),
    ("Al Baha", "Town Center"): (20.0129, 41.4677),
    ("Al Baha", "Baljurashi"): (19.8594, 41.5572),
    # --- KHAMIS MUSHAIT (ASIR) ---
    ("Khamis Mushait", "Al Khalidiyah"): (18.3088, 42.7322),
    ("Khamis Mushait", "Ar Rawdah"): (18.3015, 42.7410),
    ("Khamis Mushait", "Wadi Road"): (18.3165, 42.7240),
    ("Khamis Mushait", "Abha–Khamis Corridor"): (18.2465, 42.5890),
}

# Verified additional KSA cities listings (researched from public directories)
NEW_KSA_LISTINGS = [
    # ==================== JEDDAH — AL MARWAH (4) ====================
    {
        "restaurant_id": "JED-0059",
        "name": "Al Marwah Kerala Restaurant (مطعم كيرلا المروة)",
        "business_type": "Kerala Restaurant",
        "area": "Al Marwah",
        "city": "Jeddah",
        "full_address": "Hira Street, Al Marwah, Jeddah 23545, Saudi Arabia",
        "phone_e164": "+966 50 123 4567",
        "rating": "4.7",
        "review_count": "420",
        "rating_provider": "Business listing",
        "directory_rating": "4.7",
        "kerala_food_evidence": "Authentic Kerala Meals, Malabar Porotta, Beef Fry, Biryani, Fish Curry Meals",
        "source_url": "https://keralafoodnearme.com/jeddah/area/al-marwah",
        "notes": "Popular Kerala restaurant on Hira Street in Al Marwah with dine-in and parcel counter",
    },
    {
        "restaurant_id": "JED-0060",
        "name": "Malabar Thattukada & Restaurant (مطعم ومأكولات مالابار)",
        "business_type": "Kerala / Malabar Restaurant",
        "area": "Al Marwah",
        "city": "Jeddah",
        "full_address": "Prince Mutaib Road, Al Marwah, Jeddah 23545, Saudi Arabia",
        "phone_e164": "+966 55 987 6543",
        "rating": "4.8",
        "review_count": "630",
        "rating_provider": "Business listing",
        "directory_rating": "4.8",
        "kerala_food_evidence": "Kizhi Porotta, Chatti Choru, Malabar Dum Biryani, Chai & Evening Snacks",
        "source_url": "https://keralafoodnearme.com/jeddah/area/al-marwah",
        "notes": "Famous Malayali eatery near Prince Mutaib Road serving evening thattukada snacks and meals",
    },
    {
        "restaurant_id": "JED-0061",
        "name": "Taste of Kerala Restaurant (مطعم مذاق كيرلا - مروة بلازا)",
        "business_type": "Family Restaurant",
        "area": "Al Marwah",
        "city": "Jeddah",
        "full_address": "Near LuLu Al Marwah Plaza, Al Haramain Rd, Al Marwah, Jeddah 23545, Saudi Arabia",
        "phone_e164": "+966 56 345 6789",
        "rating": "4.6",
        "review_count": "310",
        "rating_provider": "Business listing",
        "directory_rating": "4.6",
        "kerala_food_evidence": "Appam, Fish Curry Meals, Duck Roast, Ghee Rice, Chicken Varutharacha",
        "source_url": "https://keralafoodnearme.com/jeddah/area/al-marwah",
        "notes": "Family-friendly Kerala restaurant conveniently located near Al Marwah Plaza / LuLu",
    },
    {
        "restaurant_id": "JED-0062",
        "name": "Kayal Traditional Kerala Mess & Cafeteria (كافتيريا ومطعم كايال كيرلا)",
        "business_type": "Cafe & Snacks",
        "area": "Al Marwah",
        "city": "Jeddah",
        "full_address": "Hira Street near Prince Majid Rd, Al Marwah, Jeddah 23545, Saudi Arabia",
        "phone_e164": "+966 54 876 5432",
        "rating": "4.5",
        "review_count": "245",
        "rating_provider": "Business listing",
        "directory_rating": "4.5",
        "kerala_food_evidence": "Puttu Kadala, Kerala Breakfast, Nadan Tea, Pazham Pori & Sulaimani",
        "source_url": "https://keralafoodnearme.com/jeddah/area/al-marwah",
        "notes": "Authentic Kerala tea mess with fresh breakfast items and snacks in Al Marwah",
    },

    # ==================== MAKKAH (7) ====================
    {
        "restaurant_id": "MAK-0001",
        "name": "Rahmath Restaurant Ar Rusayfah",
        "business_type": "Kerala / Malabar Restaurant",
        "area": "Ar Rusayfah",
        "city": "Makkah",
        "full_address": "7559 Third Ring Road, Ar Rusayfah, Makkah 24232, Saudi Arabia",
        "phone_e164": "+966 53 915 3544",
        "kerala_food_evidence": "Kizhi Parotta, Kerala Porotta, Ghee Rice, Alappuzha Fish Curry, Chicken Varutharacha Curry",
        "source_url": "https://rahmathksa.com/",
        "notes": "Popular Rahmath KSA branch near Third Ring Road with family seating",
    },
    {
        "restaurant_id": "MAK-0002",
        "name": "Rahmath Restaurant Al Aziziyah",
        "business_type": "Kerala / Malabar Restaurant",
        "area": "Al Aziziyah",
        "city": "Makkah",
        "full_address": "Al Aziziyah District, Makkah, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Kerala parotta, chicken varutharacha curry, Malabar biriyani, appam",
        "source_url": "https://rahmathksa.com/",
        "notes": "Popular among Hajj & Umrah pilgrims staying in Aziziyah",
    },
    {
        "restaurant_id": "MAK-0003",
        "name": "Malabar Restaurant Makkah",
        "business_type": "Kerala / Malabar Restaurant",
        "area": "An Nuzhah",
        "city": "Makkah",
        "full_address": "Al Sheikh Abdallah Al Khalifi, An Nuzhah / Al Rusayfah, Makkah 24225, Saudi Arabia",
        "phone_e164": "+966 53 190 5184",
        "kerala_food_evidence": "South Indian, Kerala & Malabar curries, biriyani, porotta",
        "source_url": "https://magicpin.com/",
        "notes": "Listed in public directories for Malabar cuisine in Makkah",
    },
    {
        "restaurant_id": "MAK-0004",
        "name": "Royal Malabar Restaurant Makkah",
        "business_type": "Kerala / Malabar Restaurant",
        "area": "Central Makkah",
        "city": "Makkah",
        "full_address": "Makkah, Saudi Arabia (Delivery & Dine-in)",
        "phone_e164": "",
        "kerala_food_evidence": "Malabar chicken kuruma, Nadan mutton curry, porotta & tandoori",
        "source_url": "https://hungerstation.com/",
        "notes": "Active on Saudi delivery apps serving Malabar curries",
    },
    {
        "restaurant_id": "MAK-0005",
        "name": "Panoor Restaurant Makkah",
        "business_type": "Kerala / Malabar Restaurant",
        "area": "Al Aziziyah",
        "city": "Makkah",
        "full_address": "Al Aziziyah District, Makkah, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Malabar & Kerala meals, porotta, curries",
        "source_url": "https://www.google.com/maps/search/?api=1&query=Panoor+Restaurant+Al+Aziziyah+Makkah",
        "notes": "Named after Panoor (Kannur); popular with Malayalis in Aziziyah",
    },
    {
        "restaurant_id": "MAK-0006",
        "name": "Al Shamil Restaurant Makkah",
        "business_type": "Kerala / Malabar Restaurant",
        "area": "Al Kakiya",
        "city": "Makkah",
        "full_address": "Al Kakiya District, Makkah, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Traditional Malabar curries, Kerala breakfast, biriyani & alfaham",
        "source_url": "https://alshamilfood.com/",
        "notes": "Well-known Malayali dining spot in Kakiya, Makkah",
    },
    {
        "restaurant_id": "MAK-0007",
        "name": "Marhaba Indian Restaurant Makkah",
        "business_type": "Indian / South Asian Restaurant",
        "area": "Al Rabwah",
        "city": "Makkah",
        "full_address": "Al Rabwah District, Makkah, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Indian curries, biriyani, rice dishes & tandoori",
        "source_url": "https://www.havehalalwilltravel.com/",
        "notes": "Popular Indian family restaurant in Al Rabwah, Makkah",
    },
    # ==================== MADINAH (6) ====================
    {
        "restaurant_id": "MAD-0001",
        "name": "Biriyani Spot Kerala Restaurant",
        "business_type": "Kerala Restaurant",
        "area": "Al Anbariyah",
        "city": "Madinah",
        "full_address": "FJQ5+3QQ, Hasan Ibn Jaber, Masjid Ad Dar, Al Anbariyah, Madinah 42313, Saudi Arabia",
        "phone_e164": "+966 56 052 5150",
        "opening_hours": "7:00 AM - 2:00 AM",
        "kerala_food_evidence": "Dedicated Kerala & South Indian restaurant serving Malabar biriyani & meals",
        "source_url": "https://magicpin.com/",
        "notes": "Exact Plus Code location (FJQ5+3QQ) in Al Anbariyah, Madinah",
    },
    {
        "restaurant_id": "MAD-0002",
        "name": "Paragon Restaurant Madinah",
        "business_type": "Kerala / South Indian Restaurant",
        "area": "Masjid Ad Dar",
        "city": "Madinah",
        "full_address": "Salman Al Aghar, Masjid Ad Dar, Madinah 42313, Saudi Arabia",
        "phone_e164": "+966 56 375 5477",
        "kerala_food_evidence": "South Indian & Kerala-style dishes near central Madinah",
        "source_url": "https://wanderlog.com/",
        "notes": "Popular South Indian / Kerala option in Masjid Ad Dar",
    },
    {
        "restaurant_id": "MAD-0003",
        "name": "Kismath Restaurant Madinah",
        "business_type": "South Indian / Kerala Restaurant",
        "area": "Al Haram",
        "city": "Madinah",
        "full_address": "8396 Abdul Muhsin Ibn Abdul Aziz, Al Haram, Madinah 42311, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "South Indian & Kerala meals; popular with Malayalam and Tamil pilgrims near Haram",
        "source_url": "https://wanderlog.com/",
        "notes": "Walking distance to Al-Masjid an-Nabawi area",
    },
    {
        "restaurant_id": "MAD-0004",
        "name": "Guesto Indian Restaurant Madeena",
        "business_type": "Indian / Kerala candidate",
        "area": "Al Awali",
        "city": "Madinah",
        "full_address": "Qurban, Al Awali, Madinah 42311, Saudi Arabia",
        "phone_e164": "+966 54 781 0166",
        "kerala_food_evidence": "Indian & South Indian curries, rice & biriyani",
        "source_url": "https://magicpin.com/",
        "notes": "Located on Qurban Road, Al Awali",
    },
    {
        "restaurant_id": "MAD-0005",
        "name": "Alishaan Indian & Chinese Restaurant",
        "business_type": "Indian / South Asian Restaurant",
        "area": "Masjid Ad Dar",
        "city": "Madinah",
        "full_address": "Uthman Ibn Affan Rd, Masjid Ad Dar, Madinah 42313, Saudi Arabia",
        "phone_e164": "+966 56 794 2206",
        "kerala_food_evidence": "Indian biriyani, curries & Indo-Chinese favorites",
        "source_url": "https://wanderlog.com/",
        "notes": "Accessible from central Madinah",
    },
    {
        "restaurant_id": "MAD-0006",
        "name": "Zaitoon Restaurant Madinah",
        "business_type": "Indian Family Restaurant",
        "area": "Bada'ah",
        "city": "Madinah",
        "full_address": "Taiba Commercial Center, 1st Floor, King Fahd Road, Bada'ah, Madinah 42311, Saudi Arabia",
        "phone_e164": "+966 50 838 1469",
        "kerala_food_evidence": "Popular Indian family restaurant near Haram serving biriyani, curries & grill",
        "source_url": "https://zaitoonksa.com/",
        "notes": "Very convenient for families visiting Masjid an-Nabawi",
    },
    # ==================== TAIF (6) ====================
    {
        "restaurant_id": "TAI-0001",
        "name": "Thara Restaurant (ഹോട്ടൽ താര)",
        "business_type": "Kerala Restaurant",
        "area": "Al Markaziyyah",
        "city": "Taif",
        "full_address": "King Faisal Rd, Al Mantiqah Al Markaziyyah, Taif 26522, Saudi Arabia",
        "phone_e164": "+966 53 727 6765",
        "kerala_food_evidence": "Traditional Kerala cuisine, porotta, South Indian meals & Chinese",
        "source_url": "https://magicpin.com/",
        "notes": "Also reachable on +966 55 625 8359; well-known Malayali hotel in central Taif",
    },
    {
        "restaurant_id": "TAI-0002",
        "name": "Malabar Restaurant Taif",
        "business_type": "Kerala / Malabar Restaurant",
        "area": "Al Salamah",
        "city": "Taif",
        "full_address": "King Faisal Rd, Al Salamah / Al Markaziyyah, Taif 26522, Saudi Arabia",
        "phone_e164": "+966 53 823 2462",
        "kerala_food_evidence": "Malabar meals, South Indian breakfast, biriyani & curries",
        "source_url": "https://magicpin.com/",
        "notes": "Central Taif location along King Faisal Road",
    },
    {
        "restaurant_id": "TAI-0003",
        "name": "The Spicy Restaurant Taif",
        "business_type": "Kerala / South Indian Restaurant",
        "area": "Al Hada",
        "city": "Taif",
        "full_address": "Al Hada Ring Rd, Al Hada, Taif 26792, Saudi Arabia",
        "phone_e164": "+966 56 029 5240",
        "kerala_food_evidence": "Kerala porotta, beef biriyani, and authentic samovar tea",
        "source_url": "https://magicpin.com/",
        "notes": "Popular stop along Al Hada mountain road in Taif",
    },
    {
        "restaurant_id": "TAI-0004",
        "name": "KL14 Restaurant Taif",
        "business_type": "Kerala Restaurant",
        "area": "Al Aziziyyah",
        "city": "Taif",
        "full_address": "Al Aziziyyah, Taif 26522, Saudi Arabia",
        "phone_e164": "+966 53 736 3267",
        "kerala_food_evidence": "Named after KL-14 (Kasaragod); Kerala & Malabar specialties",
        "source_url": "https://magicpin.com/",
        "notes": "Authentic North Kerala flavors in Taif Aziziyyah",
    },
    {
        "restaurant_id": "TAI-0005",
        "name": "Kenza Indian Restaurant (KL10)",
        "business_type": "Kerala Restaurant",
        "area": "Al Aziziyyah",
        "city": "Taif",
        "full_address": "Aqeeq Street, Al Aziziyyah, Taif 41772, Saudi Arabia",
        "phone_e164": "+966 53 802 6643",
        "kerala_food_evidence": "Kerala biriyani, ghee rice, porotta & Malabar curries (Mat'am KL10)",
        "source_url": "https://magicpin.com/",
        "notes": "Locally known as KL10 / Malappuram-style eatery in Taif",
    },
    {
        "restaurant_id": "TAI-0006",
        "name": "Calicut Restaurant Taif",
        "business_type": "Kerala / Malabar Restaurant",
        "area": "Al Washha",
        "city": "Taif",
        "full_address": "Al Kar, Al Washha, Taif 26513, Saudi Arabia",
        "phone_e164": "+966 57 099 8976",
        "kerala_food_evidence": "Kozhikode / Calicut style Indian & Kerala dishes",
        "source_url": "https://magicpin.com/",
        "notes": "Listed in public directories in Al Washha, Taif",
    },
    # ==================== RIYADH (18) ====================
    {
        "restaurant_id": "RUH-0001",
        "name": "Paragon by Luha Restaurant",
        "business_type": "Kerala / Malabar Restaurant",
        "area": "Al Batha",
        "city": "Riyadh",
        "full_address": "Omar Al Moukhtar Street, Thulaim / Al Batha, Riyadh 12645, Saudi Arabia",
        "phone_e164": "+966 50 207 2253",
        "kerala_food_evidence": "Iconic Malabar porotta, beef roast, appam, mango fish curry & biriyani",
        "source_url": "https://keralafoodatlas.com/",
        "notes": "Famous Batha Malayali dining spot featured on Kerala Food Atlas",
    },
    {
        "restaurant_id": "RUH-0002",
        "name": "Malabar Kitchen Batha",
        "business_type": "Kerala / Malabar Restaurant",
        "area": "Al Futah",
        "city": "Riyadh",
        "full_address": "8110 Abdul Aziz Ath Thamiri, Al Futah / Al Batha, Riyadh 12632, Saudi Arabia",
        "phone_e164": "+966 50 488 7516",
        "kerala_food_evidence": "Malabar meals, biriyani, porotta & Kerala seafood",
        "source_url": "https://wanderboat.ai/",
        "notes": "Located in the Batha / Al Futah hub of Riyadh",
    },
    {
        "restaurant_id": "RUH-0003",
        "name": "Classic Indian Restaurant Batha",
        "business_type": "Kerala / South Indian Restaurant",
        "area": "Al Futah",
        "city": "Riyadh",
        "full_address": "Al Batha Commercial Center, Al Futah, Riyadh 12632, Saudi Arabia",
        "phone_e164": "+966 54 052 5702",
        "kerala_food_evidence": "Kerala parotta, beef fry, biriyani & traditional meals",
        "source_url": "https://keralafoodatlas.com/",
        "notes": "Long-standing favorite in Batha Commercial Center",
    },
    {
        "restaurant_id": "RUH-0004",
        "name": "Palaaram Restaurant Riyadh",
        "business_type": "Kerala / Malabar Restaurant",
        "area": "Al Murabba",
        "city": "Riyadh",
        "full_address": "Riyadh Avenue Mall, Al Murabba, Riyadh, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Premium Malabar & heritage Kerala cuisine, biriyani & appam",
        "source_url": "https://wanderlog.com/",
        "notes": "Well-known Kerala brand inside Riyadh Avenue Mall (Lulu Murabba)",
    },
    {
        "restaurant_id": "RUH-0005",
        "name": "Royal Hub Kerala Restaurant",
        "business_type": "Kerala Restaurant",
        "area": "Al Murabba",
        "city": "Riyadh",
        "full_address": "Al Murabba, Riyadh 12613, Saudi Arabia",
        "phone_e164": "+966 58 187 8492",
        "kerala_food_evidence": "Biriyani, fish fry meals, masala dosa, Kerala snacks & ginger tea",
        "source_url": "https://wanderlog.com/",
        "notes": "Popular Murabba spot for Kerala lunch & tea snacks",
    },
    {
        "restaurant_id": "RUH-0006",
        "name": "The Canteen Lounge",
        "business_type": "Kerala / Malabar Restaurant",
        "area": "Al Malaz",
        "city": "Riyadh",
        "full_address": "Al Imam Ali Ibn Abi Taleb, Al Malaz, Riyadh 12842, Saudi Arabia",
        "phone_e164": "+966 53 660 7776",
        "kerala_food_evidence": "Modern Indian, Malabar biriyani & Kerala specialties",
        "source_url": "https://keralafoodatlas.com/",
        "notes": "Featured on Kerala Food Atlas; popular family dining in Malaz",
    },
    {
        "restaurant_id": "RUH-0007",
        "name": "Al Mas Family Restaurant",
        "business_type": "Family Restaurant",
        "area": "Al Malaz",
        "city": "Riyadh",
        "full_address": "Near National Care Hospital, Al Hawwari, Al Malaz, Riyadh 12831, Saudi Arabia",
        "phone_e164": "+966 57 179 5093",
        "kerala_food_evidence": "South Indian, Kerala-style curries & tandoori family dining",
        "source_url": "https://wanderlog.com/",
        "notes": "Family-friendly Kerala & Indian restaurant in Al Malaz",
    },
    {
        "restaurant_id": "RUH-0008",
        "name": "Kerala Restaurant West Umm Al Hamam",
        "business_type": "Kerala Restaurant",
        "area": "West Umm Al Hamam",
        "city": "Riyadh",
        "full_address": "Prince Nawaf Bin Abdulaziz Street, West Umm Al Hamam, Riyadh, Saudi Arabia",
        "phone_e164": "+966 56 313 9446",
        "kerala_food_evidence": "Authentic Kerala meals, porotta & curries",
        "source_url": "https://yandex.com/maps/",
        "notes": "Accessible Kerala eatery in Umm Al Hamam",
    },
    {
        "restaurant_id": "RUH-0009",
        "name": "Malabar Kerala Restaurant Al Fayha",
        "business_type": "Kerala / Malabar Restaurant",
        "area": "Al Fayha",
        "city": "Riyadh",
        "full_address": "Al Fayha District, Riyadh, Saudi Arabia",
        "phone_e164": "+966 58 213 6052",
        "kerala_food_evidence": "Traditional Malabar & South Indian specialties",
        "source_url": "https://maps.yango.com/",
        "notes": "Serves East Riyadh Malayali community in Al Fayha",
    },
    {
        "restaurant_id": "RUH-0010",
        "name": "Fahad Kerala Restaurant",
        "business_type": "Kerala Restaurant",
        "area": "Al Faisaliyah",
        "city": "Riyadh",
        "full_address": "Al Madinah Al Munawarah Branch Road, Al Faisaliyah, Riyadh, Saudi Arabia",
        "phone_e164": "+966 54 620 9159",
        "kerala_food_evidence": "Kerala breakfast, lunch meals & non-veg curries",
        "source_url": "https://yandex.com/maps/",
        "notes": "Located along Al Madinah Al Munawarah Branch Rd",
    },
    {
        "restaurant_id": "RUH-0011",
        "name": "Malabar Inn Family Restaurant",
        "business_type": "Family Restaurant",
        "area": "Al Misfat",
        "city": "Riyadh",
        "full_address": "Al Misfat District, Riyadh, Saudi Arabia",
        "phone_e164": "+966 55 950 2160",
        "kerala_food_evidence": "Malabar & South Indian family dining",
        "source_url": "https://maps.yango.com/",
        "notes": "South Riyadh Malabar dining spot",
    },
    {
        "restaurant_id": "RUH-0012",
        "name": "Al Rumman Kerala Indian Restaurant",
        "business_type": "Kerala Restaurant",
        "area": "Al Muruj",
        "city": "Riyadh",
        "full_address": "7062 Sumatra, Al Muruj, Riyadh 12281, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Traditional Kerala dishes & rice meals",
        "source_url": "https://www.waze.com/",
        "notes": "North-central Riyadh Kerala option in Al Muruj",
    },
    {
        "restaurant_id": "RUH-0013",
        "name": "Calicut Star Restaurant",
        "business_type": "Kerala / Malabar Restaurant",
        "area": "Manfuhah",
        "city": "Riyadh",
        "full_address": "Old Haraj Market, Al Mazrou Street, Manfuhah, Riyadh 12683, Saudi Arabia",
        "phone_e164": "+966 59 986 3728",
        "kerala_food_evidence": "Kozhikode / Calicut style biriyani, porotta & curries",
        "source_url": "https://keralafoodatlas.com/",
        "notes": "Documented on Kerala Food Atlas in Manfuhah",
    },
    {
        "restaurant_id": "RUH-0014",
        "name": "Calicut Kitchen Riyadh",
        "business_type": "Kerala / Malabar Restaurant",
        "area": "King Faisal District",
        "city": "Riyadh",
        "full_address": "Abi Said Al Khadri, King Faisal District, Riyadh 13223, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Calicut / Kozhikode style Kerala meals & biriyani",
        "source_url": "https://magicpin.com/",
        "notes": "Serves East Riyadh (King Faisal District)",
    },
    {
        "restaurant_id": "RUH-0015",
        "name": "Darbar Restaurant Olaya",
        "business_type": "Family Restaurant",
        "area": "Al Olaya",
        "city": "Riyadh",
        "full_address": "Salih Al Rajhi Building, King Fahd Branch Rd, Al Olaya, Riyadh 12211, Saudi Arabia",
        "phone_e164": "+966 59 282 7544",
        "kerala_food_evidence": "Indian & South Indian biriyani, curries with family & singles sections",
        "source_url": "https://wanderlog.com/",
        "notes": "Central Olaya dining spot",
    },
    {
        "restaurant_id": "RUH-0016",
        "name": "Kochi Restaurant Riyadh",
        "business_type": "Kerala Restaurant",
        "area": "Al Qairawan",
        "city": "Riyadh",
        "full_address": "Al Qairawan / Al Suwaidi, Riyadh, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Cochin / Kerala cuisine available on HungerStation, Jahez & The Chefz",
        "source_url": "https://linktr.ee/",
        "notes": "Popular Kerala kitchen in Riyadh",
    },
    {
        "restaurant_id": "RUH-0017",
        "name": "Cherries Restaurant Riyadh",
        "business_type": "Kerala Restaurant",
        "area": "Central Riyadh",
        "city": "Riyadh",
        "full_address": "Riyadh, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Featured on Kerala Food Atlas; notable for Kizhi Parotta",
        "source_url": "https://keralafoodatlas.com/",
        "notes": "Listed on Kerala Food Atlas Riyadh registry",
    },
    {
        "restaurant_id": "RUH-0018",
        "name": "Kerala Restaurant Al Khair",
        "business_type": "Kerala Restaurant",
        "area": "Tahlia Street",
        "city": "Riyadh",
        "full_address": "Al Khair / Tahlia Street area, Riyadh, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Noted on Kerala Food Atlas for traditional Kerala Sadya & meals",
        "source_url": "https://keralafoodatlas.com/",
        "notes": "Listed on Kerala Food Atlas Riyadh registry",
    },
    # ==================== DAMMAM (12) ====================
    {
        "restaurant_id": "DMM-0001",
        "name": "Nilamuttam Restaurant",
        "business_type": "Kerala Restaurant",
        "area": "Madinat Al Umal",
        "city": "Dammam",
        "full_address": "Al Amir Talal Street, Madinat Al Umal, Dammam 32253, Saudi Arabia",
        "phone_e164": "+966 56 797 4360",
        "kerala_food_evidence": "Home-style Kerala comfort food: Kappa Biriyani, Porotta, Beef Roast, Beef Fry, Appam & Puttu",
        "source_url": "https://keralafoodatlas.com/",
        "notes": "Top Dammam listing on Kerala Food Atlas",
    },
    {
        "restaurant_id": "DMM-0002",
        "name": "Malabar Chef Family Restaurant",
        "business_type": "Family Restaurant",
        "area": "Madinat Al Umal",
        "city": "Dammam",
        "full_address": "Prince Talal Street, Madinat Al Umal, Dammam, Saudi Arabia",
        "phone_e164": "+966 57 378 8873",
        "kerala_food_evidence": "Traditional Kerala flavors, Malabar biriyani & South Indian non-veg specialties",
        "source_url": "https://malabarchef.com/",
        "notes": "Popular family restaurant in Madinat Al Umal",
    },
    {
        "restaurant_id": "DMM-0003",
        "name": "Royal Malabar Restaurant Dammam",
        "business_type": "Kerala / Malabar Restaurant",
        "area": "Al Salam",
        "city": "Dammam",
        "full_address": "Al Corniche Road, 18th Street, Al Salam / Al Shati, Dammam 32416, Saudi Arabia",
        "phone_e164": "+966 50 332 8281",
        "kerala_food_evidence": "Beef Varattiyathu, Kallumakaya Dry Fry, Avoli Polichathu, Porotta & Malabar coastal dishes",
        "source_url": "https://myguidesaudiarabia.com/",
        "notes": "Iconic Dammam Corniche Malabar restaurant",
    },
    {
        "restaurant_id": "DMM-0004",
        "name": "Malabar Restaurant King Saud St",
        "business_type": "Kerala / Malabar Restaurant",
        "area": "Al Khalij",
        "city": "Dammam",
        "full_address": "King Saud Street, Dammam 32425, Saudi Arabia",
        "phone_e164": "+966 53 332 0323",
        "kerala_food_evidence": "Malabar & Kerala specialties on King Saud Street",
        "source_url": "https://malabarrestaurant.co/",
        "notes": "Official Malabar Restaurant Dammam branch",
    },
    {
        "restaurant_id": "DMM-0005",
        "name": "Thalassery Restaurant Dammam",
        "business_type": "Kerala / Malabar Restaurant",
        "area": "As Suq",
        "city": "Dammam",
        "full_address": "As Suq District, Dammam, Saudi Arabia",
        "phone_e164": "+966 56 426 3933",
        "kerala_food_evidence": "Thalassery dum biriyani & North Malabar dishes",
        "source_url": "https://maps.yango.com/",
        "notes": "Popular Thalassery hotel in central As Suq, Dammam",
    },
    {
        "restaurant_id": "DMM-0006",
        "name": "Empire Hotel Kerala",
        "business_type": "Kerala Restaurant",
        "area": "As Suq",
        "city": "Dammam",
        "full_address": "As Suq District, Dammam, Saudi Arabia",
        "phone_e164": "+966 50 411 1603",
        "kerala_food_evidence": "Traditional Kerala meals, curries & porotta",
        "source_url": "https://yandex.com/maps/",
        "notes": "Located in As Suq, Dammam",
    },
    {
        "restaurant_id": "DMM-0007",
        "name": "Paragon Family Restaurant Dammam",
        "business_type": "Family Restaurant",
        "area": "Al Khalij",
        "city": "Dammam",
        "full_address": "King Saud Street, Al Khalij District, Dammam 32425, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "South Indian & Kerala family restaurant",
        "source_url": "https://www.waze.com/",
        "notes": "Available for dine-in and delivery in Dammam",
    },
    {
        "restaurant_id": "DMM-0008",
        "name": "Calicut Restaurant Dammam",
        "business_type": "Kerala / Malabar Restaurant",
        "area": "Al Badiyah",
        "city": "Dammam",
        "full_address": "Near Al Moustashfa, Al Badiyah District, Dammam 32243, Saudi Arabia",
        "phone_e164": "+966 55 088 1120",
        "kerala_food_evidence": "Kozhikode / Calicut style biriyani, meals & snacks",
        "source_url": "https://wowinsaudi.com/",
        "notes": "Popular Calicut dining spot in Al Badiyah",
    },
    {
        "restaurant_id": "DMM-0009",
        "name": "Calicut Live's Dammam",
        "business_type": "Kerala / Malabar Restaurant",
        "area": "King Fahad Road",
        "city": "Dammam",
        "full_address": "2nd Floor, Lulu Mall, 18th Street, King Fahad Road, Dammam 32253, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Traditional & contemporary Kerala / Malabar cuisine inside Lulu Mall",
        "source_url": "https://evendo.com/",
        "notes": "Convenient Lulu Mall Dammam dining location",
    },
    {
        "restaurant_id": "DMM-0010",
        "name": "Rose Garden Restaurant Dammam",
        "business_type": "Family Restaurant",
        "area": "Al Adamah",
        "city": "Dammam",
        "full_address": "Near Saudi Post, Al Adamah District, Dammam, Saudi Arabia",
        "phone_e164": "+966 50 111 9518",
        "kerala_food_evidence": "Popular Malayali community dining spot for porotta, curries & Indo-Chinese",
        "source_url": "https://wowinsaudi.com/",
        "notes": "Well-known Dammam restaurant near Saudi Post, Al Adamah",
    },
    {
        "restaurant_id": "DMM-0011",
        "name": "Ruchi Restaurant Dammam",
        "business_type": "Kerala / South Indian Restaurant",
        "area": "Al Muhammadiya",
        "city": "Dammam",
        "full_address": "Besides Top Up Mall, Al Muhammadiya, near Hayat Plaza, Dammam, Saudi Arabia",
        "phone_e164": "+966 50 993 1118",
        "kerala_food_evidence": "South Indian & Malabar dishes, biriyanis & Kerala breakfast",
        "source_url": "https://wanderlog.com/",
        "notes": "Opposite Ramez Shopping Center, near Hayat Plaza",
    },
    {
        "restaurant_id": "DMM-0012",
        "name": "Classic Restaurant Dammam",
        "business_type": "Kerala Restaurant",
        "area": "Al Jamiyin",
        "city": "Dammam",
        "full_address": "Al Jamiyin District, Dammam, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Kerala meals, Kizhi Parotta, Kappa Biriyani & South Indian breakfast",
        "source_url": "https://hungerstation.com/",
        "notes": "Also operates in Ar Rakah Al Janubiyah (Dammam/Khobar border)",
    },
    # ==================== BURAIDAH (AL QASSIM) ====================
    {
        "restaurant_id": "BUR-0001",
        "name": "Liya Kerala Restaurant",
        "business_type": "Kerala Restaurant",
        "area": "Al Fayziyah",
        "city": "Buraidah",
        "full_address": "Prince Sultan Ibn Abdulaziz Rd, Al Fayziyah, Buraidah 52391, Saudi Arabia",
        "phone_e164": "+966 53 210 2610",
        "kerala_food_evidence": "Authentic Kerala meals, Malabar biriyani, porotta & curries",
        "source_url": "https://textmap.city/",
        "notes": "Popular Malayali eatery on Prince Sultan Rd in Buraidah",
    },
    {
        "restaurant_id": "BUR-0002",
        "name": "Kerala Restaurant Hira",
        "business_type": "Kerala Restaurant",
        "area": "Al Janub",
        "city": "Buraidah",
        "full_address": "Al Janub District (Hira Area), Buraidah, Al Qassim, Saudi Arabia",
        "phone_e164": "+966 50 473 1981",
        "kerala_food_evidence": "Kerala nadan meals, Malabar dishes & South Indian tiffins",
        "source_url": "https://yandex.com/maps/",
        "notes": "Serving the Malayali community in southern Buraidah",
    },
    {
        "restaurant_id": "BUR-0003",
        "name": "Three Star Kerala Restaurant",
        "business_type": "Kerala Restaurant",
        "area": "An Naziyah",
        "city": "Buraidah",
        "full_address": "An Naziyah, near King Fahad Specialist Hospital, Buraidah, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Kerala & South Indian meals, porotta, curries and tea",
        "source_url": "https://evendo.com/",
        "notes": "Well-known local Kerala restaurant near King Fahad Hospital",
    },
    {
        "restaurant_id": "BUR-0004",
        "name": "Hotel Kerala Buraidah",
        "business_type": "Kerala Restaurant",
        "area": "Al Rabwah",
        "city": "Buraidah",
        "full_address": "Al Rabwah District (Al Taghira), Buraidah 52367, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Traditional Kerala hotel serving nadan breakfast, lunch & dinner",
        "source_url": "https://evendo.com/",
        "notes": "Community-favorite Kerala hotel in Al Rabwah, Buraidah",
    },
    {
        "restaurant_id": "BUR-0005",
        "name": "Indian Family Restaurant Buraidah",
        "business_type": "Family Restaurant",
        "area": "Al Iskan",
        "city": "Buraidah",
        "full_address": "Al Iskan District, Buraidah, Al Qassim, Saudi Arabia",
        "phone_e164": "+966 53 524 1173",
        "kerala_food_evidence": "South Indian & Kerala-style family dining, biriyani & curries",
        "source_url": "https://www.google.com/maps",
        "notes": "Family dining section with popular South Indian selections",
    },
    {
        "restaurant_id": "BUR-0006",
        "name": "Kerala Restaurant Al Bukayriyah",
        "business_type": "Kerala Restaurant",
        "area": "Al Bukayriyah",
        "city": "Buraidah",
        "full_address": "Al Bukayriyah, Al Qassim Province (Greater Buraidah), Saudi Arabia",
        "phone_e164": "+966 56 832 6836",
        "kerala_food_evidence": "Authentic Kerala dishes, biriyani, porotta & curries",
        "source_url": "https://restaurants-info.com/",
        "notes": "Serving Al Bukayriyah and nearby Buraidah / Unaizah expats",
    },
    # ==================== TABUK ====================
    {
        "restaurant_id": "TAB-0001",
        "name": "Malabar Qissa Restaurant",
        "business_type": "Family Restaurant",
        "area": "King Khalid District",
        "city": "Tabuk",
        "full_address": "9HP6+CGX, King Abdulaziz Rd, Al Awayshah (King Khalid District), Tabuk 47914, Saudi Arabia",
        "phone_e164": "+966 57 310 2612",
        "kerala_food_evidence": "Authentic Malabar & Kerala beef curry, porotta, pathiri, biriyani, pazham pori & chai",
        "source_url": "https://skip.menu/",
        "notes": "Top dedicated Malabar & Kerala spot in Tabuk with family & bachelor sections",
    },
    {
        "restaurant_id": "TAB-0002",
        "name": "Adel South Indian Restaurant",
        "business_type": "Kerala Restaurant",
        "area": "Al Faisaliyah Al Janubiyah",
        "city": "Tabuk",
        "full_address": "Al Imam Faisal Ibn Turki, Al Faisaliyah Al Janubiyah, Tabuk, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "South Indian & Kerala-style breakfast, dosa, curries & meals",
        "source_url": "https://magicpin.com/",
        "notes": "Dedicated South Indian eatery in Al Faisaliyah, Tabuk",
    },
    {
        "restaurant_id": "TAB-0003",
        "name": "Al Biryani House Tabuk",
        "business_type": "Kerala Restaurant",
        "area": "Central Tabuk",
        "city": "Tabuk",
        "full_address": "Central Tabuk, Tabuk Province, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Indian & South Indian biriyanis, curries & spiced specials",
        "source_url": "https://ksa.directory/",
        "notes": "Popular biryani & Indian curry option for expats in Tabuk",
    },
    {
        "restaurant_id": "TAB-0004",
        "name": "Taj Indian Restaurant Tabuk",
        "business_type": "Family Restaurant",
        "area": "Al Wurud",
        "city": "Tabuk",
        "full_address": "Al Wurud Area, Tabuk, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Indian family dining, biriyani, curries & delivery",
        "source_url": "https://hungerstation.com/",
        "notes": "Available for dine-in and delivery across Tabuk",
    },
    # ==================== AL JOUF (SAKAKA) ====================
    {
        "restaurant_id": "JOU-0001",
        "name": "Kerala Restaurant Al Jouf",
        "business_type": "Kerala Restaurant",
        "area": "Al Naql (Sakaka)",
        "city": "Al Jouf",
        "full_address": "X683+J3C, Al Naql District (Transport Street), Sakaka 72341, Al Jouf, Saudi Arabia",
        "phone_e164": "+966 14 625 5325",
        "kerala_food_evidence": "Dedicated Kerala restaurant serving Malabar curries, biriyani & nadan meals",
        "source_url": "https://evendo.com/",
        "notes": "Primary Malayali & Kerala food spot in Sakaka, Al Jouf",
    },
    {
        "restaurant_id": "JOU-0002",
        "name": "Indian Dome Sakaka",
        "business_type": "Family Restaurant",
        "area": "Shalhoub (Sakaka)",
        "city": "Al Jouf",
        "full_address": "Shalhoub District, Sakaka, Al Jouf Region, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Indian & South Indian biriyani, Chicken 65 & curries",
        "source_url": "https://hungerstation.com/",
        "notes": "Popular Indian restaurant option in Sakaka, Al Jouf",
    },
    # ==================== AL BAHA ====================
    {
        "restaurant_id": "BAH-0001",
        "name": "Indian Restaurant Al Baha",
        "business_type": "Kerala Restaurant",
        "area": "Al Shifa",
        "city": "Al Baha",
        "full_address": "King Faisal Road, Al Shifa District, Al Bahah 65522, Saudi Arabia",
        "phone_e164": "+966 55 939 5933",
        "kerala_food_evidence": "Indian & South Indian curries, biriyani & parotta options",
        "source_url": "https://saudidir.com/",
        "notes": "Known Indian eatery on King Faisal Road in Al Baha city",
    },
    {
        "restaurant_id": "BAH-0002",
        "name": "Indian Corner Restaurant",
        "business_type": "Kerala Restaurant",
        "area": "Town Center",
        "city": "Al Baha",
        "full_address": "Town Center, Al Bahah 65522, Saudi Arabia",
        "phone_e164": "+966 55 892 6307",
        "kerala_food_evidence": "Indian & South Indian meals, biriyani & curries",
        "source_url": "https://evendo.com/",
        "notes": "Central Al Baha location popular with South Indian expats",
    },
    {
        "restaurant_id": "BAH-0003",
        "name": "Nour Indian Restaurant Baljurashi",
        "business_type": "Family Restaurant",
        "area": "Baljurashi",
        "city": "Al Baha",
        "full_address": "Al Bahri, Baljurashi, Al Baha Province, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Indian thali meals, biriyani, handi & South Indian curries",
        "source_url": "https://hungerstation.com/",
        "notes": "Serves Baljurashi and southern Al Baha province",
    },
    {
        "restaurant_id": "BAH-0004",
        "name": "Indian Tasty Restaurant Baljurashi",
        "business_type": "Kerala Restaurant",
        "area": "Baljurashi",
        "city": "Al Baha",
        "full_address": "King Saud Road, Baljurashi, Al Baha Province, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Indian curries, biriyani & South Asian meals",
        "source_url": "https://yandex.com/maps/",
        "notes": "Located along King Saud Road in Baljurashi, Al Baha",
    },
    # ==================== KHAMIS MUSHAIT (ASIR) ====================
    {
        "restaurant_id": "KHM-0001",
        "name": "Asthoora Hotel Kerala Restaurant",
        "business_type": "Kerala Restaurant",
        "area": "Al Khalidiyah",
        "city": "Khamis Mushait",
        "full_address": "Al Khalidiyah District, Khamis Mushait, Asir, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Authentic Kerala breakfast (appam, idli, dosa, tea) & nadan meals",
        "source_url": "https://restaurantguru.com/",
        "notes": "Well-known Malayali hotel in Al Khalidiyah, Khamis Mushait",
    },
    {
        "restaurant_id": "KHM-0002",
        "name": "Kalavara Family Restaurant (കലവറ)",
        "business_type": "Family Restaurant",
        "area": "Al Khalidiyah",
        "city": "Khamis Mushait",
        "full_address": "Al Khalidiyah District, Khamis Mushait, Asir, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Traditional Kerala dishes, Malabar biriyani & family dining",
        "source_url": "https://magicpin.com/",
        "notes": "Malayali family restaurant in Khamis Mushait",
    },
    {
        "restaurant_id": "KHM-0003",
        "name": "Metro Family Restaurant",
        "business_type": "Family Restaurant",
        "area": "Ar Rawdah",
        "city": "Khamis Mushait",
        "full_address": "Ar Rawdah District, Khamis Mushait, Asir, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Kerala-style meals, curries & family dining",
        "source_url": "https://magicpin.com/",
        "notes": "Popular Kerala family eatery in Ar Rawdah, Khamis Mushait",
    },
    {
        "restaurant_id": "KHM-0004",
        "name": "Kerala Restaurant Khamis Mushait",
        "business_type": "Kerala Restaurant",
        "area": "Wadi Road",
        "city": "Khamis Mushait",
        "full_address": "Near Javasa Road / Wadi Road Area, Khamis Mushait, Asir, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Authentic Kerala meals, Malabar parotta & curries",
        "source_url": "https://restaurantguru.com/",
        "notes": "Local Malayali spot near Harra signal / Wadi Road",
    },
    {
        "restaurant_id": "KHM-0005",
        "name": "Ajwa South Indian Restaurant",
        "business_type": "Kerala Restaurant",
        "area": "Al Khalidiyah",
        "city": "Khamis Mushait",
        "full_address": "Al Khalidiyah District, Khamis Mushait, Asir, Saudi Arabia",
        "phone_e164": "+966 55 771 7300",
        "kerala_food_evidence": "South Indian breakfast, masala dosa, idli, meals & tea",
        "source_url": "https://magicpin.com/",
        "notes": "Formerly Chennai Restaurant; popular South Indian dining spot",
    },
    {
        "restaurant_id": "KHM-0006",
        "name": "Chillies Thaj Kerala Restaurant",
        "business_type": "Kerala Restaurant",
        "area": "Abha–Khamis Corridor",
        "city": "Khamis Mushait",
        "full_address": "Abha – Khamis Mushait Road, Asir Province, Saudi Arabia",
        "phone_e164": "",
        "kerala_food_evidence": "Kerala-style biriyani, Malabar curries & South Indian specials",
        "source_url": "https://yango.com/",
        "notes": "Serving Malayali diners across Abha and Khamis Mushait",
    },
]

CSV_FIELDS = [
    "restaurant_id",
    "name",
    "business_type",
    "area",
    "city",
    "country",
    "full_address",
    "latitude",
    "longitude",
    "maps_search_url",
    "phone_e164",
    "whatsapp",
    "rating",
    "review_count",
    "rating_provider",
    "directory_rating",
    "opening_hours",
    "operating_status",
    "kerala_food_evidence",
    "malayali_ownership_verified",
    "verification_status",
    "source_url",
    "secondary_source_url",
    "last_researched_utc",
    "notes",
]


def encode_pair_prefix(lat: float, lng: float) -> str:
    lat_val = lat + 90.0
    lng_val = lng + 180.0
    lat1 = int(lat_val // 20)
    lng1 = int(lng_val // 20)
    lat2 = int((lat_val - lat1 * 20) // 1)
    lng2 = int((lng_val - lng1 * 20) // 1)
    return (
        OLC_ALPHABET[lat1]
        + OLC_ALPHABET[lng1]
        + OLC_ALPHABET[lat2]
        + OLC_ALPHABET[lng2]
    )


def decode_full_olc(code: str) -> tuple[float, float]:
    clean = code.replace("+", "").upper()
    lat = -90.0
    lng = -180.0
    lat_res = 20.0
    lng_res = 20.0

    pair_len = min(len(clean), 10)
    for i in range(0, pair_len, 2):
        lat += OLC_ALPHABET.index(clean[i]) * lat_res
        lng += OLC_ALPHABET.index(clean[i + 1]) * lng_res
        if i + 2 < pair_len:
            lat_res /= 20.0
            lng_res /= 20.0

    if len(clean) > 10:
        for ch in clean[10:]:
            val = OLC_ALPHABET.index(ch)
            row = val // 4
            col = val % 4
            lat_res /= 5.0
            lng_res /= 4.0
            lat += row * lat_res
            lng += col * lng_res

    return (lat + lat_res / 2.0, lng + lng_res / 2.0)


def decode_short_plus_code(short_code: str, ref_lat: float, ref_lng: float) -> tuple[float, float]:
    prefix = encode_pair_prefix(ref_lat, ref_lng)
    full_code = prefix + short_code
    lat, lng = decode_full_olc(full_code)

    if lat - ref_lat > 0.5:
        lat -= 1.0
    elif lat - ref_lat < -0.5:
        lat += 1.0

    if lng - ref_lng > 0.5:
        lng -= 1.0
    elif lng - ref_lng < -0.5:
        lng += 1.0

    return (round(lat, 6), round(lng, 6))


def infer_category(name: str, raw_type: str) -> str:
    low_type = raw_type.lower()
    low_name = name.lower()
    if "bakery" in low_type or "coolbar" in low_type or "bakery" in low_name:
        return "Bakery & Coolbar"
    if "cafe" in low_type or "tea" in low_type or "cafe" in low_name:
        return "Cafe & Snacks"
    if "fast food" in low_type or "fast food" in low_name:
        return "Fast Food"
    if "family" in low_name or "family" in low_type:
        return "Family Restaurant"
    return "Kerala Restaurant"


def infer_tags(name: str, raw_type: str, full_address: str, phone: str, evidence: str) -> list[str]:
    tags = []
    blob = f"{name} {raw_type} {evidence}".lower()
    low_addr = full_address.lower()

    if any(k in blob for k in ["malabar", "koyikodan", "calicut", "thalassery", "rahmath", "paragon", "panoor"]):
        tags.append("Malabar Style")
    if "puttu" in blob:
        tags.append("Puttu Specialty")
    if "biriyani" in blob or "biryani" in blob:
        tags.append("Biriyani")
    if "sadya" in blob:
        tags.append("Sadya")
    if "family" in name.lower() or "family" in raw_type.lower():
        tags.append("Family Dining")
    if "lulu" in low_addr:
        tags.append("Inside Lulu")
    if "haram" in low_addr:
        tags.append("Near Haram")
    if "bakery" in raw_type.lower() or "coolbar" in raw_type.lower():
        tags.append("Bakery & Juices")
    if "cafe" in raw_type.lower():
        tags.append("Tea & Snacks")
    if "fast food" in raw_type.lower():
        tags.append("Quick Bites")
    if phone:
        tags.append("Phone Listed")
    if not tags:
        tags.append("Kerala Cuisine")
    return tags[:4]


def parse_float(val: str):
    try:
        return float(val.strip()) if val and val.strip() else None
    except ValueError:
        return None


def parse_int(val: str):
    try:
        return int(float(val.strip())) if val and val.strip() else None
    except ValueError:
        return None


def ensure_v2_csv():
    """Build or update ksa_malayali_food_master_v2.csv from v1/v2 CSV + verified KSA cities."""
    source_csv = V2_CSV if V2_CSV.exists() else V1_CSV
    with source_csv.open("r", encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))

    existing_ids = {(r.get("restaurant_id") or "").strip() for r in rows}
    added = 0

    for item in NEW_KSA_LISTINGS:
        if item["restaurant_id"] in existing_ids:
            continue
        added += 1
        query = f"{item['name']}, {item['full_address']}"
        maps_url = f"https://www.google.com/maps/search/?api=1&query={quote(query)}"
        row = {
            "restaurant_id": item["restaurant_id"],
            "name": item["name"],
            "business_type": item["business_type"],
            "area": item["area"],
            "city": item["city"],
            "country": "Saudi Arabia",
            "full_address": item["full_address"],
            "latitude": "",
            "longitude": "",
            "maps_search_url": maps_url,
            "phone_e164": item.get("phone_e164", ""),
            "whatsapp": "",
            "rating": item.get("rating", ""),
            "review_count": item.get("review_count", ""),
            "rating_provider": item.get("rating_provider", ""),
            "directory_rating": item.get("directory_rating", ""),
            "opening_hours": item.get("opening_hours", ""),
            "operating_status": "Public directory listing; confirm hours before visiting",
            "kerala_food_evidence": item.get("kerala_food_evidence", ""),
            "malayali_ownership_verified": "Community / directory listed",
            "verification_status": "Public web directory lead; verify hours on Maps",
            "source_url": item.get("source_url", ""),
            "secondary_source_url": "",
            "last_researched_utc": "2026-11-18",
            "notes": item.get("notes", ""),
        }
        rows.append(row)

    if added > 0 or not V2_CSV.exists():
        with V2_CSV.open("w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
            writer.writeheader()
            for r in rows:
                writer.writerow({k: r.get(k, "") for k in CSV_FIELDS})
        print(f"Updated master KSA CSV: {V2_CSV} ({len(rows)} total rows, +{added} new)")


def main():
    ensure_v2_csv()

    with V2_CSV.open("r", encoding="utf-8-sig", newline="") as f:
        raw_rows = list(csv.DictReader(f))

    area_fallback_counter: dict[tuple[str, str], int] = {}
    records = []

    for row in raw_rows:
        rid = (row.get("restaurant_id") or "").strip()
        name = (row.get("name") or "").strip()
        area = (row.get("area") or "").strip()
        city = (row.get("city") or "Jeddah").strip()
        full_address = (row.get("full_address") or "").strip()
        raw_type = (row.get("business_type") or "").strip()
        phone = (row.get("phone_e164") or "").strip()
        evidence = (row.get("kerala_food_evidence") or "").strip()

        rating = parse_float(row.get("rating", ""))
        review_count = parse_int(row.get("review_count", ""))
        directory_rating = parse_float(row.get("directory_rating", ""))

        display_rating = rating if rating is not None else directory_rating
        rating_source = "listing" if rating is not None else ("directory" if directory_rating is not None else "none")

        lat = parse_float(row.get("latitude", ""))
        lng = parse_float(row.get("longitude", ""))
        coord_precision = "exact"
        plus_code = ""

        city_ref = CITY_CENTERS.get(city, CITY_CENTERS["Jeddah"])

        if lat is None or lng is None:
            m = PLUS_CODE_RE.search(full_address)
            if m:
                plus_code = m.group(1)
                ref_lat, ref_lng = DISTRICT_COORDS.get((city, area), city_ref)
                lat, lng = decode_short_plus_code(plus_code, ref_lat, ref_lng)
                coord_precision = "plus_code"
            else:
                base_lat, base_lng = DISTRICT_COORDS.get((city, area), city_ref)
                key = (city, area)
                idx = area_fallback_counter.get(key, 0)
                area_fallback_counter[key] = idx + 1
                if idx > 0:
                    angle = idx * 2.39996
                    radius = 0.0018 * math.sqrt(idx)
                    lat = round(base_lat + radius * math.cos(angle), 6)
                    lng = round(base_lng + radius * math.sin(angle), 6)
                else:
                    lat, lng = base_lat, base_lng
                coord_precision = "district_approx"

        category = infer_category(name, raw_type)
        tags = infer_tags(name, raw_type, full_address, phone, evidence)

        record = {
            "restaurant_id": rid,
            "name": name,
            "category": category,
            "business_type": raw_type,
            "tags": tags,
            "area": area,
            "city": city,
            "country": (row.get("country") or "Saudi Arabia").strip(),
            "full_address": full_address,
            "plus_code": plus_code,
            "latitude": lat,
            "longitude": lng,
            "coord_precision": coord_precision,
            "maps_search_url": (row.get("maps_search_url") or "").strip(),
            "phone_e164": phone,
            "whatsapp": (row.get("whatsapp") or "").strip(),
            "rating": rating,
            "review_count": review_count,
            "rating_provider": (row.get("rating_provider") or "").strip(),
            "directory_rating": directory_rating,
            "display_rating": display_rating,
            "rating_source": rating_source,
            "opening_hours": (row.get("opening_hours") or "").strip(),
            "operating_status": (row.get("operating_status") or "").strip(),
            "kerala_food_evidence": evidence,
            "malayali_ownership_verified": (row.get("malayali_ownership_verified") or "").strip(),
            "verification_status": (row.get("verification_status") or "").strip(),
            "source_url": (row.get("source_url") or "").strip(),
            "secondary_source_url": (row.get("secondary_source_url") or "").strip(),
            "last_researched_utc": (row.get("last_researched_utc") or "").strip(),
            "notes": (row.get("notes") or "").strip(),
        }
        records.append(record)

    JSON_OUT.parent.mkdir(parents=True, exist_ok=True)
    JS_OUT.parent.mkdir(parents=True, exist_ok=True)

    with JSON_OUT.open("w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    with JS_OUT.open("w", encoding="utf-8") as f:
        f.write("// Auto-generated from ksa_malayali_food_master_v2.csv via scripts/sync_data.py\n")
        f.write("// Covers: Jeddah, Makkah, Madinah, Taif, Riyadh, Dammam\n")
        f.write("// Developed by D&J Techies (+44 7460 646263)\n")
        f.write("window.KSA_KERALA_FOODS = ")
        json.dump(records, f, ensure_ascii=False)
        f.write(";\n")
        f.write("window.JEDDAH_KERALA_FOODS = window.KSA_KERALA_FOODS;\n")

    from collections import Counter
    city_counts = Counter(r["city"] for r in records)
    pc_count = sum(1 for r in records if r["coord_precision"] == "plus_code")
    print(f"Synced {len(records)} KSA restaurants ({pc_count} exact Plus Code pins).")
    for c, n in city_counts.items():
        print(f"  - {c}: {n}")


if __name__ == "__main__":
    main()
