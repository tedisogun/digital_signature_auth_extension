


// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     var tab = tabs[0];
//     var url = new URL(tab.url)
//     var domain = url.hostname
//     // `domain` now has a value like 'example.com'
//     document.getElementById('domain').innerHTML =domain

//     chrome.storage.sync.get([domain], function(result) {
        
//         if(result[domain] != undefined){

//             document.getElementById('status').classList.remove("bg-secondary")
//             document.getElementById('status').classList.remove("text-white")

//             document.getElementById('status').innerHTML = "secured"
//             document.getElementById('status').classList.add("bg-success")
//             document.getElementById('status').classList.add("text-light")
//         }else{

//             document.getElementById('status').classList.remove("bg-success")
//             document.getElementById('status').classList.remove("text-light")

//             document.getElementById('status').innerHTML = "non-secured"
//             document.getElementById('status').classList.add("bg-secondary")
//             document.getElementById('status').classList.add("text-white")
//         }
//       });

//       console.log(PrivateKey)
//       let sha = window.Sha256("Testetstssttststs")
//       document.getElementById('dumpit').innerHTML = sha



    
//   })


  