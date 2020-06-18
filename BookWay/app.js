const express = require('express');
require('dotenv').config();
const axios = require('axios');

const port=process.env.port || 3000;
const app = express();

const clientID=process.env.client_id;
const clientSecret= process.env.client_secret;
const requestToken=process.env.token_type+" "+process.env.access_token
const apiurl=process.env.apiUrl;

const authentication=new Promise(function() {
  axios({
    // make a POST request
    method: 'post',
    // to the bookway authentication API, with the client ID, client secret
    url: 'https://stage.bookaway.com/api/auth/v1/oauth/token?client_id=${'+clientID+'}&client_secret=${'+clientSecret+'}&scope=b2b&grant_type=client_credentials',
    // Set the content type header, so that we get the response in JSOn
    headers: {
         accept: 'application/json'
    }
  }).then((response) => {
    const accessToken = response.data.access_token
   
    res.send(`access_token=${accessToken}`)
  }).catch(() => {});
});

app.get('/authentication',async (req, res) => {
   await authentication(clientID,clientSecret);
  })

app.get('/Hanoistation',(req,res)=>{
    var station = [];
    var count=0;
    axios({
        // make a GET request
        method: 'GET',
        url: apiurl+'/stations',
        headers: {
             accept: 'application/json',
             Authorization : requestToken
        }
      }).then((response) => {
      station = response.data;
      
      station.forEach(function(item) {
        if(item.name=='Hanoi')
        {
            count=count+1; 
        }
        });
        console.log('Hanoi station of count :'+count);
        res.send(`Hanoi station of count=${count}`);

      })
    
});
app.get('/station',(req,res)=>{
    var station = [];
    var count=0;
    axios({
        method: 'GET',
        url: apiurl+'/stations',
        headers: {
             accept: 'application/json',
             Authorization : requestToken
        }
      }).then((response) => {
      station = response.data;
      
      station.forEach(function(item) {
        if(item.name=='Sapa')
        {
            count=count+1;
        }
        
        });
        console.log('Sapa station of count :'+count);
       res.send(`Sapa station of count=${count}`);
      })
    
});

app.get('/trip',(req,res)=>{
  
  var departureStation= req.query.departures; 
  var arrivalStation= req.query.arrival;
  var departure= req.query.departure; 
  var passengers= req.query.passenger;  
  console.log(req.query.departureStation);
  axios({
        // make a GET request
        method: 'GET',
        
        url: apiurl+'/trips?departureStation=${'+departureStation+'}&arrivalStation=${'+arrivalStation+'}&departure=${'+departure+'}&passengers=${'+passengers+'}',
      
        headers: {
             accept: 'application/json',
             Authorization : requestToken
        }
      }).then((response) => {
      res.send(response.data);
      })
    
});

app.get('/account-credit',(req,res)=>{
  accountcreadit();
})


app.get('/bookings',(req,res)=>{
  
    var tripId=req.query.tripId
    var trip=[];
    var firstname=req.query.firstname;
    var lastName=req.query.lastName;
    var passengers=req.query.passengers;
    var contact=req.query.contactNo;
   
    axios({
       method:'GET',
       url:apiurl+'/trips/${'+tripId+'}',
       headers: {
        accept: 'application/json',
        Authorization : requestToken
      }
   }).then((resp) => {
    if(resp.data.length!=0)
    {
          if(resp.data.isAvailable== true && resp.data.isInstantConfirmation==true)
          {
            axios({
              // make a POST request
              method: 'POST',
              url: apiurl+'/bookings?passengers=${'+passengers+'}&firstName=${'+firstname+'}&lastName=${'+lastName+'}&contact={$'+contact+'}',
      
              headers: {
                  accept: 'application/json',
                  Authorization : requestToken
              }
             
            }).then((response) => {
            console.log('Booking Reference is '+response.data.reference);
            res.send(response.data.reference);
            
            if(response.data.status!='approve')
            {

              bookingPay(req.query.tripId);
              bookingApproved()
              
              trip = accountcreadit();
              console.log(trip);
            }
          });
          }
    }
    })
  
});
function bookingPay(tripid)
{
  axios({
    // make a POST request
    method: 'POST',
    url: apiurl+'/bookings/'+req.query.tripId+'/pay',
    headers: {
        accept: 'application/json',
        Authorization : requestToken
    }
   
  }).then((bookingRes) => {
  console.log('Booking is '+bookingRes.data.status);
  console.log(bookingRes.data);
  });
}

function bookingApproved()
{
  axios({
    // make a POST request
    method: 'POST',
    url: apiurl+'/approved',
    headers: {
        accept: 'application/json',
        Authorization : requestToken
    }
  }).then((bookingRes) => {
  console.log('Booking is '+bookingRes.data.status);
  res.send(bookingRes.data.status);
  console.log(bookingRes.data);
  });
}

function accountcreadit(req,res)
{
  return axios({
    // make a POST request
    method: 'POST',
    // to the bookway authentication API, with the client ID, client secret
     url: apiurl+'/credits',
    // Set the content type header, so that we get the response in JSOn
    headers: {
         accept: 'application/json'
    }
  }).then((response) => {
  console.log('Dear Customer your account clear balance is '+response.data.balance);
 res.send('Dear Customer your account clear balance is '+response.data.balance);
  });
}

app.listen(port, function() {
 console.log("Server is running at "+port+" port!");
});