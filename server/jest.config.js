export default {
  verbose: true,                         // Show detailed test results
  testEnvironment: 'node',               // Simulate Node.js server (not browser)
  testMatch: ['**/tests/**/*.test.js'],  // Look for tests only inside "tests/" folder
  collectCoverage: true,                 // Enable coverage report
  coverageDirectory: 'coverage',         // Save coverage output here
  coveragePathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.js$': 'babel-jest' // Support import/export in test files using Babel
  },
  moduleFileExtensions: ['js', 'json'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',        // Allow ESM imports with .js extension
  }
};

