const fb_constant = require('../../utils/firebase_constants');
const firebaseInit = require('../../firebase/firebase');

const sha256 = require('sha256');

module.exports = {
  activate_system: (system_hash, user_id, callback) => {

    var options = {
      path: FIREBASE_SYSTEMS_TABLE,
      id: null,
      raw_data: true,
      get_all_children: true,
      callback: (result) => {
        if (result.success) {

          var response = find_system(system_hash, user_id, result.data, (data) => {
            return callback({
              success: data.success,
              message: data.message
            });
          });

        } else {
          return callback({
            success: false,
            message: 'Failed to get list of systems'
          });
        }
      }
    }

    FIREBASE_ADMIN.get(options);
  }
};

function find_system(hash, user, data, callback) {
  var found = false;

  data.forEach(function(childSnapshot) {
    var system_key = childSnapshot.key;
    var temp_hash = sha256(system_key);

    if (hash == temp_hash) {
      found = true;
      var details = childSnapshot.val();

      if (!details.active) {
        var valid = false;
        var db = FIREBASE_ADMIN.getDatabaseReference();
        db.child(FIREBASE_SYSTEMS_TABLE).child(system_key).child('active').set(true);

        db.child(FIREBASE_USERS_TABLE).child(user).child('systems').once("value", function(data) {

          if (data.val() == null) {
            var systems = [];
            systems.push(system_key);
            db.child(FIREBASE_USERS_TABLE).child(user).child('systems').set(systems);
            valid = true;
          } else {
            var systems = data.val();
            var contains = systems.indexOf(system_key);

            if(contains < 0){
              systems.push(system_key);
              db.child(FIREBASE_USERS_TABLE).child(user).child('systems').set(systems);
              db.child(FIREBASE_SYSTEMS_TABLE).child(system_key).child('user_id').set(user);
              valid = true;
            }
            else{
              valid = false;
            }
          }

          if(valid){
            return callback({
              success: true,
              message: 'System has been activated'
            });
          }
          else{
            return callback({
              success: false,
              message: 'System already belongs to user'
            });
          }

        });


      } else {
        return callback({
          success: false,
          message: 'System is already activated'
        });
      }
    }

  });

  if (!found) {
    return callback({
      success: false,
      message: 'System does not exist'
    });
  }

}
