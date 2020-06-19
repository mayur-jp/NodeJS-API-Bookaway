const express = require('express');
require('dotenv').config();
const axios = require('axios');

const port=process.env.port || 3000;
const app = express();

const clientID=process.env.client_id;
const clientSecret= process.env.client_secret;
const requestToken=process.env.token_type+" "+process.env.access_token
const apiurl=process.env.apiUrl;

app.get('/authentication',async (req, res) => {
      axios.post('https://stage.bookaway.com/api/auth/v1/oauth/token', {
        client_id:clientID,
        client_secret: clientSecret,
        scope:'b2b',
        grant_type:'client_credentials'
      })
      .then(function (response) {
        // console.log(response);
        res.send(response.data.access_token);
      })
      .catch(function (error) {
        console.log(error);
      });
    
  })

app.get('/Hanoistation',(req,res)=>{
  var station =[]; 
  var city =[]; 
  var count=0;
    axios.get(apiurl+'/stations',{   
        headers: {
             accept: 'application/json',
             Authorization : requestToken
        }
      }).then((response) => {
      station = response.data;
      
      station.forEach(function(item) {
        city.push(item.city);
      });
      
      city.forEach(function(cityitem) {
       
        if(cityitem.city=='Hanoi')
        {
          console.log(cityitem.cityId);
            count=count+1; 
        }
      });
    
        console.log(' No of Hanoi station count  is :'+count);
        res.send(` No of Hanoi station count  is =${count}`);
     
      }).catch(function (error) {
        console.log(error);
  });
    
});
app.get('/SapaStation',(req,res)=>{
  var station =[];  
  var city =[];  
  var count=0;
    axios.get(apiurl+'/stations',{
        headers: {
             accept: 'application/json',
             Authorization : requestToken
        }
      }).then((response) => {
        station = response.data;
       
        station.forEach(function(item) {
          city.push(item.city);
        });
        
        city.forEach(function(cityitem) {
         
          if(cityitem.city=='Sapa')
          {            
            console.log(cityitem.cityId);
            count=count+1; 
          }
        });
        console.log('No of Sapa station count  is :'+count);
        res.send(`No of Sapa station count  is=${count}`);
      }).catch(function (error) {
        console.log(error);
  });
});

app.get('/trip',(req,res)=>{
  
  var departureStation= req.query.departurestation; 
  var arrivalStation= req.query.arrival;
  var departure= req.query.departure; 
  var passengers= req.query.passenger;  
  

    axios.get(apiurl+'/trips',{
      params: {
      departureStation:departureStation,
      arrivalStation:arrivalStation,
      departure:departure,
      passengers:passengers},

      headers: {
             accept: 'application/json',
             Authorization : requestToken
        }
      }).then((response) => {
        res.send(response.data);
      }).catch(function (error) {
        console.log(error);
    });
    
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
            res.send('Booking Reference is '+ response.data.reference);
          });
          }
    }
    })
  
});

app.get('/fechtbookings',(req,res)=>{
  
  var tripId=req.query.tripId
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
            if(response.data.status!='approve')
              {
                bookingPay(req.query.tripId);
                setTimeout(bookingApproved(),120000);
              }
          });
        }
  }
  })

});


app.get('/remainingCredit',(req,res)=>{
  accountcreadit(req,res);
});

function accountcreadit(req,res)
{
  axios.post(apiurl+'/credits',{
    headers: {
         accept: 'application/json',
         Authorization : requestToken
    }
  }).then((response) => {
    console.log('Dear Customer your account clear balance is '+response.data.balance);
    res.send('Dear Customer your account clear balance is '+response.data.balance);
  }).catch(function (error) {
    console.log(error);
  });
}

function bookingPay(tripId)
{
  axios({
    // make a POST request
    method: 'POST',
    url: 'https://virtserver.swaggerhub.com/Bookaway/B2B/1.0.0/bookings/'+tripId+'/pay',
    headers: {
        accept: 'application/json',
        Authorization : requestToken
    }
   
  }).then((bookingRes) => {
  console.log('Booking is '+bookingRes.data.status);
  
  });
}

function bookingApproved()
{
  axios({
    // make a POST request
    method: 'POST',
    url: 'https://virtserver.swaggerhub.com/Bookaway/B2B/1.0.0/approved',
    headers: {
        accept: 'application/json',
        Authorization : requestToken
    }
  }).then((bookingRes) => {
  console.log('Booking is '+bookingRes.data.status);
  res.send(bookingRes.data.status);
 
  });
}



app.listen(port, function() {
 console.log("Server is running at "+port+" port!");
});