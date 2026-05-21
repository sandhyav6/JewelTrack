# JewelTrack

A premium, fully functional frontend dashboard designed to streamline jewellery store operations.
This system provides an elegant and interactive interface for managing customers, inventory, suppliers, billing, purchases, and reports — all in one place.

Built using **HTML, CSS, and Vanilla JavaScript**, the project focuses on combining **luxury UI design** with **real-world business functionality**.

---

## Features

### Dashboard

* Real-time analytics and summary cards
* Sales overview and revenue charts
* Low stock alerts and activity timeline
* Top customers and recent sales tracking
  
<img width="889" height="395" alt="image" src="https://github.com/user-attachments/assets/857b80ad-9e3d-46e5-b2e1-32c3a0a67ba1" />
<img width="888" height="282" alt="image" src="https://github.com/user-attachments/assets/e14fbf44-9014-4cd5-b6b7-9f38787622b0" />
<img width="893" height="404" alt="image" src="https://github.com/user-attachments/assets/b027a27c-89a9-48cc-96bb-673a2040e8fd" />
<img width="1335" height="578" alt="image" src="https://github.com/user-attachments/assets/a337ac46-4427-49c6-9b74-20c90f7efac5" />
<img width="1339" height="597" alt="image" src="https://github.com/user-attachments/assets/0ea07fe4-9b47-4fe1-aaad-d5c08435902b" />

### Customer Management

* Add, edit, delete customers
* Search and filter customers
* Detailed customer profile view
* Purchase history and status classification (Preferred, Regular, Inactive)

<img width="1335" height="593" alt="image" src="https://github.com/user-attachments/assets/f82ced58-cdb7-4385-ac70-ab60a8c8dd37" />
<img width="1346" height="597" alt="image" src="https://github.com/user-attachments/assets/cf7cfcb5-7ffa-470d-be04-4bb807af55cf" />

### Jewellery Inventory

* Dual view: Card layout & Table view
* Filter by category, material, and stock status
* Add/edit/delete items
* Stock indicators (In Stock, Low Stock, Out of Stock)
* Detailed item preview modal
  
<img width="1347" height="610" alt="image" src="https://github.com/user-attachments/assets/16f726be-544a-4fe3-8f10-a7fcd2cf3e38" />
<img width="1336" height="604" alt="image" src="https://github.com/user-attachments/assets/865688f0-5d66-4211-8639-5600e3e21fa1" />
<img width="1328" height="603" alt="image" src="https://github.com/user-attachments/assets/1daa3bac-b61e-434b-9da6-2a5cbbd4ff06" />
<img width="1340" height="599" alt="image" src="https://github.com/user-attachments/assets/1334d5c8-3d5d-471d-9254-0988d285dfa8" />
<img width="1340" height="602" alt="image" src="https://github.com/user-attachments/assets/1174cc0f-3300-4ee6-9924-a4600a2a86c7" />

### 🧾 Billing System

* Dynamic invoice generation
* Add/remove items with quantity updates
* Live invoice preview
* Automatic tax and discount calculations
* Payment mode selection
* Bill confirmation modal

<img width="1342" height="593" alt="image" src="https://github.com/user-attachments/assets/8ed88533-674b-4ad0-a36d-8cc2c609481e" />
<img width="1340" height="600" alt="image" src="https://github.com/user-attachments/assets/5ee100cd-5dd9-4b45-9f2b-b9bc8c52b7a6" />
<img width="1344" height="598" alt="image" src="https://github.com/user-attachments/assets/4345d59b-3710-4c45-96e6-0450d011138e" />

### Purchases

* Record supplier purchases
* Track cost price and quantity
* Purchase history and supplier insights
* Auto-calculated totals

<img width="1336" height="594" alt="image" src="https://github.com/user-attachments/assets/900a976b-422c-49e1-9473-aae507fc98a5" />
<img width="1345" height="601" alt="image" src="https://github.com/user-attachments/assets/31468524-fed7-4718-89cb-ad0c03c72fc9" />

### Inventory Management

* Real-time stock tracking
* Low stock and out-of-stock alerts
* Visual stock indicators (progress bars)
* Inventory movement timeline

<img width="1345" height="597" alt="image" src="https://github.com/user-attachments/assets/191aebfb-82de-464f-b971-229b5ec27dd9" />

### Supplier Management

* Add/edit/delete suppliers
* Supplier performance tracking
* Reliability and category classification
* Detailed supplier profiles

<img width="1337" height="600" alt="image" src="https://github.com/user-attachments/assets/b0c0fe8d-f45b-43c4-9a0c-b092468d6102" />
<img width="1341" height="594" alt="image" src="https://github.com/user-attachments/assets/9876d221-6ca4-4ecb-abb6-a142e0a5e60e" />
<img width="1342" height="598" alt="image" src="https://github.com/user-attachments/assets/8905db9a-9a02-4780-b7a0-91265d44c202" />

### Reports

* Sales trend analysis
* Category-wise revenue breakdown
* Interactive charts using Chart.js
* Report generation simulation

<img width="1341" height="599" alt="image" src="https://github.com/user-attachments/assets/09d30707-ca14-4e56-b8d6-7a02f66654b1" />

### Settings

* Store configuration (name, GST, currency)
* Theme toggle (Light/Dark mode)
* User profile management
* LocalStorage-based persistence

<img width="1346" height="602" alt="image" src="https://github.com/user-attachments/assets/235d0fca-258a-4afa-8c87-d786c1e0e2e3" />
<img width="1339" height="600" alt="image" src="https://github.com/user-attachments/assets/e83c2fe9-99f5-4841-8e23-b7febce2b912" />

---

## UI & Design Highlights

* Luxury-inspired color palette (Gold, Burgundy, Ivory)
* Clean and modern dashboard layout
* Responsive design for desktop, tablet, and mobile
* Reusable components (cards, modals, tables, badges)
* Smooth animations and micro-interactions
* Toast notifications and confirmation dialogs







---

## Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
* **Charts:** Chart.js
* **Icons:** Font Awesome
* **Storage:** LocalStorage (for settings persistence)

---

## Project Structure

```
├── index.html              # Login page
├── dashboard.html         # Main dashboard
├── customers.html         # Customer management
├── items.html             # Jewellery items
├── suppliers.html         # Supplier management
├── billing.html           # Billing & sales
├── purchases.html         # Purchase management
├── inventory.html         # Inventory tracking
├── reports.html           # Reports & analytics
├── settings.html          # Settings & preferences

├── css/
│   ├── style.css          # Global styles
│   ├── components.css     # UI components
│   ├── responsive.css     # Responsive design

├── js/
│   ├── main.js            # Shared functionality
│   ├── dashboard.js
│   ├── customers.js
│   ├── items.js
│   ├── suppliers.js
│   ├── billing.js
│   ├── purchases.js
│   ├── inventory.js
│   ├── reports.js
│   ├── settings.js
```

---

## How to Run

1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
```

2. Open the project folder

3. Run the project by opening:

```bash
index.html
```

No installation or dependencies required.

---

## Responsiveness

The application is fully responsive and adapts to:

* Desktop screens
* Tablets
* Mobile devices

---

## Project Objective

This project was developed to simulate a **real-world jewellery store management system**, focusing on:

* Frontend architecture
* UI/UX design
* Modular JavaScript
* Data-driven interfaces
* Business workflow simulation

---

## Future Enhancements

* Backend integration (Node.js / Express / Oracle SQL)
* Authentication system
* Real database connectivity
* PDF invoice generation
* Barcode/QR integration
* Advanced reporting and analytics

---

## Final Note

This project combines **functional depth** with **premium visual design**, making it suitable for:

* Academic submission
* Portfolio showcase
* Frontend development practice

---
