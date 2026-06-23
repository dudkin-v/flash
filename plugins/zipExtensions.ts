import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import type { Plugin } from 'vite';

export function zipExtensions(): Plugin {
    return {
        name: 'zip-extensions',
        buildStart() {
            const root = resolve(__dirname, '..');
            const outDir = resolve(root, 'public/downloads');
            const extDir = resolve(root, 'extensions/chromeAutofill');

            if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

            try {
                execSync(
                    `zip -r "${outDir}/flash-autofill.zip" .`,
                    { cwd: extDir, stdio: 'ignore' }
                );
            } catch {
                console.warn('[zip-extensions] Failed to zip extension');
            }
        },
    };
}
