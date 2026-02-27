const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'app');

function getRelativePath(fromPath, toPath) {
    let rel = path.relative(path.dirname(fromPath), toPath);
    // Replace backslashes with forward slashes for imports
    rel = rel.replace(/\\/g, '/');
    if (!rel.startsWith('.')) {
        rel = './' + rel;
    }
    return rel;
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
            // and replace with relative paths
            const importRegex = /@\/([a-zA-Z0-9_\-\/]+)/g;

            content = content.replace(importRegex, (match, importPath) => {
                // Determine the absolute path of the target
                const targetPath = path.join(__dirname, importPath);

                // Get the relative path from the current file's directory to the target file
                // We assume the target is either a file (e.g., .ts, .tsx) or a directory with index
                // In generic case, we just calculate the relative directory path and append the import path

                let rel = getRelativePath(fullPath, targetPath);

                console.log(`Updating ${fullPath}: ${match} -> ${rel}`);
                modified = true;
                return rel;
            });

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
            }
        }
    }
}

processDirectory(appDir);
console.log('Finished replacing with relative paths in app directory.');
