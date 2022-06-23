'use strict';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// Log `title` of current active web page
// const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
// console.log(
//   'Page title is: '+ pageTitle+" - evaluated by Chrome extension's 'contentScript.js' file"
// );

// // Communicate with background file by sending a message
// chrome.runtime.sendMessage(
//   {
//     type: 'GREETINGS',
//     payload: {
//       message: 'Hello, my name is Con. I am from ContentScript.',
//     },
//   },
//   response => {
//     console.log(response.message);
//   }
// );




// Listen for message
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === 'LOGIN_APPROVE') {
//     console.log(`Current login is ${request.payload.status}`);
//   }

//   // Send an empty response
//   // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
//   sendResponse({});
//   return true;
// });





// Getting Data from Login Page
let DsaLoginButton = document.getElementById("DSA_LOGIN_BUTTON");
let DsaLoginRandom = document.getElementById("DSA_LOGIN_RANDOM").dataset.main;
let DsaLoginTimestamp = document.getElementById("DSA_LOGIN_TIMESTAMP").dataset.main;

if(DsaLoginButton && DsaLoginRandom && DsaLoginTimestamp)
{
    // Getting Hostname of active page that want to dsa login
    let DsaLoginHostname = window.location.hostname;

    // Create Listener for Login DSA Button Click
    DsaLoginButton.addEventListener("click", () => {

        // Communicate with backgroundservice by sending a message
        chrome.runtime.sendMessage(
          {
            type: 'DSA_LOGIN_BUTTON_CLICK',
            payload: {
              random: DsaLoginRandom,
              timestamp: DsaLoginTimestamp,
              hostname: DsaLoginHostname 
            },
          },
          response => {
            if(response.error){
              alert(response.error);
            }
          }
        );

    });
}




// Listen for User login popup choice. either clicking button login or abort
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {


  if (request.type === 'BACKGROUND_TO_CONTENTJS_LOGIN_USER_POPUP_CHOICE') {
      console.log("Message from background JS")
      if(request.payload.approve)
      {
        console.log(JSON.stringify(request.payload))
      }else{
        alert("login dibatalkan")
      }
      
  }


   sendResponse({});
   return true;

});