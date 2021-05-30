# Contributing Guidelines

Downstream is actively built and maintained by the [Technologies & International Development](http://tid.gatech.edu/) (T+ID) Lab at Georgia Tech to support the [Aggie platform](https://github.com/tid-lab/aggie) and other research initiatives. Outside contributions are welcome!

## Contribution Workflow

Downstream is written in TypeScript, and compiles to Node.js JavaScript.

**Node.js 12.9** or higher is required to use Downstream in your project.

Both members of the T+ID Lab and outside contributors should follow the workflow below:

1. Create a fork of the Downstream repo.

1. Install dependencies & development dependencies with `npm install`.

1. Make changes to your fork of the Downstream repo.

1. Write tests for changes in the `src/` folder, if necessary.

1. Write documentation in the `docs/` folder, if necessary.

1. Open a Pull Request between your fork and the `develop` branch.

## For T+ID Lab Members

### Merging Pull Requests

1. Assign yourself as a Reviewer to new Pull Request.

1. Review the PR and request changes as many times as needed.

1. Downstream uses [semantic versioning](https://semver.org/). If the PR is ready, merge it into `develop`. Determine whether the changes constitute a `PATCH`, `MINOR`, or `MAJOR` version bump.

1. Pull down `develop` to your local clone (not fork) of the Downstream repo.

1. From `develop`, run the `npm version <bump>` command:
    - Run `npm version patch` for `PATCH`-level changes.
    - Run `npm version minor` for `MINOR`-level changes.
    - Run `npm version major` for `MAJOR`-level changes.

The `npm version` script will check out `master`; merge the latest changes from `develop` into `master`; commit and tag the bumped version; push the tagged commit to the Downstream repo; check out `develop` once again; and finally rebase `develop` to `master`.

Meanwhile, Travis CI will pick up the new tag pushed to `master` and publish the latest version of Downstream to NPM for you automatically. Voila! The PR has been successfully merged.

## Tests

Downstream uses Mocha as a testing framework, and `ts-mocha` for TypeScript integration.

Run the Mocha tests for Downstream with one command:

```bash
npm test
```

### Built-in Components

**Note:** Tests for built-in components are disabled by default.

#### **Why?**

Built-in components rely on external resources such as external APIs that may change or require special access that may eventually be revoked. Contributors should be able to work on the rest of the Downstream repo without having to worry about such problems.

#### **What should I do?**

Enable and add to tests for built-in components while working on those components, but make sure to disable them when you are done. If you're an outside contributor working on a built-in component but don't have the API keys to test it, you may request in your Pull Request for the reviewer to run tests on your behalf using their keys.

