const mysql = require('../mysql');
const path = require('path');

module.exports = {

    getMenus(){

        return new Promise( (resolve, reject) => {
    
            mysql.query(`
    
            SELECT * FROM tb_menus ORDER BY id;
    
            `, (err, results) => {
    
                if(err){
    
                    reject(err);
    
                } else {
    
                    resolve(results);
    
                }
            });
        });
    },

    save(fields, files){

        return new Promise( (resolve, reject) => {

            fields.photo = `images/${path.parse(files.photo.path).base}`;

            let query, queryPhoto = '';

            let params = [
                fields.title,
                fields.description,
                fields.price
            ];

            if(files.photo.name) {

                queryPhoto = ', photo = ?';

                params.push(fields.photo);

            }

            if(parseInt(fields.id) > 0){

                params.push(fields.id);

                query = `
                    UPDATE tb_menus SET
                        title = ?,
                        description = ?,
                        price = ?
                        ${queryPhoto}
                    WHERE id = ?
                `;

            } else {

                if(! files.photo.name){
                    reject('Envie a foto do prato');
                }

                query = `
                    INSERT INTO tb_menus (title, description, price, photo)
                    VALUES (?, ?, ?, ?);
                `;
            }

            mysql.query(query, params, (error, result) => {

                if(error){

                    reject(error);

                } else {

                    resolve(result);

                }
            });
        });
    },

    delete(id){

        return new Promise( (resolve, reject) => {

            mysql.query(`

                DELETE FROM tb_menus WHERE id = ?

            `, [

                id

            ], (error, result) => {

                if(error){

                    reject(error);

                } else {

                    resolve(result);

                }
            });
        });
    }
}

