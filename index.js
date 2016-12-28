var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
//Need to enter username and password for your database
var connString = "postgres://postgres:test123@localhost/assessbox";



var app = express();

app.use(bodyParser.json());
app.use(cors());


//The test doesn't like the Sync version of connecting,
//  Here is a skeleton of the Async, in the callback is also
//  a good place to call your database seeds.
var db = massive.connect({connectionString: connString},
	function (err, localdb) {
		db = localdb;
		app.set('db', db);
		
		db.user_create_seed(function (err, res) {
			if (err) console.log(err);
			console.log("User Table Init");
		});
		db.vehicle_create_seed(function (err, res) {
			if (err) console.log(err);
			console.log("Vehicle Table Init")
		});
	});


app.get('/api/users', (req, res, next) => {
	//query the database and get all users.
	db.read.users([], function (err, users) {
		if (err) console.log(err);
		res.json(users);
	})
});
app.get('/api/vehicles', (req, res, next) => {
	// query the database and get all vehicles.
	db.read.vehicles([], function (err, users) {
		if (err) console.log(err);
		res.json(users);
	})
	
});
app.get('/api/user/:userId/vehiclecount', (req, res, next) => {
	// return a count of how many vehicles belong to the given user
	// Response should be an object with a count property ie: {count:1}
	let user = req.params.userId;
	db.read.userVehicleCount([user], (err, vehicles) => {
		if(err) console.log(err);
		res.json(vehicles);
	});
});
app.get('/api/user/:userId/vehicle', (req, res, next) => {
	//find all vehicles that belong to the user with the provided users id
	let user = req.params.userId;
	db.read.userVehicles([user], (err, vehicles) => {
		if (err) console.log(err);
		res.json(vehicles);
	})
});
app.get('/api/vehicle', (req, res, next) => {
	//with query ?userFistStart & ?email
	if (req.query.UserEmail) {
		let email = req.query.UserEmail;
		db.read.vehicleByEmail([email],(err, vehicles) =>{
			if (err) console.log(err);
			res.json(vehicles);
		})
	} else if (req.query.userFirstStart) {
		let search = req.query.userFirstStart;
		db.read.vehiclesByUserSearch([search+'%'], (err, vehicles) => {
			if (err) console.log(err);
			res.json(vehicles)
		})
	}
	
});
app.get('/api/newervehiclesbyyear', (req, res, next) => {
	// get all vehicles >= 2000 by year
	db.read.newVehiclesByYear([], (err, newVehicles) => {
		if (err) console.log(err);
		else res.json(newVehicles);
		
	})
	
});


app.post('/api/users', (req, res, next) => {
	// will take a user from the body and add them to the database
	let user = req.body;
	db.create.user([user.firstname, user.lastname, user.email], (err, dbRes) =>{
		if (err) console.log(err);
		else {
			res.sendStatus(200);
		}
	})
	
});
app.post('/api/vehicles', (req, res, next) => {
	// will take a vehicle from the body and add it to the database
	let vehicle = req.body;
	db.create.vehicle([vehicle.make, vehicle.model, vehicle.year, vehicle.ownerId], (err, dbRes) => {
		if (err) console.log(err);
		else res.sendStatus(200);
	})
});


app.put('/api/vehicle/:vehicleId/user/:userId', (req, res, next) => {
	// changes the ownership of the provided vehicle to be the new user.
	let user = req.params.userId;
	let vehicle = req.params.vehicleId
	db.update.vehicleOwner([user, vehicle], (err, dbRes) => {
		if (err) console.log(err);
		else res.sendStatus(200);
	})
	
});


app.delete('/api/user/:userId/vehicle/:vehicleId', (req, res, next)=>{
	//removes ownership of that vehicle from the provided user, but does not delete the vehicle
	db.delete.vehicleOwner([req.params.vehicleId], (err) => {
		if (err) console.log(err);
		else res.sendStatus(200);
	})
});
app.delete('/api/vehicle/:vehicleId', (req, res, next)=>{
	// deletes the specified vehicle
	db.delete.vehicle([req.params.vehicleId], (err) => {
		if (err) console.log(err);
		else res.sendStatus(200);
	})
});


app.listen('3000', function () {
	console.log("Successfully listening on : 3000")
});

module.exports = app;
