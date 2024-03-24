hound = require('hound')

// Create a directory tree watcher.
watcher = hound.watch('../csv')

// Create a file watcher.
//watcher = hound.watch('../csv/file.txt')

// Add callbacks for file and directory events.  The change event only applies
// to files.
watcher.on('create', function(file, stats) {
  console.log(String(file).split("\\")[1] + ' was created')
  console.log('Start the upload to MongoDB..')

  const { spawn } = require("child_process");
  /*  
  var ls = spawn('wsl tr \"|\" \"\t\" < file.csv | mongoimport --type csv --db testdb --collection nova --headerline', {
    shell: true,
    stdio: 'inherit',
    });
  */
  var ls = spawn(`wsl tr "|" "\\t" < ../csv/${String(file).split("\\")[1]} | mongoimport --type tsv --db testdb --collection ${String(file).split("\\")[1].split(".")[0]} --headerline`,{ shell: true });
  
  //const ls = spawn('wsl tr \'|\' \'\t\' \'<\' file.csv | mongoimport --type tsv \
  //--db testdb --collection nova --headerline');
  //String(file).split('.')[0]
  
  ls.stdout.on("data", data => {
      console.log(`stdout: ${data}`);
  });
  
  ls.stderr.on("data", data => {
      console.log(`stderr: ${data}`);
  });
  
  ls.on('error', (error) => {
      console.log(`error: ${error.message}`);
  });
  
  ls.on("close", code => {
      console.log(`child process exited with code ${code}`);
  });
  
});
watcher.on('change', function(file, stats) {
  console.log(file + ' was changed')
});
watcher.on('delete', function(file) {
  console.log(file + ' was deleted')
});

// Unwatch specific files or directories.
//watcher.unwatch('/tmp/another_file')

// Unwatch all watched files and directories.
//watcher.clear()

/*
const fs = require('fs')
fs.watch('../csv', (eventType, filename) => {
    console.log(eventType);
    // could be either 'rename' or 'change'. new file event and delete
    // also generally emit 'rename'
    console.log(filename);
})
*/