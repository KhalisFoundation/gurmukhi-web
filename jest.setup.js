const Bugsnag = require('@bugsnag/js');
const BugsnagPerformance = require('@bugsnag/browser-performance');

const BugSnagAPIKey = process.env.REACT_APP_BUGSNAG_API_KEY || '';

BugsnagPerformance.start({ apiKey: BugSnagAPIKey });
    Bugsnag.start({
    apiKey: BugSnagAPIKey,
    plugins: [new BugsnagPluginReact()],
    releaseStage: process.env.NODE_ENV,
});
