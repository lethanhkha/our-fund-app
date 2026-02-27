const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dir = 'components/ui';

// Get all files tracked by git
const gitFiles = execSync(`git ls-files ${dir}`).toString().trim().split('\n');

for (const gitPath of gitFiles) {
    if (!gitPath.trim()) continue;

    const basename = path.basename(gitPath);
    const expectedBasename = basename.charAt(0).toUpperCase() + basename.slice(1);

    if (basename !== expectedBasename) {
        console.log(`Fixing casing for: ${gitPath} -> ${expectedBasename}`);
        try {
            // Need to use a temporary name for case-only changes on case-insensitive filesystems
            const dirname = path.dirname(gitPath);
            const tempPath = path.join(dirname, basename + '.temp');
            const newPath = path.join(dirname, expectedBasename);

            // Revert changes if uncommitted on Windows? Better to just do git mv
            execSync(`git mv -f "${gitPath}" "${tempPath}"`);
            execSync(`git mv -f "${tempPath}" "${newPath}"`);
        } catch (e) {
            console.error(e);
        }
    }
}
console.log('Done fixing casing.');
