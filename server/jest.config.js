// jest.config.js

export default {
    verbose: true,                         // Show detailed test results
    testEnvironment: 'node',               // Simulate Node.js server (not browser)
    testMatch: ['**/tests/**/*.test.js'],  // Look for tests only inside "tests/" folder
    collectCoverage: true,                 // Enable coverage report
    coverageDirectory: 'coverage',         // Save coverage output here
    coveragePathIgnorePatterns: ['/node_modules/'], // Don't measure coverage for libraries
    moduleFileExtensions: ['js', 'json'],
  };
  //check result:
  //open coverage/lcov-report/index.html

