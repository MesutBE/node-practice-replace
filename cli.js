/* write a CLI interface for the "replace" function and your files

  command line arguments:
    1: the file you want to read from
    2: the old string to replace
    3: the new string to replace it with
    4: the file you want to write to

  examples:
  $ node cli.js the-book-of-sand.txt the any sand-the-any.txt
  $ node cli.js the-library-of-babel.txt f g library-f-g.txt

  behavior:
  : parse command line arguments from process.argv
    (let the user know if they are missing any arguments!)
  : read from the selected file in the './files' directory
  : use your logic function to create the new text
  : write to the new file
  : console.log a nice message letting the user know what happened

  little challenges:
  : -help
    if a user passes in "-help" as any command line argument,
    log a little description of how the CLI works
  : -list
    if a user passes in "-list" as any command line argument,
    log a list of all the file names in "./files"

*/

// require dependencies
const fs = require('fs');
const util = require('util');
const path = require('path');

const replace = require('./logic/index')

// declare constants
const ENTRIES_PATH = __dirname + '/files';
const DOC_STRING = `

COMMANDS:

  node cli.js <1> <2> <3> <4>

ARGUMENTS
  1: the file you want to read from
  2: the old string to replace
  3: the new string to replace it with
  4: the file you want to write to

Example command line with Arguments:
  $ node cli.js the-book-of-sand.txt the any sand-the-any.txt
  $ node cli.js the-library-of-babel.txt f g library-f-g.txt

FLAGS:

  -help
    print this helpful message

  -list
    print a list of all the file names in "./files"
`;


const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// --- begin main script ---


// step 0: log the docs for
if (process.argv.includes('-help')) {
  console.log(DOC_STRING);
  // this line tells Node to stop right now, done, end, finished.
  //  it's kind of like an early return, but for a node app
  process.exit(0);
}

const getFiles = (ENTRIES_PATH) => {
  try {
    return fs.readdirSync(ENTRIES_PATH);
  } catch (err) {
    console.error(err);
  }
};

// step 0: log the file names for user
if (process.argv.includes('-list')) {
  const list = getFiles(ENTRIES_PATH);
  list.forEach((element, index) => {
    console.log(index + 1, element);
  });

  // this line tells Node to stop right now, done, end, finished.
  //  it's kind of like an early return, but for a node app
  process.exit(0);
}


// Example command line with Arguments:
//   $ node cli.js the-book-of-sand.txt the any sand-the-any.txt
//   $ node cli.js the-library-of-babel.txt f g library-f-g.txt

process.argv.forEach((arg, index) => console.log(index, arg));
// console.log(process.argv[0]);
// console.log(process.argv[1]);
// console.log(process.argv[2]);
// console.log(process.argv[3]);
// console.log(process.argv[4]);
// console.log(process.argv[5]);

 
const readChangeWriteFile = async (filePathToRead, oldString, newString, filePathToWrite) => {
  console.log(`Reading..`);
  const fileContent = await readFile(filePathToRead, 'utf-8');

  console.log(`Replacing..`);
  const newText = replace(fileContent, oldString, newString);
  
  console.log(`Writing..`);
  await writeFile(filePathToWrite, newText);
}

entriesManager(process.argv[2], process.argv[3], process.argv[4], process.argv[5])


// step 1: declare main app function
function entriesManager(fileNameToRead, oldString, newString, newFileName) {


  // step 2: to make sure filename is defined
  //  alert the user and exit early if it is not
  if (fileNameToRead === undefined) {
    console.log(`a filename is required  \nSee "node file.js -help"`);
    process.exit(0);
  }

  // step 3: to make sure old string and new string are defined
  //  alert the user and exit early if it is not
  if (oldString === undefined || newString === undefined) {
    console.log(`a old string and new string is required  \nSee "node file.js -help"`);
    process.exit(0);
  }

  // step 4: to make sure new file name is defined
  //  alert the user and exit early if it is not
  if (newFileName === undefined) {
    console.log(`a new filename is required  \nSee "node file.js -help"`);
    process.exit(0);
  }

  readChangeWriteFile(path.join(ENTRIES_PATH, fileNameToRead), oldString, newString, path.join(ENTRIES_PATH, newFileName));
};

module.exports = readChangeWriteFile;