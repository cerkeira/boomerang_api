const db= require('../db/index')


const user = {

    find(nameSearch){
        const {
            searchString
          } = nameSearch


          const query = `SELECT id_users, username, name, email, gender, bio, images_id_images FROM users WHERE name LIKE ? LIMIT 20`;

          const searchStringFinal = `%${searchString}%`;

        const values = [
            searchStringFinal
          ];

          return db.query(query, values);

    }

}




module.exports = user;