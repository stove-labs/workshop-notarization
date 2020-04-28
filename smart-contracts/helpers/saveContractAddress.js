const { outputFile } = require('fs-extra');
module.exports = (name, address) => {
    console.log(`${process.cwd()}/deployments/${name}.js`);
    return outputFile(
        `${process.cwd()}/deployments/${name}.js`,
        `module.exports = "${address}";`
    );
};