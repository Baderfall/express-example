var User = require('models/user');

var user = User({
  username: 'Tester4',
  password: 'secret'
});

user.save(function(err, user, affected) {
  if (err) throw err;

  User.findOne({username: "Tester"}, function(err, tester) {
    console.log("tester", tester);
  })
})
