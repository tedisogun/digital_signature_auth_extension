// 'use strict';


// After loginjs has been created, send message to backgroundservice to retrive data
chrome.runtime.sendMessage(
  {
    type: 'POPUP_LOGIN_REQUEST_DATA_BACKGROUND',
    payload: { 
    },
  },
  response => {
    document.getElementById("login-hostname").innerHTML = response.hostname
  }
);



// Get Button Login & Abort. make listener
let popupLogin = document.getElementById("POPUP_LOGIN");
let popupAbort = document.getElementById("POPUP_ABORT");

popupLogin.addEventListener("click", () => {
  chrome.runtime.sendMessage(
    {
      type: 'POPUP_LOGIN_USER_CLICK_BUTTON_BACKGROUND',
      payload: { 
        approve : true
      },
    },
    response => {
    
    }
  );


})

popupAbort.addEventListener("click", () => {

  chrome.runtime.sendMessage(
    {
      type: 'POPUP_LOGIN_USER_CLICK_BUTTON_BACKGROUND',
      payload: { 
        approve : false
      },
    },
    response => {
    
    }
  );

})


// console.log('loginjs')
// console.log(new Date)
// chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
//   console.log("sssss")
//     if(request.type === "DSA_LOGIN_BACKGROUND_TO_POPUP_DATA"){


//       document.getElementById("login-hostname").innerHTML = request.payload.hostname

//     }
// })



// let dsabuttonclick = document.getElementById("login_page_title").innerHTML = "Login dari sini?";

// chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//   const tab = tabs[0];

