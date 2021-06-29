function postData() {
    fetch(window.location.origin + "/auth", {     // Send request to '/auth'
        method: 'POST',                         // Using HTTP POST
        headers: {
          'Content-Type': 'application/json',   // JSON body
        },
        body: JSON.stringify({pin: document.getElementById("pinNo").value}),    // Send user input
    }).then(raw => raw.json())                                      // Convert the server reply from JSON
      .then(data => window.location.assign(window.location.origin + `/next?id=${data.id}`)) // Redirect to '/next' using url parameters
      .catch(e => {});                                              // Ignore any errors
}