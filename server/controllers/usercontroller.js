const mysql = require('mysql');
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

// Connection Pool
let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// View Users
exports.view = (req, res) => {
  // User the connection
  connection.query('SELECT * FROM user WHERE status = "active"', (err, rows) => {
    // When done with the connection, release it
    if (!err) {
      let removedUser = req.query.removed;
      try{res.render('home', { rows, removedUser });}
      catch (e){
        Sentry.captureException(e);
      }
    } else {
      console.log(err);
      Sentry.captureException(err);
      Sentry.captureMessage("View error", "fatal");
    }
    console.log('The data from user table: \n', rows);
  });
}

// Find User by Search
exports.find = (req, res) => {
  let searchTerm = req.body.search;
  // User the connection
  connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
    if (!err) {
      try{
        res.render('home', { rows });
      }
      catch (e){
        Sentry.captureException(e);
      }
    } else {
      console.log(err);
      Sentry.captureException(err);
      // Sentry.captureMessage("Find error", "fatal");
    }
    console.log('The data from user table: \n', rows);
  });
}

exports.form = (req, res) => {
  res.render('add-user');
}

// Add new user
exports.create = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  let searchTerm = req.body.search;

  // User the connection
  connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', [first_name, last_name, email, phone, comments], (err, rows) => {
    if (!err) {
      res.render('add-user', { alert: 'User added successfully.' });
      
    } else {
      console.log(err);
      Sentry.captureException(err);
      Sentry.captureMessage("Insert error", "fatal");
    }
    console.log('The data from user table: \n', rows);
  });
}


// Edit user
exports.edit = (req, res) => {
  // User the connection
  connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      try{res.render('edit-user', { rows });}
      catch (e){
        Sentry.captureException(e);
      }
    } else {
      console.log(err);
      Sentry.captureException(err);
      // Sentry.captureMessage("Edit user error", "fatal");
    }
    console.log('The data from user table: \n', rows);
  });
}


// Update User
exports.update = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  // User the connection
  connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, req.params.id], (err, rows) => {

    if (!err) {
      // User the connection
      connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
        // When done with the connection, release it
        
        if (!err) {
          try{res.render('edit-user', { rows, alert: `${first_name} has been updated.` });}
          catch (e){
            Sentry.captureException(e);
          }
        } else {
          console.log(err);
          Sentry.captureException(err);
        }
        console.log('The data from user table: \n', rows);
      });
    } else {
      console.log(err);
      Sentry.captureException(err);
      // Sentry.captureMessage("Update user error", "fatal");
    }
    console.log('The data from user table: \n', rows);
  });
}

// Delete User
// exports.delete = (req, res) => {

//   // Delete a record

//   // User the connection
//   // connection.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows) => {

//   //   if(!err) {
//   //     res.redirect('/');
//   //   } else {
//   //     console.log(err);
//   //   }
//   //   console.log('The data from user table: \n', rows);

//   // });

//   // Hide a record
//   connection.query('UPDATE user SET status = "removed" WHERE id = ?', [req.params.id], (err, rows) => {
//     if (!err) {
//       let removedUser = encodeURIComponent('User successeflly removed.');
//       res.redirect('/?removed=' + removedUser);
//       // catch (e){
//         // Sentry.captureException(e);
//       // }
//     } else {
//       console.log(err);
//       Sentry.captureException(err);
//     }
//     console.log('The data from user table are: \n', rows);
//   });

// }

// View Users
exports.viewall = (req, res) => {

  // User the connection
  connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      try{res.render('view-user', { rows });}
      catch (e){
        Sentry.captureException(e);
      }
    } else {
      console.log(err);
      Sentry.captureException(err);
    }
    console.log('The data from user table: \n', rows);
  });

}