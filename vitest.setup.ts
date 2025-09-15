// This file is executed before each test file
// Ideal to setup jest-dom, globais mocks, or reset states between files.

// Imports Vitest functions to use after tests
// `afterEach` = executes something after each test
// `expect` = main function to assert things
import { afterEach, expect } from 'vitest';

// Imports the `cleanup` function from Testing Library
// It "cleans" the DOM after each test to make sure one test doesn't interfere with another
import { cleanup } from '@testing-library/react';

// Imports extras matchers from jest-dom adjusted to Vitest
// Example: `.toBeInTheDocument()`, `.toHaveAttribute()`, etc.
// Without this, `expect(...).toBeInTheDocument()` would throw an error
import '@testing-library/jest-dom/vitest';

// Imports all matchers from jest-dom adjusted to Vitest
// It avoids warnings related to act(...) in React updates
// and makes sure mathcers like `.toBeInTheDocument()` works correctly
import * as matchers from '@testing-library/jest-dom/matchers';

// Extends the global expect whith matchers from jest-dom
// Without this, warnings may show up like "You might have forgotten to wrap an update in act(...)"
expect.extend(matchers);

// This function runs automatically after each test
// Serves to clean everything e avoids one testing interfering with another
afterEach(async () => {
  // Cleans the DOM between tests (removes what was rendered)
  cleanup();

  // Resets all Vitest spies and mocks (`vi.fn`, `vi.spyOn`, etc.)
  // Makes sure test are independent and don't have "garbage" from previous executions
  vi.resetAllMocks();
});
