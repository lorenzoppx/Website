//const axios = require('axios');

async function download(){
    axios({
        url: 'http://localhost:3001/getUsers', //your url
        method: 'GET',
        responseType: 'blob', // important
    }).then((response) => {
        console.log(response);
        var blob = new Blob([response.data], {type: "application/json"});
        console.log(response.data);
        // create file link in browser's memory
        const href = URL.createObjectURL(response.data);
        console.log(href);
    
        // create "a" HTML element with href to file & click
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', 'file.json'); //or any other extension
        document.body.appendChild(link);
        //link.click();
        /*
        if (fileHandle) {
            const writableFileStream = fileHandle.createWritable();
            if (writableFileStream) {
                var taBlob = new Blob([response.data], { type: 'text/plain' });
                writableFileStream.write(taBlob);
                writableFileStream.close();
                // this.messageService.add({ severity: 'info', summary: 'Saved ok', detail: '' });
            }
        }
        */
        console.log(response.data);
        save(response.data);
    });
}
/*
// clean up "a" element & remove ObjectURL
document.body.removeChild(link);
URL.revokeObjectURL(href);
*/
async function save(content){
    const opts = {
        suggestedName: "sugested",
        types: [
          {
            description: "Text file",
            accept: { "application/json": [".json"] },
            /*accept: { "text/plain": [".txt"] },*/
          },
        ],
      };
    
    const fileHandle = await window.showSaveFilePicker(opts);
    writeFile(fileHandle,content);
}

async function writeFile(fileHandle, contents) {
    // Create a FileSystemWritableFileStream to write to.
    const writable = await fileHandle.createWritable();
  
    // Write the contents of the file to the stream.
    await writable.write(contents);
  
    // Close the file and write the contents to disk.
    await writable.close();
  }

async function saveAs(data) {
    const filename = 'conf1.conf';
    if ('showSaveFilePicker' in window) {
        const pickerOptions = {
            suggestedName: filename,
            types: [
                {
                    description: 'Text File',
                    accept: {
                        'text/plain': ['.conf'],
                    },
                },
            ],
        };

        const fileHandle = await (window).showSaveFilePicker(pickerOptions);
        if (fileHandle) {
            const writableFileStream = await fileHandle.createWritable();
            if (writableFileStream) {
                var taBlob = new Blob([data], { type: 'text/plain' });
                await writableFileStream.write(taBlob);
                await writableFileStream.close();
                // this.messageService.add({ severity: 'info', summary: 'Saved ok', detail: '' });
            }
        }
    }
} 