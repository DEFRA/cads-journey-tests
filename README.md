cads-journey-tests

A Playwright test suite for running end-to-end and API tests against the CADS journey application.

- [Local Development](#local-development)
  - [Requirements](#requirements)
    - [Node.js](#nodejs)
    - [Prerequisites](#Prerequisites)
  - [Setup](#setup)
  - [Running tests](#running-tests)
  - [Environment Configuration](#environment-configuration)
  - [Debugging tests](#debugging-tests)
- [Project Structure](#project-structure)
- [Production](#production)
- [Licence](#licence)

## Local Development

### Prerequisites

- **.NET 10 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/10.0)
- **Docker & Docker Compose** - [Download](https://www.docker.com/products/docker-desktop)
- **Git** Cads Data Service- [Download](https://github.com/DEFRA/cads-data-service)
- **Git** Cads Front-End- [Download](https://github.com/DEFRA/cads-mis)

#### Node.js

Please install [Node.js](http://nodejs.org/) `>= v22.13.1` and [npm](https://nodejs.org/). You will find it
easier to use the Node Version Manager [nvm](https://github.com/creationix/nvm).

To use the correct version of Node.js for this application, via nvm:

```bash
nvm use
```

### Setup

Install application dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

### Running tests

Run all tests:

```bash
npm run test
```

Run tests for a specific environment:

```bash
npx playwright test --ENV=local
npx playwright test --ENV=dev
```

Run tests in UI mode (interactive):

```bash
npx playwright test --ui
```

Run a specific test file:

```bash
npx playwright test tests/front-end/features/home.spec.ts
```

### Environment Configuration

The test environment is configured via the `ENV` environment variable in `playwright.config.ts`:

- `local` (default): Runs against `http://localhost:3000` (UI) and `http://localhost:5555` (API)
- `dev`: Runs against development environment URLs

When `ENV=local`, Playwright will automatically start the frontend and backend servers before running tests.

### Debugging tests

Run tests in debug mode:

```bash
npx playwright test --debug
```

Run tests with Playwright Inspector:

```bash
npx playwright test --headed
```

View test reports:

```bash
npx playwright show-report
```

## Project Structure

```
tests/
├── back-end/              # API tests
│   ├── api/               # API client implementations
│   ├── config/            # Environment-specific configs
│   ├── features/          # Test specifications
│   └── step-definitions/  # Step definition classes
├── front-end/             # UI tests
│   ├── features/          # Test specifications
│   ├── page-objects/      # Page object models
│   └── step-definitions/  # Step definition classes
├── fixtures/              # Playwright test fixtures
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions and constants
```

## Production

### Running the tests

Tests are run from the CDP-Portal under the Test Suites section. Before any changes can be run, a new docker image must be built, this will happen automatically when a pull request is merged into the `main` branch.
You can check the progress of the build under the actions section of this repository. Builds typically take around 1-2 minutes.

The results of the test run are made available in the portal.

### Test Reports

Test reports are generated in multiple formats:

- **HTML Report**: `playwright-report/html/index.html` - Interactive HTML report
- **JSON Report**: `playwright-report/results.json` - Machine-readable test results
- **Console Output**: Real-time test execution output

View the HTML report:

```bash
npx playwright show-report
```

### Requirements of CDP Environment Tests

1. Your service builds as a docker container using the `.github/workflows/publish.yml`
   The workflow tags the docker images allowing the CDP Portal to identify how the container should be run on the platform.
   It also ensures its published to the correct docker repository.

2. The Dockerfile's entrypoint script should return exit code of 0 if the test suite passes or 1/>0 if it fails

3. Test reports should be published to S3 using the script in `./bin/publish-tests.sh`

## Running on GitHub

Alternatively you can run the test suite as a GitHub workflow.
Test runs on GitHub are not able to connect to the CDP Test environments. Instead, they run the tests against a version of the services running in docker.
A docker compose `compose.yml` is included as a starting point, which includes the databases (mongodb, redis) and infrastructure (localstack) pre-setup.

Steps:

1. Edit the compose.yml to include your services.
2. Modify the scripts in docker/scripts to pre-populate the database, if required and create any localstack resources.
3. Test the setup locally with `docker compose up` and `npm run test`
4. Set up the workflow trigger in `.github/workflows/journey-tests`.

By default, the provided workflow will run when triggered manually from GitHub or when triggered by another workflow.

If you want to use the repository exclusively for running docker composed based test suites consider disabling the publish.yml workflow.

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government licence v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable
information providers in the public sector to license the use and re-use of their information under a common open
licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
