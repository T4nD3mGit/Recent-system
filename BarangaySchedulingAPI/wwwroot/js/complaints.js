document
.getElementById("complaintForm")
.addEventListener("submit", async function(e){

    e.preventDefault();


    const complaintData = {

        fullName:
        document.getElementById("fullname").value,


        street:
        document.getElementById("street").value,


        contact:
        document.getElementById("contact").value,


        purpose:
        "Complaint: " +
        document.getElementById("complaint").value

    };


    try{


        const response = await fetch(
            "/api/Complaints",
            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:
                JSON.stringify(complaintData)

            }
        );



        if(response.ok){


            this.reset();


            document
            .getElementById("complaintForm")
            .style.display="none";


            document
            .getElementById("successMessage")
            .style.display="block";


        }

        else{


            alert(
            "Submission failed."
            );


        }


    }


    catch(error){


        console.error(error);


        alert(
        "Cannot connect to API server."
        );


    }


});
