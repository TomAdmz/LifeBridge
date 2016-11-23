var key = "YnJhY2tldGNAb3JlZ29uc3RhdGUuZWR1";
document.addEventListener('DOMContentLoaded', getJobTitle);

function getJobTitle(){
  document.getElementById('profession1').addEventListener('keyup', function(event)
      {
        var titlesList = document.getElementById('titlesList');
        while (titlesList.firstChild) //clear suggestion list each time
        {
          titlesList.removeChild(titlesList.firstChild);
        }
        var jobTitle = document.getElementById('profession1').value;
        var req = new XMLHttpRequest();
        //THIS NEEDS TO BE UPDATED TO USE OUR OWN SERVER FOR CORS HEADERS
        req.open("GET", "https://cors-anywhere.herokuapp.com/https://www.synclist.com/user/getTitle?key=" + key + "&val=" + jobTitle, true);
        req.addEventListener('load',function(){
          if(req.status >= 200 && req.status < 400)
          {
            var response = JSON.parse(req.responseText.slice(1, -2)); //slice off some extra characters in the response from this API
            // Loop over the JSON array.
            var maxSuggestions = Math.min(10, response.length);
            for(i=0; i<maxSuggestions; i++)
            {
              // Create a new <option> element.
              var option = document.createElement('option');
              // Set the value using the item in the JSON array.
              option.value = response[i].Title;
              // Add the <option> element to the <datalist>.
              titlesList.appendChild(option);
            }
          }
          else
          {
            console.log("Network error during API request");
          }
      });
        req.send(null);
        event.preventDefault();
      });
    };
