#!/usr/bin/env node
/**
 * Accessibility audit using axe-core
 * Run with: node scripts/accessibility-audit.js
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const axe = require('axe-core');

const ROOT = path.resolve(__dirname, '..');

// Pages to audit
const PAGES = [
    'index.html',
    'apps/psi-gym.html',
    'apps/arcana-goetia.html',
    'apps/norse-rune-oracle.html',
    'apps/lunar-phase-calculator.html',
    'apps/iching-oracle.html',
    'apps/chaos-sigil-generator.html',
    'apps/unofficial-rider-waite-tarot.html',
    'apps/dream-machine.html',
    'apps/astral-lab.html',
    'apps/eerieroads.html',
    'apps/lucid-dream.html',
    'apps/noctem-tools.html',
    'books/manual-activacion-servidores-magicos-pdf.html',
    'books/tratado-runas-cazadoras-caos-pdf.html',
    'books/ouija-cazadora-pdf.html',
    'books/liber-lvpinux-pdf.html',
    'books/codex-chaoticus-pdf.html',
    'books/tarot-chaos-pdf.html',
    'books/mind-the-gap-pdf.html',
    'blog/best-sigil-generator-app-onetime.html',
    'blog/zener-cards-esp-training-guide.html',
    'blog/chaos-magick-beginners-complete-guide.html',
];

async function auditPage(pagePath) {
    const fullPath = path.join(ROOT, pagePath);
    const html = fs.readFileSync(fullPath, 'utf-8');
    
    const dom = new JSDOM(html, {
        url: `https://cha0smagicklabs.com/${pagePath}`,
        resources: 'usable',
        runScripts: 'outside-only',
    });
    
    const window = dom.window;
    const document = window.document;
    
    try {
        const results = await axe.run(document, {
            runOnly: {
                type: 'tag',
                values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
            },
            resultTypes: ['violations', 'passes', 'incomplete', 'inapplicable'],
        });
        
        return {
            page: pagePath,
            violations: results.violations,
            passes: results.passes.length,
            incomplete: results.incomplete.length,
            inapplicable: results.inapplicable.length,
        };
    } catch (error) {
        return {
            page: pagePath,
            error: error.message,
        };
    }
}

async function main() {
    console.log('Starting accessibility audit...\n');
    
    const results = [];
    for (const page of PAGES) {
        console.log(`Auditing: ${page}...`);
        const result = await auditPage(page);
        results.push(result);
    }
    
    // Summary
    console.log('\n=== ACCESSIBILITY AUDIT SUMMARY ===\n');
    
    let totalViolations = 0;
    let criticalViolations = 0;
    let seriousViolations = 0;
    let moderateViolations = 0;
    let minorViolations = 0;
    
    for (const result of results) {
        if (result.error) {
            console.log(`${result.page}: ERROR - ${result.error}`);
            continue;
        }
        
        const v = result.violations;
        totalViolations += v.length;
        
        for (const violation of v) {
            if (violation.impact === 'critical') criticalViolations++;
            else if (violation.impact === 'serious') seriousViolations++;
            else if (violation.impact === 'moderate') moderateViolations++;
            else if (violation.impact === 'minor') minorViolations++;
        }
        
        if (v.length > 0) {
            console.log(`${result.page}: ${v.length} violations (${result.passes} passes)`);
            for (const violation of v) {
                console.log(`  [${violation.impact.toUpperCase()}] ${violation.id}: ${violation.help}`);
                console.log(`    Nodes: ${violation.nodes.length}`);
            }
        } else {
            console.log(`${result.page}: PASS (${result.passes} passes)`);
        }
    }
    
    console.log('\n=== TOTALS ===');
    console.log(`Total violations: ${totalViolations}`);
    console.log(`  Critical: ${criticalViolations}`);
    console.log(`  Serious: ${seriousViolations}`);
    console.log(`  Moderate: ${moderateViolations}`);
    console.log(`  Minor: ${minorViolations}`);
    
    // Write detailed report
    const reportPath = path.join(ROOT, 'accessibility-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\nDetailed report saved to: ${reportPath}`);
}

main().catch(console.error);