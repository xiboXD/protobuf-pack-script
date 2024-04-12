#!/usr/bin/env ts-node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

const scriptDir = process.argv[2];
console.log(`scriptDir: ${scriptDir}`);
const fileDir = process.argv[4]; 
console.log(`fileDir: ${fileDir}`);
const protoDir = process.argv[5];
console.log(`protoDir: ${protoDir}`);

if (!scriptDir || !fileDir || !protoDir) {
  console.error('Usage: node script.js <scriptDir> <fileDir> <protoDir>');
  process.exit(1);
}

const parentDir = path.join(fileDir, '..', '..', '..');
const clientDir = path.join(parentDir, 'client');
if (!fs.existsSync(clientDir)) {
  fs.mkdirSync(clientDir);
}

console.log(`${scriptDir}。`);

// Full paths to protoc and protoc-gen-ts_proto
const protocPath = path.join(scriptDir, 'node_modules', '.bin', 'protoc');
const protocGenTsPath = path.join(scriptDir, 'node_modules', '.bin', 'protoc-gen-ts_proto');

// Check if the specified directory exists
if (!fs.existsSync(fileDir) || !fs.statSync(fileDir).isDirectory()) {
  console.error(`Directory not found: ${fileDir}`);
  process.exit(1);
}

// Check if the specified protoDir exists
if (!fs.existsSync(protoDir) || !fs.statSync(protoDir).isDirectory()) {
  console.error(`Directory not found: ${protoDir}`);
  process.exit(1);
}

// Copy the contents of protoDir to fileDir using fs-extra
const aelfDir = path.join(fileDir, 'aelf');
try {
  if (!fs.existsSync(aelfDir)) {
    fs.mkdirSync(aelfDir);
  }
  fs.copySync(protoDir, aelfDir, { overwrite: true, recursive: true });
  console.log(`Copied contents of ${protoDir} to ${fileDir}`);
} catch (err) {
  console.error(`Error copying contents from ${protoDir} to ${fileDir}:`, err);
  process.exit(1);
}

// Get the list of .proto files in the specified directory
const protoFiles = fs.readdirSync(fileDir).filter(file => file.endsWith('.proto'));

if (protoFiles.length === 0) {
  console.log('No .proto files found in the specified directory.');
} else {
  // Directory to store generated TypeScript files

  // Iterate over each .proto file and generate TypeScript files
  protoFiles.forEach(protoFile => {
    const protoFilePath = path.join(fileDir, protoFile);

    // Execute protoc command for each .proto file
    try {
      execSync(`${protocPath} --ts_out ${clientDir} --plugin=protoc-gen-ts_proto=${protocGenTsPath} --proto_path ${fileDir} ${protoFilePath}`, {
        stdio: 'inherit',
        env: {
          ...process.env,
          PATH: `${path.join(scriptDir, 'node_modules', '.bin')}:${process.env.PATH}`,
        },
      });
      console.log(`Generated TypeScript files for ${protoFile}`);
    } catch (error) {
      console.error(`Error generating TypeScript files for ${protoFile}:`, error.message);
    }
  });

  console.log('Proto generated TypeScript files in "client" folder.');
}

// Additional logic to handle .proto files in aelfDir
const protoFilesInAelfDir = fs.readdirSync(aelfDir).filter(file => file.endsWith('.proto'));

if (protoFilesInAelfDir.length > 0) {
  // Iterate over each .proto file in aelfDir and generate TypeScript files
  protoFilesInAelfDir.forEach(protoFile => {
    const protoFilePath = path.join(aelfDir, protoFile);

    // Execute protoc command for each .proto file
    try {
      execSync(`${protocPath} --ts_out ${clientDir} --plugin=protoc-gen-ts_proto=${protocGenTsPath} --proto_path ${aelfDir} ${protoFilePath}`, {
        stdio: 'inherit',
        env: {
          ...process.env,
          PATH: `${path.join(scriptDir, 'node_modules', '.bin')}:${process.env.PATH}`,
        },
      });
      console.log(`Generated TypeScript files for ${protoFile}`);
    } catch (error) {
      console.error(`Error generating TypeScript files for ${protoFile}:`, error.message);
    }
  });

  console.log('Proto generated TypeScript files in "client" folder.');
}
