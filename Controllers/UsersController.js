const Repository = require('../Repositories/UsersRepository');

const mongo = require('mongodb');

let UsersCollection = {};
const database = require('../Db').then(function(db) {
	UsersCollection = db.collection('Users');
});

exports.Index = function(req, res){
    Repository.getUsers({}, function(err, result){
        if (err) throw err;
        const users = [];
        result.forEach((user, key)=>{
            users.push({
                id: user._id,
                displayName: user.firstName + user.lastName,
                username: user.username,
                avatar: user.avatar
                
            })
        })
        res.send(users);
    
    })
}

exports.Show = function (request, response) {
	Repository.getUsers(
		{'_id': new mongo.ObjectID(request.params.id)},
		function(err, results) {
			if (err) throw err;
			response.send(results);
		}
	);
}

exports.Insert = function (request, response) {

	let newUser = {
		firstName: request.body.firstName,
		lastName: request.body.lastName,
		username: request.body.username,
		password: request.body.password,
		group: request.body.group
	};

	if (!newUser.username || !newUser.username.length) {
		response.status(400).send({
			'status': 400,
			'message': 'You need to enter a username'
		});
		return;
	}

	if (!newUser.password || !newUser.password.length) {
		response.status(400).send({
			'status': 400,
			'message': 'You need to enter a password'
		});
		return;
	}

	Repository.insertUser(newUser, function(err, results) {

		Repository.getUser(
			{'username': newUser.username},
			function(err, results) {
				response.send(results);
			});
	});
}

exports.Delete = function (request, response) {
	Repository.deleteUser(
		{'_id': new mongo.ObjectID(request.params.id)},
		function(err, results) {
		if (err) throw err;
		response.send(results);
	});
}

exports.Update = function (request, response) {
    let userUpdates = {
        $set: {
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                username: request.body.username,
                password: request.body.password,
                avatar: request.body.avatar,
                group : request.body.group,
                subscriptions: request.body.subscriptions
        }
    }
	Repository.updateUser(
        {'_id': new mongo.ObjectID(request.params.id)},
        userUpdates,
		function(err, results) {
		if (err) throw err;
		response.send(results);
	});
}