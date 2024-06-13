const db = require("../config/db");

const getArtWorks = (id, callback) => {    
    const query = `SELECT * FROM artworks WHERE user_id = ?`    
    db.query(query, [id], (err, results) => {
        if (err) {
            return callback(err, null);
        }        
        if (results.length === 0) {       
            return callback(null, null);
        }    
        return callback(null, results);
    });
}

const getArtworkByTitleAndId = (title, id, callback) => {
  const query = `
    SELECT 
      a.artwork_id, a.user_id, a.title, a.description, a.date_created, a.image_url,
      u.first_name, u.last_name
    FROM 
      artworks a
    JOIN 
      user_information u ON a.user_id = u.user_information_id
    WHERE 
      a.title = ? AND a.artwork_id = ?
  `;
  db.query(query, [title, id], (error, results) => {
      if (error) {
          return callback(error);
      }
      if (results.length === 0) {
          return callback(null, null);
      }
      callback(null, results[0]);
  });
};



module.exports = {
    getArtWorks,
    getArtworkByTitleAndId
};