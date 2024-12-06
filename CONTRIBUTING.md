# Contributing to Kai-Master

First off, thank you for considering contributing to Kai-Master! It's people like you that make Kai-Master such a great tool for Lone Wolf fans everywhere.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for Kai-Master. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

- Use a clear and descriptive title for the issue to identify the problem.
- Describe the exact steps which reproduce the problem in as many details as possible.
- Provide specific examples to demonstrate the steps.
- Describe the behavior you observed after following the steps and point out what exactly is the problem with that behavior.
- Explain which behavior you expected to see instead and why.
- Include screenshots and animated GIFs which show you following the described steps and clearly demonstrate the problem.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for Kai-Master, including completely new features and minor improvements to existing functionality.

- Use a clear and descriptive title for the issue to identify the suggestion.
- Provide a step-by-step description of the suggested enhancement in as many details as possible.
- Provide specific examples to demonstrate the steps or point out the part of Kai-Master where the suggestion is related to.
- Describe the current behavior and explain which behavior you expected to see instead and why.
- Explain why this enhancement would be useful to most Kai-Master users.

## Setting Up the Project Locally

To contribute to Kai-Master, you'll need to set up the project on your local machine. Follow these steps to get started:

1. Fork the Kai-Master repository to your GitHub account.
2. Clone your fork to your local machine:
   ```bash
   git clone https://github.com/pcorbel/kai-master.git
   cd kai-master
   ```
3. Install the project dependencies using Yarn:
   ```bash
   yarn install
   ```
4. Start the development server:
   ```bash
   yarn dev
   ```
5. Open your browser and navigate to `http://localhost:3000` to see the app running.

Now you can make changes to the code and see them reflected in real-time in your browser.

### Testing Your Changes

After making your changes:

1. Ensure that the app still runs without errors in development mode:
   ```bash
   yarn dev
   ```
2. Check that your changes work as expected in the browser.

3. Generate a production build of the app:
   ```bash
   yarn generate
   ```

4. Preview the generated app to ensure it works correctly in a production-like environment:
   ```bash
   yarn preview
   ```

5. Open your browser and navigate to the URL provided by the preview command (usually `http://localhost:3000`) to test the generated app.

Once you're satisfied with your changes and have verified they work in both development and production modes, commit them, push to your fork, and open a pull request to the main Kai-Master repository.

Thank you for your interest in contributing to Kai-Master! We look forward to your contributions.
