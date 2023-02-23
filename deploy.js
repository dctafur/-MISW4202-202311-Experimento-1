const { join } = require('path');
const { log } = require('console');
const { exec } = require('child_process');
const { readFileSync, unlinkSync } = require('fs');

// -----------------------------------------------------------------------------------------------------
// @ Methods
// -----------------------------------------------------------------------------------------------------

/**
 * Create and display a loader in the console with the given text
 */
const loading = (text) => {
  const chars = ['⠙', '⠘', '⠰', '⠴', '⠤', '⠦', '⠆', '⠃', '⠋', '⠉'];
  let x = 0;

  return setInterval(() => {
    process.stdout.write('\r' + chars[x++] + ' ' + text);
    x = x % chars.length;
  }, 100);
};

/**
 * Read the project configuration
 */
const readConfigSync = () => {
  const config = join(__dirname, 'config.json');
  return JSON.parse(readFileSync(config, 'utf8'));
};

/**
 * Execute the given command
 */
const execute = async (cmd) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout) => {
      if (error) return reject(error);
      else return resolve(stdout);
    });
  });
};

/**
 * Clean the project template
 */
const cleanTemplate = (config) => {
  try {
    unlinkSync(join(__dirname, `packaged-${config.template}`));
  } catch {
    // This means packaged template was already cleaned.
  }
};

/**
 * Package the project template
 */
const packageTemplate = async (config) => {
  const template = join(__dirname, config.template);
  const packagedTemplate = join(__dirname, `packaged-${config.template}`);

  const cmd =
    `aws cloudformation package` +
    ` --template-file ${template}` +
    ` --output-template-file ${packagedTemplate}` +
    ` --s3-bucket ${config.bucket}` +
    ` --s3-prefix ${config.stack}` +
    ` --profile ${config.profile}`;

  await execute(cmd);
};

/**
 * Deploy the project packaged template
 */
const deployTemplate = async (config) => {
  const packagedTemplate = join(__dirname, `packaged-${config.template}`);

  const cmd =
    `aws cloudformation deploy` +
    ` --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND` +
    ` --template-file ${packagedTemplate}` +
    ` --stack-name ${config.stack}` +
    ` --profile ${config.profile}`;

  await execute(cmd);
};

/**
 * Build and deploy the resources
 */
const deploy = async () => {
  const config = readConfigSync();
  cleanTemplate(config);
  await packageTemplate(config);
  await deployTemplate(config);
};

// -----------------------------------------------------------------------------------------------------
// @ Entry point
// -----------------------------------------------------------------------------------------------------

const main = async () => {
  const loader = loading('Deploying template...');
  try {
    await deploy();
    clearInterval(loader);
    log("\n Template deployed successfully!");
  } catch (error) {
    clearInterval(loader);
    log("\n Bad things happens! Here's what:", error.message);
  }
};

if (require.main === module) main();
