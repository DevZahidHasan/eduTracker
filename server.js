const path = require('path');

// Next.js standalone server.js wrapper for iisnode
// This ensures that the named pipe provided by iisnode is used correctly.

const port = process.env.PORT;

// If port is not a number, it's likely a named pipe.
// We need to pass it as a string to the standalone server.
// However, the standalone server.js does parseInt(process.env.PORT, 10) || 3000.
// To bypass this, we can't easily change the standalone server.js without editing it.
// So we will modify the environment variable to be exactly what it expects if it's a pipe,
// but wait, parseInt will always fail on a pipe.

// Better approach: Use the same logic as the standalone server but without the parseInt bug.
// Or just fix the standalone server.js. Since it's a generated file, we can patch it.

const fs = require('fs');
const standaloneServerPath = path.join(__dirname, '.next', 'standalone', 'server.js');

if (fs.existsSync(standaloneServerPath)) {
    let content = fs.readFileSync(standaloneServerPath, 'utf8');
    if (content.includes('parseInt(process.env.PORT, 10) || 3000')) {
        console.log('Patching standalone server.js to support named pipes...');
        content = content.replace(
            'const currentPort = parseInt(process.env.PORT, 10) || 3000',
            'const currentPort = isNaN(parseInt(process.env.PORT, 10)) ? process.env.PORT : parseInt(process.env.PORT, 10) || 3000'
        );
        fs.writeFileSync(standaloneServerPath, content);
    }
}

require('./.next/standalone/server.js');
