#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');


// matches if this is a single line comment with some content after the '//'
const commentWithoutContent = /([ ]*)\/\//;
// matches if this is a single line comment without any content after the '//'
const commentWithContent = /([ ]*)\/\/(.+)/;


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
 * @param {string} file - the file to process
 *
 * replaceComments is removing all single line comments which should be block comments
 */
const replaceComments = function replaceComments(file) {
  const fileContent = fs.readFileSync(file, { encoding: 'utf8' });
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
 * @param {string} file - the file to write to
 * @param {string} content - the files content
 *
 * depending on the optional user input, this function writes the content either
 * to the input file or the specified output file
 */
const writeFile = function writeFile(file, content) {
  if (program.output) {
    fs.writeFileSync(program.output, content, { encoding: 'utf8' });
  } else {
    fs.writeFileSync(file, content, { encoding: 'utf8' });
  }
};

/**
 * read user input and attach the handler
 */
program.arguments('<file>')
  .option('-o, --output <outputfile>', 'The file to write the output to. Default is the input file.')
  .action(replaceComments)
  .parse(process.argv);
