/*jslint node: true */
/*global doh, voloLib */
'use strict';

var q = require('q'),
    main = require(voloLib + '/../volo'),
    start = q.defer(),
    fs = require('fs'),
    path = require('path'),
    file = require(voloLib + '/file'),
    cwd = process.cwd(),
    dir = __dirname,
    testDir = path.join(dir, 'output'),
    end;

//Clean up old test output, create a fresh directory for it.
end = start.promise.then(function () {
    return file.rm(testDir);
})
.then(function () {
    fs.mkdirSync(testDir);
    process.chdir(testDir);
})

.then(function () {
    return main(['create', 'simple', '../support/simple']);
})
.then(function () {
    process.chdir('simple');

    return main(['foo', 'style=galactic', 'future=backlit'],
        function (result) {
        console.log(result);
        doh.register("volofileSimple",
            [
                function volofileSimple(t) {
                    var universalPath = path.join('universal.txt');
                    t.is(true, file.exists(universalPath));
                    t.is('galacticModified is backlit', fs.readFileSync(universalPath, 'utf8'));
                }
            ]
        );
        doh.run();
    });
})
.then(function (result) {
    process.chdir('..');
})

//Testing that string commands work, and that array of strings work. Also
//includes a depends test.
.then(function () {
    return main(['create', 'shell', '../support/shell']);
})
.then(function () {
    process.chdir('shell');

    return main(['copy'],
        function (result) {
        console.log(result);
        doh.register("volofileShell",
            [
                function volofileShell(t) {
                    t.is('HELLO WORLD', fs.readFileSync(path.join('final.txt'), 'utf8'));
                }
            ]
        );
        doh.run();
    });
})
.then(function (result) {
    process.chdir('..');
})


.then(function (result) {
    process.chdir(cwd);
});

module.exports = {
    start: start,
    end: end
};
