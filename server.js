const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const util = require('util');

const replace = require('./logic');
const func = require('./cli')

const app = express();
app.use(cors());
app.use(bodyParser.json());

const ENTRIES_PATH = __dirname + '/files';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readDir = util.promisify(fs.readdir);

function jsonOK(res, data) {
    res.json({ status: 'ok', ...data });
}

// GET: '/files'
// response: {status: 'ok', files: ['all.txt','file.txt','names.txt']}


app.get('/files', async (req, res) => {
    try {
        const content = await readDir(ENTRIES_PATH)

        jsonOK(res, { files: content });

    } catch (err) {
        console.log('Error', err.message);
    }
});

// POST: '/files/add/:name'
//  body: {text: "file contents"}
//  write a new file into ./files with the given name and contents
// redirect -> GET: '/files'

app.post('/files/add/:name', async (req, res) => {

    const name = req.params.name;
    const contents = req.body.text;
    console.log(name, contents);
    
    try {
        await writeFile(path.join(ENTRIES_PATH, name), contents, 'utf-8')
        res.redirect('/files');
    } catch (err) {
        console.log('Error', err.message);
    }
});

// PUT: '/files/replace/:oldFile/:newFile'
//  body: {toReplace: "str to replace", withThis: "replacement string"}
//  route logic:
//    read the old file
//    use the replace function to create the new text
//    write the new text to the new file name
//  note - params should not include .txt, you should add that in the route logic
// failure: {status: '404', message: `no file named ${oldFile}`  }
// success: redirect -> GET: '/files'

app.put('/files/replace/:oldFile/:newFile', async (req, res) => {

    const oldFile = req.params.oldFile;
    const newFile = req.params.newFile;
    const toReplace = req.body.toReplace;
    const withThis = req.body.withThis;

    try {
        const readChangeWriteFile = async (filePathToRead, oldString, newString, filePathToWrite) => {
            console.log(`Reading..`);
            const fileContent = await readFile(filePathToRead, 'utf-8');

            console.log(`Replacing..`);
            const newText = replace(fileContent, oldString, newString);

            console.log(`Writing..`);
            await writeFile(filePathToWrite, newText);
        }

        readChangeWriteFile(path.join(ENTRIES_PATH, oldFile), toReplace, withThis, path.join(ENTRIES_PATH, newFile))
    } catch (err) {
        console.log('Error', err.message);
        res.status(404).message(`no file named ${oldFile}`)
    }
});



// GET: '/report'
//  reads the contents from ./test/report.json and sends it
// response: {status: 'ok', report }

app.get('/report', async (req, res) => {
    console.log(path.join(ENTRIES_PATH, './test/report.json'));
    
    try {
        const content = await readFile(path.join(ENTRIES_PATH, '../test/report.json'));
        const parsed = JSON.parse(content);
         
        jsonOK(res, { report: parsed.stats});

    } catch (err) {
        console.log('Error', err.message);
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Replacer is serving at http://localhost:${port}`));
