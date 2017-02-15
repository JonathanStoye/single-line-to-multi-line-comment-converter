# js-comment-replacer
Replaces single line comments in js with block comments if appropriate. 

### E.g.:

```
  //
  // Request smth
  //
  // @param {mixed} array of smth
  // @return {promise}
  //
  
  // single line comment
  
  // ##################################
  //
  // Private methods
  //
  // #################################
```

will turn into

```
  /**
   * Request smth
   *
   * @param {mixed} array of smth
   * @return {promise}
   */
   
   // single line comment
   
   /**
   * ##################################
   *
   * Private methods
   *
   * #################################
   */
```

### Usage

```
node index.js testFile.js
```

or

```
node index.js testfolder/
```

Use `-o outputfile` to specify an outputfile instead of replacing the comments in the input file. (ignored on folders)

```
node index.js testFile.js -o testFile.parsed.js
```

or use `-p prefix` to specify a prefix attach to the processed file(s).

```
node index.js testFile.js -p parsed
```

will result in

```
testFile.js (unchanged)
testFile.parsed.js (parsed file)
```

Use `-h --help` to display this options.
