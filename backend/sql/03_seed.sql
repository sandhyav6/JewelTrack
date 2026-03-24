-- ===========================================================
-- JewelTrack: Step 3 - Seed Data
-- Run as JEWELTRACK_APP user AFTER 02_schema.sql
-- ===========================================================

-- ============================================================
-- CATEGORIES (6 rows)
-- ============================================================
INSERT INTO CATEGORY VALUES ('CAT-101', 'Gold');
INSERT INTO CATEGORY VALUES ('CAT-102', 'Diamond');
INSERT INTO CATEGORY VALUES ('CAT-103', 'Silver');
INSERT INTO CATEGORY VALUES ('CAT-104', 'Platinum');
INSERT INTO CATEGORY VALUES ('CAT-105', 'Gemstone');
INSERT INTO CATEGORY VALUES ('CAT-106', 'Pearl');

-- ============================================================
-- EMPLOYEES (4 rows - needed for billing)
-- ============================================================
INSERT INTO EMPLOYEE VALUES ('EMP-101', 'Sandhya V.');
INSERT INTO EMPLOYEE VALUES ('EMP-102', 'Rahul M.');
INSERT INTO EMPLOYEE VALUES ('EMP-103', 'Preethi K.');
INSERT INTO EMPLOYEE VALUES ('EMP-104', 'Arun S.');

-- ============================================================
-- SUPPLIERS (8 rows)
-- ============================================================
INSERT INTO SUPPLIER VALUES ('SUP-101', 'Kalyan Suppliers',    '+91 98001 23456');
INSERT INTO SUPPLIER VALUES ('SUP-102', 'Tanishq Wholesale',   '+91 87001 23456');
INSERT INTO SUPPLIER VALUES ('SUP-103', 'Malabar Traders',     '+91 76001 23456');
INSERT INTO SUPPLIER VALUES ('SUP-104', 'Senco Gold Supply',   '+91 65001 23456');
INSERT INTO SUPPLIER VALUES ('SUP-105', 'PC Jeweller Dist.',   '+91 54001 23456');
INSERT INTO SUPPLIER VALUES ('SUP-106', 'Joyalukkas Gems',     '+91 43001 23456');
INSERT INTO SUPPLIER VALUES ('SUP-107', 'Bhima Gold House',    '+91 32001 23456');
INSERT INTO SUPPLIER VALUES ('SUP-108', 'GRT Diamonds',        '+91 21001 23456');

-- ============================================================
-- CUSTOMERS (10 rows)
-- ============================================================
INSERT INTO CUSTOMER VALUES ('CUS-1001', 'Priya Sharma',  '+91 98765 43210');
INSERT INTO CUSTOMER VALUES ('CUS-1002', 'Vikram Singh',  '+91 87654 32109');
INSERT INTO CUSTOMER VALUES ('CUS-1003', 'Anjali Gupta',  '+91 76543 21098');
INSERT INTO CUSTOMER VALUES ('CUS-1004', 'Rajesh Patel',  '+91 65432 10987');
INSERT INTO CUSTOMER VALUES ('CUS-1005', 'Meera Iyer',    '+91 54321 09876');
INSERT INTO CUSTOMER VALUES ('CUS-1006', 'Arjun Reddy',   '+91 43210 98765');
INSERT INTO CUSTOMER VALUES ('CUS-1007', 'Neha Kapoor',   '+91 32109 87654');
INSERT INTO CUSTOMER VALUES ('CUS-1008', 'Suresh Kumar',  '+91 21098 76543');
INSERT INTO CUSTOMER VALUES ('CUS-1009', 'Kavitha Nair',  '+91 10987 65432');
INSERT INTO CUSTOMER VALUES ('CUS-1010', 'Deepak Joshi',  '+91 99887 76655');

-- ============================================================
-- ITEMS (12 rows)
-- ============================================================
INSERT INTO ITEM VALUES ('JW-1001', 'Gold Necklace (22K)',        'CAT-101', 'Gold',     24.5, 147000, 8);
INSERT INTO ITEM VALUES ('JW-1002', 'Diamond Solitaire Ring',     'CAT-102', 'Diamond',   4.2, 285000, 5);
INSERT INTO ITEM VALUES ('JW-1003', 'Silver Bangle Set (925)',    'CAT-103', 'Silver',   45.0,  12800, 15);
INSERT INTO ITEM VALUES ('JW-1004', 'Ruby Pendant (18K)',         'CAT-105', 'Gold',      6.8,  34200, 2);
INSERT INTO ITEM VALUES ('JW-1005', 'Bridal Kundan Set',          'CAT-101', 'Gold',     85.0, 425000, 3);
INSERT INTO ITEM VALUES ('JW-1006', 'Diamond Stud Earrings',      'CAT-102', 'Diamond',   3.5,  67800, 0);
INSERT INTO ITEM VALUES ('JW-1007', 'Platinum Chain 20"',         'CAT-104', 'Platinum', 12.0,  98500, 7);
INSERT INTO ITEM VALUES ('JW-1008', 'Gold Bangles (22K, Set)',    'CAT-101', 'Gold',     32.0, 192000, 4);
INSERT INTO ITEM VALUES ('JW-1009', 'Pearl Necklace Set',         'CAT-106', 'Gold',     18.5,  56000, 6);
INSERT INTO ITEM VALUES ('JW-1010', 'Silver Anklet Pair',         'CAT-103', 'Silver',   20.0,   4500, 12);
INSERT INTO ITEM VALUES ('JW-1011', 'Gemstone Cocktail Ring',     'CAT-105', 'Gold',      8.5,  42000, 0);
INSERT INTO ITEM VALUES ('JW-1012', 'Diamond Tennis Bracelet',    'CAT-102', 'Diamond',  14.0, 345000, 2);

-- ============================================================
-- PURCHASES (10 rows)
-- ============================================================
INSERT INTO PURCHASE VALUES ('PO-1201', DATE '2026-03-22', 'SUP-101');
INSERT INTO PURCHASE VALUES ('PO-1202', DATE '2026-03-20', 'SUP-102');
INSERT INTO PURCHASE VALUES ('PO-1203', DATE '2026-03-18', 'SUP-103');
INSERT INTO PURCHASE VALUES ('PO-1204', DATE '2026-03-15', 'SUP-104');
INSERT INTO PURCHASE VALUES ('PO-1205', DATE '2026-03-12', 'SUP-108');
INSERT INTO PURCHASE VALUES ('PO-1206', DATE '2026-03-10', 'SUP-105');
INSERT INTO PURCHASE VALUES ('PO-1207', DATE '2026-03-08', 'SUP-106');
INSERT INTO PURCHASE VALUES ('PO-1208', DATE '2026-03-05', 'SUP-101');
INSERT INTO PURCHASE VALUES ('PO-1209', DATE '2026-03-02', 'SUP-102');
INSERT INTO PURCHASE VALUES ('PO-1210', DATE '2026-02-28', 'SUP-103');

-- ============================================================
-- PURCHASE_ITEMS
-- ============================================================
INSERT INTO PURCHASE_ITEM VALUES ('PO-1201', 'JW-1001', 15, 125000);
INSERT INTO PURCHASE_ITEM VALUES ('PO-1202', 'JW-1002', 10,  52000);
INSERT INTO PURCHASE_ITEM VALUES ('PO-1202', 'JW-1006',  8,  55000);
INSERT INTO PURCHASE_ITEM VALUES ('PO-1203', 'JW-1004',  8,  28000);
INSERT INTO PURCHASE_ITEM VALUES ('PO-1204', 'JW-1003', 25,   2800);
INSERT INTO PURCHASE_ITEM VALUES ('PO-1204', 'JW-1010', 30,    800);
INSERT INTO PURCHASE_ITEM VALUES ('PO-1205', 'JW-1002',  5, 185000);
INSERT INTO PURCHASE_ITEM VALUES ('PO-1205', 'JW-1012',  4, 280000);
INSERT INTO PURCHASE_ITEM VALUES ('PO-1206', 'JW-1007', 12,  78000);
INSERT INTO PURCHASE_ITEM VALUES ('PO-1207', 'JW-1011',  5,  35000);
INSERT INTO PURCHASE_ITEM VALUES ('PO-1208', 'JW-1001',  6, 125000);
INSERT INTO PURCHASE_ITEM VALUES ('PO-1208', 'JW-1005',  3, 380000);
INSERT INTO PURCHASE_ITEM VALUES ('PO-1209', 'JW-1012',  4, 275000);
INSERT INTO PURCHASE_ITEM VALUES ('PO-1210', 'JW-1009', 10,  42000);
INSERT INTO PURCHASE_ITEM VALUES ('PO-1210', 'JW-1004',  5,  28000);

-- ============================================================
-- BILLS (10 rows)
-- ============================================================
INSERT INTO BILL VALUES ('BL-2838', DATE '2026-03-01', 'CUS-1003', 'EMP-101');
INSERT INTO BILL VALUES ('BL-2839', DATE '2026-03-05', 'CUS-1008', 'EMP-102');
INSERT INTO BILL VALUES ('BL-2840', DATE '2026-03-08', 'CUS-1001', 'EMP-101');
INSERT INTO BILL VALUES ('BL-2841', DATE '2026-03-10', 'CUS-1002', 'EMP-103');
INSERT INTO BILL VALUES ('BL-2842', DATE '2026-03-12', 'CUS-1006', 'EMP-102');
INSERT INTO BILL VALUES ('BL-2843', DATE '2026-03-15', 'CUS-1005', 'EMP-101');
INSERT INTO BILL VALUES ('BL-2844', DATE '2026-03-18', 'CUS-1002', 'EMP-103');
INSERT INTO BILL VALUES ('BL-2845', DATE '2026-03-19', 'CUS-1003', 'EMP-104');
INSERT INTO BILL VALUES ('BL-2846', DATE '2026-03-20', 'CUS-1004', 'EMP-101');
INSERT INTO BILL VALUES ('BL-2847', DATE '2026-03-22', 'CUS-1001', 'EMP-102');

-- ============================================================
-- BILL_ITEMS
-- ============================================================
INSERT INTO BILL_ITEM VALUES ('BL-2838', 'JW-1003', 1);
INSERT INTO BILL_ITEM VALUES ('BL-2839', 'JW-1010', 2);
INSERT INTO BILL_ITEM VALUES ('BL-2840', 'JW-1001', 1);
INSERT INTO BILL_ITEM VALUES ('BL-2840', 'JW-1004', 1);
INSERT INTO BILL_ITEM VALUES ('BL-2841', 'JW-1002', 1);
INSERT INTO BILL_ITEM VALUES ('BL-2842', 'JW-1007', 1);
INSERT INTO BILL_ITEM VALUES ('BL-2843', 'JW-1004', 1);
INSERT INTO BILL_ITEM VALUES ('BL-2844', 'JW-1005', 1);
INSERT INTO BILL_ITEM VALUES ('BL-2845', 'JW-1003', 2);
INSERT INTO BILL_ITEM VALUES ('BL-2845', 'JW-1010', 1);
INSERT INTO BILL_ITEM VALUES ('BL-2846', 'JW-1009', 1);
INSERT INTO BILL_ITEM VALUES ('BL-2847', 'JW-1001', 1);
INSERT INTO BILL_ITEM VALUES ('BL-2847', 'JW-1002', 1);

COMMIT;

PROMPT ============================================================
PROMPT  Seed data inserted: customers, employees, suppliers,
PROMPT  categories, items, purchases, purchase_items, bills,
PROMPT  bill_items.
PROMPT ============================================================