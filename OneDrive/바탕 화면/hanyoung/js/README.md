# Sword Merge Game - JavaScript Module Structure

This directory contains all the JavaScript modules for the Sword Merge Game, organized by responsibility.

## Directory Structure

```
js/
├── main.js                 # Entry point - initializes GameController
├── GameController.js       # Coordinates all systems and manages game state
├── utils.js               # Utility functions (UUID generation, gold calculation)
├── models/                # Data models
│   └── Sword.js          # Sword entity and factory functions
├── systems/              # Core game systems
│   ├── InventoryManager.js      # 5x5 grid management
│   ├── MergeSystem.js           # Sword merging logic
│   ├── EnhancementSystem.js     # Probability-based enhancement
│   ├── ShopSystem.js            # Purchase logic
│   ├── QuestSystem.js           # Daily quest management
│   ├── AchievementSystem.js     # Achievement tracking
│   └── StorageManager.js        # localStorage persistence
└── ui/                   # UI layer
    ├── UIRenderer.js     # DOM rendering
    └── DragDropHandler.js # Drag-and-drop interactions
```

## Module Responsibilities

### Core Utilities (`utils.js`)
- `generateUUID()` - Generate unique identifiers for swords
- `calculateGoldValue(level, enhancement)` - Calculate sword gold value

### Data Models (`models/`)
- **Sword.js**: Sword entity with id, level, enhancement, and goldValue

### Game Systems (`systems/`)
- **InventoryManager**: Manages 25-slot grid, sword placement, movement, and sorting
- **MergeSystem**: Validates and executes sword merging
- **EnhancementSystem**: Handles probability-based sword enhancement
- **ShopSystem**: Manages sword and lucky box purchases
- **QuestSystem**: Tracks daily quest progress and rewards
- **AchievementSystem**: Monitors player milestones
- **StorageManager**: Persists game state to localStorage

### UI Layer (`ui/`)
- **UIRenderer**: Renders game state to DOM elements
- **DragDropHandler**: Manages drag-and-drop interactions for inventory

### Game Controller (`GameController.js`)
Coordinates all subsystems:
- Initializes all systems
- Manages game state
- Handles auto-save
- Routes events between systems
- Updates statistics

## Implementation Status

✅ **Task 1 Complete**: Project structure and core utilities
- HTML5 structure with index.html and styles.css
- JavaScript module structure with ES6 imports
- UUID generation utility
- Gold value calculation utility
- All system class stubs created

🔄 **Next Tasks**: 
- Task 2: Implement Sword data model
- Task 3: Implement Inventory Manager
- Task 4: Implement Merge System
- And so on...

## Usage

The game is initialized in `main.js`:

```javascript
import { GameController } from './GameController.js';

const game = new GameController();
game.init();
```

All modules use ES6 module syntax and are loaded as `type="module"` in the HTML.
