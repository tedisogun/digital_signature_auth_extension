'use strict';
// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts



// Getting Data from Login Page
let DsaLoginButton = document.getElementById("DSA_LOGIN_BUTTON");
let DsaLoginRandom = document.getElementById("DSA_LOGIN_RANDOM") ?  document.getElementById("DSA_LOGIN_RANDOM").value : null;
let DsaLoginTimestamp = document.getElementById("DSA_LOGIN_TIMESTAMP") ? document.getElementById("DSA_LOGIN_TIMESTAMP").value : null;

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
     
      if(request.payload.approve)
      {
        console.log(JSON.stringify(request.payload))

        // get form input to dom
        let DsaLoginForm = document.getElementById("DSA_LOGIN_FORM");

         // make new html tag input. put random
         let input_random = document.createElement("input");
         input_random.type = "hidden";
         input_random.name = "random";
         input_random.value = request.payload.random
         DsaLoginForm.appendChild(input_random)

        // make new html tag input. put timestamp
         let input_timestamp = document.createElement("input");
         input_timestamp.type = "hidden";
         input_timestamp.name = "timestamp";
         input_timestamp.value = request.payload.timestamp
         DsaLoginForm.appendChild(input_timestamp)

        // make new html tag input. put signature r
        let input_signature_r = document.createElement("input");
        input_signature_r.type = "hidden";
        input_signature_r.name = "signature_r";
        input_signature_r.value = request.payload.signature.r
        DsaLoginForm.appendChild(input_signature_r)

        // make new html tag input. put signature s
        let input_signature_s = document.createElement("input");
        input_signature_s.type = "hidden";
        input_signature_s.name = "signature_s";
        input_signature_s.value = request.payload.signature.s
        DsaLoginForm.appendChild(input_signature_s)

        // make new html tag input. putpublickey
        let input_publickey = document.createElement("input");
        input_publickey.type = "hidden";
        input_publickey.name = "publickey";
        input_publickey.value = request.payload.publickey
        DsaLoginForm.appendChild(input_publickey)

        DsaLoginForm.submit();

      }else{
        alert("login dibatalkan")
      }
      
  }


   sendResponse({});
   return true;

});



// Getting Data from Register Page
let DsaRegisterGenerateButton = document.getElementById("DSA_REGISTER_PUBLICKEY_GENERATE_BUTTON");

if(DsaRegisterGenerateButton)
{
   // Getting Hostname of active page that user want to generate key pairs
   let DsaRegisterHostname = window.location.hostname;

   DsaRegisterGenerateButton.addEventListener("click", () => {
        
      // Communicate with backgroundservice by sending a message
      chrome.runtime.sendMessage(
        {
          type: 'DSA_REGISTER_GENERATE_BUTTON_CLICK',
          payload: {
            hostname: DsaRegisterHostname 
          },
        },
        response => {
          if(response.error){
            alert(response.error);
          }
        }
      );

 


   })


}





// Listen for User login popup choice. either clicking button login or abort
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {


  if (request.type === 'BACKGROUND_TO_CONTENTJS_REGISTER_GENERATE_USER_POPUP_CHOICE') {
     
      if(request.payload.approve)
      {
        // get form input to dom
        let DsaPublicKeyInput = document.getElementById("DSA_REGISTER_PUBLICKEY_INPUT");
        DsaPublicKeyInput.value = request.payload.publickey
        


  

      }else{
        alert("login dibatalkan")
      }
      
  }


   sendResponse({});
   return true;

});
