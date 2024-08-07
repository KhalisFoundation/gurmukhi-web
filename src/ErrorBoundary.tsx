
import React, { PropsWithChildren } from 'react';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact, { BugsnagPluginReactResult } from '@bugsnag/plugin-react';
import BugsnagPerformance from '@bugsnag/browser-performance';

const ErrorBoundary = (props: PropsWithChildren) => {
  const BugSnagAPIKey = process.env.REACT_APP_BUGSNAG_API_KEY || '';

  BugsnagPerformance.start({ apiKey: BugSnagAPIKey });
  Bugsnag.start({
    apiKey: BugSnagAPIKey,
    plugins: [new BugsnagPluginReact()],
    releaseStage: process.env.NODE_ENV,
  });

  const ErrorBoundaryWrap = (
    Bugsnag.getPlugin('react') as BugsnagPluginReactResult
  ).createErrorBoundary(React);

  return <ErrorBoundaryWrap>{props.children}</ErrorBoundaryWrap>;
};

export default ErrorBoundary;
