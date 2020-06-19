# NodeJS-API-Bookaway
------------------------------------------------------------
## **About Application**
------------------------------------------------------------
### 1.Install npm 
---------------------------------
#### Using npm install

### 2.Change your creadential in .env file
### 3.run the application using the node app.js commad

### 4.check the result in browser or postman for calling API
------------------------------------------------------------
## **About Project API and their result**
--------------------------------------------------------------
### 1.Get authenticated with Bookaway
#### =>calling http://localhost:3000/authentication print the token.

### 2.Get All the stations from “Hanoi”
#### =>calling the http://localhost:3000/Hanoistation print the No of count of Hanoi station

### 3.Get all the stations from “Sapa”
#### =>calling the http://localhost:3000/station print the No of count of Sapa station

### 4.Search trips from Hanoi to Sapa on a day of your choice for 2 passengers.
#### =>calling the  http://localhost:3000/trip and added the body json parameter(tripId,firstname,lastName,passengers,contact) print the trip details

### 5.Print the remaining credits for your account.
#### =>calling the http://localhost:3000/account-credit and print  renaming credits

### 6.Book the cheapest trip that is available and has instant confirmation - print the booking reference.
#### =>calling the http://localhost:3000/booking and print the booking reference.here calling the booking approved api and print the remaining credits of your account after you booked the trip.
