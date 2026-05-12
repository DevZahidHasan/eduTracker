const fs = require('fs');
const path = require('path');

// 1. CONFIGURATION
const BUILD_PATH = __dirname;
// We use '.' to make the paths relative, which makes the build portable 
// to any folder on your IIS server without hardcoding the path.
const RELATIVE_PATH = '.'; 

// The files Next.js generates that contain the broken paths
const standaloneDir = path.join(__dirname, '.next', 'standalone');
const serverJs = path.join(standaloneDir, 'server.js');
const serverFilesJson = path.join(standaloneDir, '.next', 'required-server-files.json');

function fixFiles() {
    [serverJs, serverFilesJson].forEach(filePath => {
        if (!fs.existsSync(filePath)) {
            console.log(`File not found: ${filePath}`);
            return;
        }

        let content = fs.readFileSync(filePath, 'utf8');

        // Fix 1: Replace hardcoded absolute paths with a relative one
        // This handles both backslashes and forward slashes if necessary
        const normalizedBuildPath = BUILD_PATH.replace(/\\/g, '\\\\');
        content = content.split(normalizedBuildPath).join(RELATIVE_PATH);
        content = content.split(BUILD_PATH).join(RELATIVE_PATH);

        // Fix 2: Specifically for server.js - Fix the port logic for iisnode
        if (filePath.endsWith('server.js')) {
            content = content.replace(
                'const currentPort = parseInt(process.env.PORT, 10) || 3000',
                'const currentPort = process.env.PORT && isNaN(process.env.PORT) ? process.env.PORT : (parseInt(process.env.PORT, 10) || 3000)'
            );
        }

        fs.writeFileSync(filePath, content);
        console.log(`Successfully sanitized: ${filePath}`);
    });
}

fixFiles();
