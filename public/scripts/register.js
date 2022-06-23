// After registerjs has been created, send message to backgroundservice to retrive data
chrome.runtime.sendMessage(
    {
      type: 'POPUP_REGISTER_REQUEST_DATA_BACKGROUND',
      payload: { 
      },
    },
    response => {
      document.getElementById("login-hostname").innerHTML = response.hostname
    }
  );


// Get Button Generate & Abort. make listener
let popupGenerate = document.getElementById("POPUP_GENERATE");
let popupAbort = document.getElementById("POPUP_ABORT");


popupGenerate.addEventListener("click", () => {
    chrome.runtime.sendMessage(
      {
        type: 'POPUP_REGISTER_GENERATE_USER_CLICK_BUTTON_BACKGROUND',
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
        type: 'POPUP_REGISTER_GENERATE_USER_CLICK_BUTTON_BACKGROUND',
        payload: { 
          approve : false
        },
      },
      response => {
      
      }
    );
  
  })