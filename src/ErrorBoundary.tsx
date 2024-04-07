
import React from 'react';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact, { BugsnagPluginReactResult } from '@bugsnag/plugin-react';
import BugsnagPerformance from '@bugsnag/browser-performance';

const BugSnagAPIKey = process.env.REACT_APP_BUGSNAG_API_KEY || '';

Bugsnag.start({
  apiKey: BugSnagAPIKey,
  plugins: [new BugsnagPluginReact()],
});

BugsnagPerformance.start({ apiKey: BugSnagAPIKey });
const ErrorBoundary = (Bugsnag.getPlugin('react') as BugsnagPluginReactResult).createErrorBoundary(React);
export default ErrorBoundary;
