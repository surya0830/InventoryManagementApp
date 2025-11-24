# Smart Inventory Tracker - Implementation Plan

## Vision
A premium, intelligent inventory management application that adapts to different environments (Home, Restaurant) to track stock, estimate consumption, and automate purchasing recommendations.

## Core Features

### 1. Multi-Context Support
- **Home Mode**: Focus on groceries, household essentials, and small-scale tracking.
- **Restaurant Mode**: Focus on high-volume ingredients, rapid turnover, and bulk units.

### 2. Smart Tracking Engine
- **Consumption Rate**: User defines how fast an item is used (e.g., "2 liters per week").
- **Decay/Expiry Tracking**: Track shelf life to prioritize usage and prevent waste.
- **Predictive Analytics**: 
  - Calculate `Days Until Empty`.
  - Calculate `Days Until Spoilage`.

### 3. Automated Recommendations
- **"To Buy" List**: Automatically populated when stock falls below a dynamic threshold based on consumption rate.
- **Urgency Indicators**: Visual cues for items expiring soon or running out.

## Tech Stack
- **Frontend**: React (Vite)
- **Styling**: Vanilla CSS (Premium, Glassmorphism, Dark/Light mode support)
- **State Management**: React Context / Hooks
- **Data Persistence**: LocalStorage (MVP) -> Backend (Future)

## Design Aesthetics
- **Theme**: Clean, modern, high-contrast.
- **Visuals**: Glassmorphism cards, smooth progress bars for stock levels, vibrant color coding for status (Green = Good, Yellow = Low, Red = Critical).

## Initial Roadmap
1.  **Setup**: Project initialization and styling foundation.
2.  **Core Components**: Inventory Card, Add Item Modal, Context Switcher.
3.  **Logic Implementation**: Consumption and Decay algorithms.
4.  **Dashboard**: Main view with "At a Glance" status.
