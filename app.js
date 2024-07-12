const express = require('express') ;
const request = require('request') ;
const bodyParser = require('body-parser');
const path = require('path') ;
const { url } = require('inspector');

const app = express() ;
app.use(bodyParser.urlencoded({extended: true})) ;

// Static folder 
app.use(express.static(path.join(__dirname, 'public'))) ;

//Signup Route to direct into the signup page or index page 
app.post('/signup',(req, res) => {
    
    // here we have made all the constants and stored the input provided through the user 

    const{ firstName , lastName , email } = req.body ;

    // make sure each andd every details are filled by the user 

    if(!firstName || !lastName || !email )
    {
        res.redirect('/failPage.html');
        return ;
    }

    // Construct  req data 

    const data = {
        members: [
            {
                email_address: email ,
                status: 'subscribed' ,
                merge_fields: {
                    FNAME: firstName ,
                    LNAME: lastName ,
                    
                }
            }
        ]
    }


    const postData = JSON.stringify(data) ;

    
    // here we store our url for the mail chimp ... 
    // and using the post request ,.,., we redirect to different pages 
    //
    //we provided the API key for our email list or user list created on the mailChimp account ,... and we can directly access the user contacts through mailCHimp using the API keys 

    
    const options = {

        url:'https://us14.api.mailchimp.com/3.0/lists/6b6690cd9e' ,
        method: 'POST' ,
        headers: {
            Authorization: 'auth 5369b6d8e374130e182e7c32aea15be5-us14'
        }, body: postData
    }



    request(options, (err , response, body) => {

        // if any error occurs ... redirect the page to failpage.html 


        if(err){
            res.redirect('/failPage.html') ;
        }

        // if the page is successfully filled and all the details are checked and marked ... and there is no error .. 200 message sent and 
        // redirect the page to successfull.html 

        else{
            if(response.statusCode === 200)
            {
                res.redirect('/success_page.html') ;
            }
        }
    }) ;

});

const PORT = process.env.PORT || 5000 ;

app.listen(PORT , console.log(`Server started on ${PORT}`));
