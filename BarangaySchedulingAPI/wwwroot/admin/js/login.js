async function login()
{
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;


    let response = await fetch("/api/Login",
    {
        method: "POST",

        headers:
        {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(
        {
            username: username,
            password: password
        })
    });


    let result = await response.json();


    if(response.ok)
    {
        alert("Login successful!");

        window.location.href = "dashboard.html";
    }
    else
    {
        alert(result.message);
    }
}

