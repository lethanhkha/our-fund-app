const fs = require('fs');
const path = require('path');

const appDir = 'app';
const uiDir = 'components/ui';

// Get actual filenames in components/ui
const actualFiles = fs.readdirSync(uiDir);
const actualNamesMap = new Map();
for (const file of actualFiles) {
    if (file.endsWith('.tsx')) {
        actualNamesMap.set(file.toLowerCase(), file);
    }
}

function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            processDirectory(fullPath);
        } else if (entry.isFile() && fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Regex to find imports like '@/components/ui/Something'
            const importRegex = /@\/components\/ui\/([a-zA-Z0-9_-]+)/g;

            content = content.replace(importRegex, (match, componentName) => {
                const searchName = componentName.toLowerCase() + '.tsx';
                if (actualNamesMap.has(searchName)) {
                    const actualName = actualNamesMap.get(searchName).replace('.tsx', '');
                    if (actualName !== componentName) {
                        console.log(`Fixing import in ${fullPath}: ${componentName} -> ${actualName}`);
                        modified = true;
                        return `@/components/ui/${actualName}`;
                    }
                }
                return match;
            });

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
            }
        }
    }
}

processDirectory(appDir);
console.log('Finished fixing imports.');
