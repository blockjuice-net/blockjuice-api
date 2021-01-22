const log     = require('logbootstrap');
var dotenv        = require('dotenv');
dotenv.config();

const algosdk = require('algosdk');

const port = '';
const token = {
    'X-API-Key': process.env.PURESTACK_KEY
};

let initClient = (url) => {
    return new algosdk.Algodv2(token, url, port);
};

let networks = {   
    main: {
        url: 'https://mainnet-algorand.api.purestake.io/ps2',
        idx: 'https://mainnet-algorand.api.purestake.io/idx2'
    },
    test: {
        url: 'https://testnet-algorand.api.purestake.io/ps2',
        idx: 'https://testnet-algorand.api.purestake.io/idx2'
    },
    beta: {
        url: 'https://betanet-algorand.api.purestake.io/ps2',
        idx: 'https://betanet-algorand.api.purestake.io/idx2'
    }
};

let purestack = {
    client: null,
    connect: (network) => {
        
        var isConnect = false;

        if (network == 'main') {
            this.client = initClient(networks.main.url);
            isConnect = true;
        } else if (network == 'test') {
            this.client = initClient(networks.test.url);
            isConnect = true;
        } else if (network == 'beta')  {
            this.client = initClient(networks.beta.url);
            isConnect = true;
        } else {
            isConnect = false;
        };
        return isConnect;
    },
    create_account: (callback) => {

        (async () => {

            var accountResponse = {
                address: '',
                secretKeyMnemonic: ''
            };

            let account = algosdk.generateAccount();
            log('info', '\nAddress: \n' + JSON.stringify(account));
            accountResponse.address = account.addr;
            accountResponse.secretKeyMnemonic = algosdk.secretKeyToMnemonic(account.sk);

            callback(null, accountResponse);

        })().catch(e => {
            callback(e, null)
        });

    },
    recovered_account: (mnemonic) => {

        return new Promise((resolve, reject) => {
            var ra = algosdk.mnemonicToSecretKey(mnemonic);
            resolve(algosdk.isValidAddress(ra.addr), ra.addr);

            if (algosdk.isValidAddress(ra.addr)) {
                resolve(ra.addr)
            } else {
                reject('not valid address')
            }

        });
    }
};

module.exports = purestack