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



