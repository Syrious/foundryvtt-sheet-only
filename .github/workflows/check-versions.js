var fs = require('fs');

var moduleVersion = JSON.parse(fs.readFileSync('module.json', 'utf8')).version;
var gitTag = process.env.GITHUB_REF.split('/').pop();

if (gitTag !== moduleVersion) {
    console.error('Version in module.json does not match with Git Tag. Failing the build.');
    process.exit(1);
} else {
    console.log('Version in module.json matches with the Git Tag.');
}