import fs from 'node:fs';
import path from 'node:path';
import {Pool} from 'pg';
import dotenv from 'dotenv';
import {runImport} from './import/runner';
import {discoverSources} from './import/discover';

dotenv.config();

function moveToProcessed(sourceDir: string, processedDir: string): void {
    fs.mkdirSync(processedDir, {recursive: true});
    fs.renameSync(sourceDir, path.join(processedDir, path.basename(sourceDir)));
}

async function main(): Promise<void> {
    const args = process.argv.slice(2);

    const rawDirIdx = args.indexOf('--raw-dir');
    const rawDir = rawDirIdx !== -1 ? args[rawDirIdx + 1] : '/data/raw';

    const processedDirIdx = args.indexOf('--processed-dir');
    const processedDir = processedDirIdx !== -1 ? args[processedDirIdx + 1] : '/data/processed';

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('DATABASE_URL environment variable is required');
        process.exit(1);
    }

    console.log(`Scanning ${rawDir} for data sources...`);
    let sources;
    try {
        sources = discoverSources(rawDir);
    } catch (err) {
        console.error(`Failed to scan ${rawDir}: ${(err as Error).message}`);
        process.exit(1);
    }

    if (sources.length === 0) {
        console.log('No data sources found.');
        return;
    }

    console.log(`Found ${sources.length} source(s):`);
    for (const source of sources) {
        console.log(`  • ${source.sourceValue} (${path.basename(source.file)})`);
        if (source.nomColumn) console.log(`    nom          → column "${source.nomColumn}"`);
        if (source.typeProtectionColumn) console.log(`    type         → column "${source.typeProtectionColumn}"`);
        else if (source.typeProtectionValue) console.log(`    type         → "${source.typeProtectionValue}"`);
        if (source.gestionnaireColumn) console.log(`    gestionnaire → column "${source.gestionnaireColumn}"`);
        else if (source.gestionnaireValue) console.log(`    gestionnaire → "${source.gestionnaireValue}"`);
    }

    const pool = new Pool({connectionString});
    try {
        const result = await runImport(pool, sources);

        console.log('\n── Import Summary ──────────────────────────────');
        for (let i = 0; i < result.sources.length; i++) {
            const sourceResult = result.sources[i];
            const discovered = sources[i];

            if (sourceResult.error) {
                console.error(`  ✗ ${discovered.sourceValue}: ERROR – ${sourceResult.error}`);
            } else {
                console.log(
                    `  ✓ ${discovered.sourceValue}: ${sourceResult.inserted} inserted, ${sourceResult.corrected} corrected, ${sourceResult.skipped} skipped`,
                );
                if (sourceResult.skipped === 0) {
                    try {
                        moveToProcessed(discovered.sourceDir, processedDir);
                        console.log(`    → moved to ${processedDir}/${path.basename(discovered.sourceDir)}`);
                    } catch (err) {
                        console.warn(`    ⚠ Failed to move ${discovered.sourceDir}: ${(err as Error).message}`);
                    }
                } else {
                    console.log(`    ⚠ Not moved: ${sourceResult.skipped} feature(s) skipped`);
                }
            }
        }
        console.log('────────────────────────────────────────────────');
        console.log(`Total zones written: ${result.totalInserted}`);
    } finally {
        await pool.end();
    }
}

main().catch((err: unknown) => {
    console.error('Unexpected error:', err);
    process.exit(1);
});
