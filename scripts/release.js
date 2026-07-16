#!/usr/bin/env node

/**
 * Bumps the version in package.json and src/core/namespace.js and
 * commits only those two files.
 *
 * Refuses to run if there are uncommitted changes to any tracked
 * file - commit or stash those yourself first. Untracked files are
 * left alone (useful for local test/deploy scripts you don't want in
 * the repo), but are listed and require confirmation before
 * proceeding, in case something unexpected is sitting there.
 *
 * Usage:
 *   node scripts/release.js 1.1.0
 */

"use strict";

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { execSync } = require("child_process");

const repoRoot = path.join(__dirname, "..");
const packageJsonPath = path.join(repoRoot, "package.json");
const namespacePath = path.join(repoRoot, "src", "core", "namespace.js");

function fail(message) {
    console.error(`\n${message}`);
    process.exit(1);
}

function run(cmd) {
    execSync(cmd, { cwd: repoRoot, stdio: "inherit" });
}

function runCapture(cmd) {
    return execSync(cmd, { cwd: repoRoot, encoding: "utf8" }).trim();
}

function askYesNo(question) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close();
            resolve(/^y(es)?$/i.test(answer.trim()));
        });
    });
}


async function main() {

    const newVersion = process.argv[2];

    if (!newVersion) {
        fail("Usage: node scripts/release.js <version>  (e.g. node scripts/release.js 1.1.0)");
    }

    if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
        fail(`"${newVersion}" doesn't look like a version number (expected e.g. 1.1.0).`);
    }


    // --- Repo must be clean, aside from untracked files ---

    const statusLines = runCapture("git status --porcelain")
        .split("\n")
        .filter(Boolean);

    const trackedChanges = statusLines.filter(line => !line.startsWith("??"));
    const untrackedFiles = statusLines
        .filter(line => line.startsWith("??"))
        .map(line => line.slice(3));

    if (trackedChanges.length > 0) {
        fail(
            "Repo has uncommitted changes to tracked files:\n" +
            trackedChanges.map(l => `  ${l}`).join("\n") +
            "\nCommit or stash them yourself first, then re-run this script."
        );
    }

    if (untrackedFiles.length > 0) {
        console.log("Untracked files present (these will be left alone):");
        untrackedFiles.forEach(f => console.log(`  ${f}`));

        const proceed = await askYesNo("\nContinue with the version bump? (y/N) ");

        if (!proceed) {
            console.log("Aborted.");
            process.exit(0);
        }
    }


    // --- Update package.json ---

    let pkg;

    try {
        pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    } catch (err) {
        fail(`Could not parse package.json: ${err.message}`);
    }

    if (pkg.version === newVersion) {
        fail(`package.json is already at version ${newVersion}.`);
    }

    pkg.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + "\n");


    // --- Update namespace.js ---

    const versionLinePattern = /MDRecordSearch\.VERSION = "[^"]*";/;
    let namespaceSrc = fs.readFileSync(namespacePath, "utf8");

    if (!versionLinePattern.test(namespaceSrc)) {
        fail("Could not find the MDRecordSearch.VERSION line in namespace.js");
    }

    namespaceSrc = namespaceSrc.replace(
        versionLinePattern,
        `MDRecordSearch.VERSION = "${newVersion}";`
    );

    fs.writeFileSync(namespacePath, namespaceSrc);


    // --- Run tests before committing anything ---

    console.log("Running tests...");
    run("node --test test/**/*.test.js");


    // --- Commit the two version files ---

    run(`git add "${packageJsonPath}" "${namespacePath}"`);
    run(`git commit -m "Bump version to ${newVersion}"`);

    console.log(`\nDone. Committed the version bump to ${newVersion}.`);
    console.log("Push with: git push");
}


main();
