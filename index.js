#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const path = require('path');


// matches if this is a single line comment with some content after the '//'
const commentWithoutContent = /([ ]*)\/\//;
// matches if this is a single line comment without any content after the '//'
const commentWithContent = /([ ]*)\/\/(.+)/;


/**
 * @param {string} file - the file object which contains the info where to write to
 * @param {string} content - the files content
 *
 * depending on the optional user input, this function writes the content either
 * to the input file or the specified output file
 */
const writeFile = function writeFile({ filePath, prefix, output }, content) {
  const { ext, name, dir } = path.parse(filePath);
  let filename;

  if (prefix) {
    filename = path.format({ ext, name: `${ name }.${ prefix }`, dir });
  } else if (output) {
    filename = path.format({ base: output, dir });
  } else {
    filename = filePath;
  }
  fs.writeFileSync(filename, content, { encoding: 'utf8' });
};


/**
 * @param {string} line - the string to process
 * @param {string} contentSubstitut - what to replace with if there is content on this line after the '//'
 * @param {string} noContentSubstitut - what to replace with if it is just a comment without content after the '//'
 *
 * @returns {string} the replaced line content
 */
const replaceLineContent = function replaceLineContent(line, contentSubstitut, noContentSubstitut) {
  const contentExists = line.match(commentWithContent);
  if (contentExists) {
    return line.replace(commentWithContent, contentSubstitut);
  }
  return line.replace(commentWithoutContent, noContentSubstitut);
};


/**
 * @param {string} line - the string to process
 * @param {string} previousMatch - if the previous line was a comment
 * @param {string} nextMatch - if the next line is a comment
 *
 * @returns {string} the replaced line
 */
const replaceLine = function replaceLine(line, previousMatch, nextMatch) {
  if (previousMatch && nextMatch) {
    return replaceLineContent(line, '$1 *$2', '$1 *');
  } else if (previousMatch && !nextMatch) {
    return replaceLineContent(line, '$1 *$2\n$1 */', '$1 */');
  } else if (!previousMatch && nextMatch) {
    return replaceLineContent(line, '$1/**\n$1 *$2', '$1/**');
  } else {
    return line;
  }
};

/**
 * @param {object} file - the file object to process
 *
 * replaceFile is removing all single line comments which should be block comments
 */
const replaceFile = function replaceFile(file) {
  const { filePath } = file;
  const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
  const contentLines = fileContent.split('\n');

  const replacedLines = contentLines.map((line, index, contentLines) => {
    let previousMatch = null;
    let nextMatch = null;
    if (index > 0) {
      previousMatch = contentLines[index - 1].match(commentWithoutContent);
    }
    if (index < contentLines.length - 2) {
      nextMatch = contentLines[index + 1].match(commentWithoutContent);
    }

    return replaceLine(line, previousMatch, nextMatch);
  });

  const replacedContent = replacedLines.join('\n');
  writeFile(file, replacedContent);
};


/**
 * @param file - the file object to process
 *
 * replaceRecusive calls itself recusively for each folder it contains
 */
const replaceRecusive = function replaceRecusive(file) {
  const { filePath, prefix } = file;
  fs.stat(filePath, (err, stats) => {
    if (err) {
      throw err;
    }

    if (stats.isFile()) {
      replaceFile(file);
    } else if (stats.isDirectory()) {
      fs.readdir(filePath, (err, folderFiles) => {
        folderFiles.forEach((folderFile) => {
          replaceRecusive({ filePath: path.join(filePath, folderFile), prefix });
        });
      });
    }
  });
};


/**
 * @param {string} filePath
 *
 * checks initialy wheather the given path is a directory or
 * a file andhandles options and processing accordingly
 */
const init = function init(filePath) {
  fs.stat(filePath, (err, stats) => {
    if (stats.isFile()) {
      const file = { filePath };
      if (program.output) {
        file.output = program.output;
      }
      if (program.prefix) {
        file.prefix = program.prefix;
      }
      replaceFile(file);
    } else if (stats.isDirectory()) {
      if (program.prefix) {
        replaceRecusive({ filePath, prefix: program.prefix });
      } else {
        replaceRecusive({ filePath });
      }
    }
  });
};


/**
 * read user input and attach the handler
 */
program.arguments('<file>')
  .option('-o, --output <outputfile>', 'The file to write the output to. Default is the input file. Will be ignored if <file> is a folder.')
  .option('-p, --prefix <fileprefix>', 'Each processed filed will get the prefix inserted before the file extension. --prefix has priority over --output')
  .action(init)
  .parse(process.argv);
