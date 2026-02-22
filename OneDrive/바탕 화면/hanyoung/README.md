# Sword Merge Game

An HTML5-based idle web browser game where players merge and enhance swords to earn gold.

## Project Structure

```
sword-merge-game/
├── index.html              # Main HTML file
├── styles.css              # Game styling
├── js/                     # JavaScript modules
│   ├── main.js            # Main entry point
│   └── utils.js           # Utility functions (UUID, gold calculation)
├── tests/                  # Test suites
│   ├── unit/              # Unit tests for specific examples
│   ├── property/          # Property-based tests using fast-check
│   └── integration/       # Integration tests for workflows
├── package.json           # Project dependencies
├── jest.config.js         # Jest test configuration
└── README.md             # This file
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run tests:
```bash
npm test                # Run all tests
npm run test:unit       # Run unit tests only
npm run test:property   # Run property-based tests only
npm run test:integration # Run integration tests only
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
```

3. Open the game:
Simply open `index.html` in a modern web browser.

## Features

- **5x5 Inventory Grid**: Manage up to 25 swords
- **Drag and Drop**: Intuitive sword management
- **Merge System**: Combine identical-level swords to create higher-level swords
- **Enhancement System**: Probability-based sword upgrades with risk-reward mechanics
- **Shop System**: Purchase basic swords and lucky boxes
- **Quest System**: Complete daily quests for rewards
- **Achievement System**: Unlock achievements for reaching milestones
- **Auto-Save**: Game progress automatically saved to localStorage

## Development

The game is built with vanilla JavaScript (ES6 modules), HTML5, and CSS3. No build tools or frameworks are required.

### Testing Strategy

The project uses a dual testing approach:

1. **Unit Tests**: Test specific examples and edge cases
2. **Property-Based Tests**: Test universal correctness properties using fast-check (100+ iterations per property)

All tests are written using Jest with jsdom for DOM testing.

## Requirements

- Modern web browser with ES6 module support
- localStorage enabled for save/load functionality

## License

MIT
