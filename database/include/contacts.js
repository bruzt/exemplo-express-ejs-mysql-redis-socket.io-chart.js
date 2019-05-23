const mysql = require('../mysql');


module.exports = {

    render(req, res, error, success){

        res.render('contacts', {
            title: 'Contato - Restaurante',
            background: 'images/img_bg_3.jpg',
            h1: 'Diga um oi!',
            body: req.body,
            error,
            success
      });
    },

    getContacts(){

        return new Promise( (resolve, reject) => {

            mysql.query(`

                SELECT * FROM tb_contacts;

            `, (error, result) => {

                if(error){

                    reject(error);

                } else {

                    resolve(result);

                }
            });
        });
    },

    save(fields){

        return new Promise( (resolve, reject) => {

            mysql.query(`
        
            INSERT INTO tb_contacts (name, email, message)
            VALUES (?, ?, ?);
        
            `, [
                fields.name,
                fields.email,
                fields.message

            ], (err, result) => {

                if(err){

                    reject(err);

                } else {

                    resolve(result);

                }
            });
        });
    },

    delete(id){

        return new Promise( (resolve, reject) => {

            mysql.query(`
            
                DELETE FROM tb_contacts WHERE id = ?;

            `, [id], (error, result) => {

                if(error){

                    reject(error);

                } else {

                    resolve(result);

                }
            });
        });
    }

}