
import React, { ReactNode } from 'react';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact, { BugsnagPluginReactResult } from '@bugsnag/plugin-react';
import BugsnagPerformance from '@bugsnag/browser-performance';
import { User } from 'firebase/auth';

type ErrorBoundaryProps = {
  user: User | null;
  children: ReactNode;
};

const ErrorBoundary = (props: ErrorBoundaryProps) => {
  const BugSnagAPIKey = process.env.REACT_APP_BUGSNAG_API_KEY || '';

  BugsnagPerformance.start({ apiKey: BugSnagAPIKey });
  Bugsnag.start({
    apiKey: BugSnagAPIKey,
    plugins: [new BugsnagPluginReact()],
    releaseStage: process.env.NODE_ENV,
    user: {
      id: props.user?.uid,
      email: props.user?.email || '',
      name: props.user?.displayName || '',
    },
  });

  const ErrorBoundaryWrap = (Bugsnag.getPlugin('react') as BugsnagPluginReactResult).createErrorBoundary(React);

  return (
    <ErrorBoundaryWrap>
      {props.children}
    </ErrorBoundaryWrap>
  );
};

export default ErrorBoundary;
