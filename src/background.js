'use strict';

// Package
const crypto = require('crypto');
const Secp256k1 = require('@enumatech/secp256k1-js');
const sha256 = require('sha256');
const Buffer = require('buffer').Buffer;

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

// To save pending Login Request from website
var RequestLoginPendings = [];
var RequestRegisterPendings = [];



// Chrome Oninstall call once when extension is first install
chrome.runtime.onInstalled.addListener(
  () => {
    chrome.storage.sync.clear(); 
    // let key = {
    //   "192.168.18.2" : {
    //       privatekey : "15801D24DC15E070F68AB51E148468B0962A11AC70E1077B0FB0535633A8684A",
    //       publickey  : "12cb3d6c24dca86c7673cbcda89273b0ef55dd7013f9279bcf62634028802fd14086e99e42fa57ab7b8ea1846906391eb3c20d794d6c3eda0348297f5e1aed00"
    //   }
    // };

    // chrome.storage.sync.set(key, function(){
    //   console.log("first dump data key has been save")
    // });

  }
);



// Handling DSA login button click
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
 
  DsaLoginClick(request, sender, sendResponse).then(result=>{
    sendResponse = result
  });

  // Return true mean this function listner will be asynchronous
  return true;
  
});


// Function DSAloginclick. get data from use click login at webpage then contentscript will
// listen to that and sending it to background js

async function DsaLoginClick(request, sender, sendResponse)
{
  if (request.type === 'DSA_LOGIN_BUTTON_CLICK') {

    // Check If the request to the same host has been make before. can't make if the first has not been close
    let isRequestAlreadyPending = RequestLoginPendings.find( p=> p.hostname === request.payload.hostname )
    if(isRequestAlreadyPending)
    {
      return sendResponse({error: "Request Login Telah dibuat sebelumnya, close login pop-up terlebih dahulu jika ingin membuka baru"});
      
    }

    // Check IF extension has a key for host or user not yet register on that website
    let keys = await getFromstorage(request.payload.hostname);

    if(!keys) return sendResponse({error: "Extension has no key pair for this host :("});

    // Store login request to temp variable
    let hostlogindata = {
      hostname : request.payload.hostname,
      random : request.payload.random,
      timestamp: request.payload.timestamp,
      tab_id : sender.tab.id,
      privatekey : keys[request.payload.hostname].privatekey,
      publickey : keys[request.payload.hostname].publickey,
    };


   
    // Creating New login Pop up windows
    chrome.windows.create({
      focused: true,
      width: 400,
      height: 600,
      type: 'popup',
      url: 'pages/login.html',
      top: 200,
      left: 400
    },
     (window) => {
          // Getting tabid of newly created popup
          hostlogindata.popuptabid = window.tabs[0].id;
          //save temp logindata to RequestLoginPendings
          RequestLoginPendings.push(hostlogindata);
     
    })
   
    // Send response success
    return sendResponse({status: "success"});
  }
}



//Helper function to get storage data
async function getFromstorage(key)
{
  return new Promise((resolve, reject)=>{
    chrome.storage.sync.get(key, resolve)
  }).then(result => {
     return result;
  })
}



// If loginjs has finish load, it will send message to backgroundjs, background js will receive that and response with hostname
chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
  if(request.type === "POPUP_LOGIN_REQUEST_DATA_BACKGROUND"){
     let loginpending = RequestLoginPendings.find( p => p.popuptabid === sender.tab.id);

     sendResponse({
        hostname : loginpending.hostname
     })
  }
});


// this listener will receive message from popup login and receive use choice, login or abort
chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
  if(request.type === "POPUP_LOGIN_USER_CLICK_BUTTON_BACKGROUND"){

    // getting tabid of sender
    let loginpending = RequestLoginPendings.find( p => p.popuptabid === sender.tab.id);
    let statusApprove = request.payload.approve;
    
    if(statusApprove)
    {
        // Sign random + timestamp data with privet key and append to loginpending
        loginpending.signature = singMessageEcdsa(loginpending.privatekey, (loginpending.random + loginpending.timestamp));
    }

    let datapayloads = {
      approve : statusApprove
    };
    
    if(statusApprove)
    {
      datapayloads.random = loginpending.random;
      datapayloads.timestamp = loginpending.timestamp;
      datapayloads.signature = loginpending.signature;
      datapayloads.publickey = loginpending.publickey;
    }
    // Send message to content script that request the login
    chrome.tabs.sendMessage(
      loginpending.tab_id,
      {
        type: 'BACKGROUND_TO_CONTENTJS_LOGIN_USER_POPUP_CHOICE',
        payload: datapayloads,
      },
      response => {
        
      }
    );

    // Remove request login from RequestLoginPendings

    RequestLoginPendings = RequestLoginPendings.filter(p => p.hostname != loginpending.hostname)

    // Send response for the last time to popup login
     sendResponse({status: "success"})
     // After All Finish, Remove popup tab
     setTimeout(()=>{
      chrome.tabs.remove( loginpending.popuptabid, ()=>{})
     }, 250)

  }
});


// Function to sign data with private key
function singMessageEcdsa(privatekeyhex, msgString)
{
  // Kind of wierd, Must Trim string before put it on sha256, maybe there is white space left
   msgString = msgString.trim();
   let bp = Buffer.from(privatekeyhex, "hex");
   let privatekey = Secp256k1.uint256(bp, 16);
   let datahash = sha256(msgString);

   let digest = Secp256k1.uint256(datahash, 16);

   let signature = Secp256k1.ecsign(privatekey, digest);
   return signature;
}






// Handling DSA REGISTER GENERATE BUTTON CLICK
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
 
  DsaRegisterGenerateClick(request, sender, sendResponse).then(result=>{
    sendResponse = result
  });

  // Return true mean this function listner will be asynchronous
  return true;
  
});


async function DsaRegisterGenerateClick(request, sender, sendResponse)
{
  if (request.type === 'DSA_REGISTER_GENERATE_BUTTON_CLICK') {

    // Check If the request to the same host has been make before. can't make if the first has not been close
    let isRequestAlreadyPending = RequestRegisterPendings.find( p=> p.hostname === request.payload.hostname )
    if(isRequestAlreadyPending)
    {
      return sendResponse({error: "Request Generate Telah dibuat sebelumnya, close pop-up terlebih dahulu jika ingin membuka baru"});
      
    }

    // Check IF extension has a key for host or user not yet register on that website
    let keys = await getFromstorage(request.payload.hostname);


    if(Object.keys(keys).length) return sendResponse({error: "Extension Menditeksi Anda telah mendaftar di website ini sebelumnya dan anda hanya perlu login saja "});

    let hostregisterdata = {
      hostname : request.payload.hostname,
      tab_id : sender.tab.id,
    }
    // Creating New Register Generate Keypair Pop up windows
    chrome.windows.create({
      focused: true,
      width: 400,
      height: 600,
      type: 'popup',
      url: 'pages/register.html',
      top: 200,
      left: 400
    },
     (window) => {
          // Getting tabid of newly created popup
          hostregisterdata.popuptabid = window.tabs[0].id;
          //save temp registerdata to RequestRegisterPendings
          RequestRegisterPendings.push(hostregisterdata);
     
    })
   
    // Send response success
    return sendResponse({status: "success"});

  }

}
// If loginjs has finish load, it will send message to backgroundjs, background js will receive that and response with hostname
chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
  if(request.type === "POPUP_REGISTER_REQUEST_DATA_BACKGROUND"){
     let registerpending = RequestRegisterPendings.find( p => p.popuptabid === sender.tab.id);

     sendResponse({
        hostname : registerpending.hostname
     })
  }
});




// this listener will receive message from popup login and receive use choice, login or abort
chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
  if(request.type === "POPUP_REGISTER_GENERATE_USER_CLICK_BUTTON_BACKGROUND"){

    // getting tabid of sender
    let registerpending = RequestRegisterPendings.find( p => p.popuptabid === sender.tab.id);
    let statusApprove = request.payload.approve;
    
    let datapayloads = {
      approve : statusApprove
    };
    
    if(statusApprove)
    {
      let key = generatePrivatePublicKey();
      datapayloads.publickey = key.publickey;
      let keystore = {
        [registerpending.hostname] : {
            privatekey : key.privatekey,
            publickey  : key.publickey
        }
      };
  
      chrome.storage.sync.set(keystore, function(){
        console.log("Key has been Save")
        console.log(JSON.stringify(keystore))
      });



    }
    // Send message to content script that request the public key generate
    chrome.tabs.sendMessage(
      registerpending.tab_id,
      {
        type: 'BACKGROUND_TO_CONTENTJS_REGISTER_GENERATE_USER_POPUP_CHOICE',
        payload: datapayloads,
      },
      response => {
        
      }
    );

    // Remove request register generate from RequestRegisterPendings
    RequestRegisterPendings = RequestRegisterPendings.filter(p => p.hostname != registerpending.hostname)

    // Send response for the last time to popup register
     sendResponse({status: "success"})
     // After All Finish, Remove popup tab
     setTimeout(()=>{
      chrome.tabs.remove( registerpending.popuptabid, ()=>{})
     }, 250)

  }
});


function generatePrivatePublicKey()
{
    let privatekeyBuffer = crypto.randomBytes(32);
    let privatekey = Secp256k1.uint256(privatekeyBuffer, 16)
    let publickey = Secp256k1.generatePublicKeyFromPrivateKeyData(privatekey);

    return {
      privatekey : privatekey.toString(16),
      publickey : publickey.x + publickey.y
    }
}