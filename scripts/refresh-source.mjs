// Full refresh through the existing external Chrome session. Resumes checkpoints.
// Set PLAYWRIGHT_CLI_PATH; output/full-catalog contains the reviewable raw snapshot.
// Remove or archive those checkpoint files before starting a new dated snapshot.
await import('./collect-catalog.mjs');
await import('./import-catalog.mjs');
