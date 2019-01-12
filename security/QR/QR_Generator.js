const firebase = require('firebase');
const admin = require('firebase-admin');

const security_constants = require('../../utils/security_constants');

const keygen = require("keygenerator");
const QRcode = require("qrcode");

function QR_Generator() {

    // Function to return a QR code based on a given seed
    this.getNewCode = function(seed) {
        var code = QRcode.toString(seed, {
            errorCorrectionLevel: QR_ERROR_COR_LVL
        }, function(err, url) {
            console.log('Generating QR code based on seed "' + seed + '" using error correction level ' + QR_ERROR_COR_LVL)
            console.log(url)
        })
        return code;
    }

    this.saveCodeToFile = function(seed) {
        var path = 'security/QR/images/' + seed + '.png';
        QRcode.toFile(path, seed, {
            color: {
                dark: '#182319', // Blue dots
                light: '#ffffff' // Transparent background
            },
            errorCorrectionLevel: QR_ERROR_COR_LVL,
        }, function(err) {
            if (err) throw err
            console.log('Created and saved new QR code as a png image to path: ' + path);
        })
    }

}
module.exports = QR_Generator;
