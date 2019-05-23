const mysql = require('../mysql');

module.exports = {

    render(req, res, error, success){

        res.render('index', {
            body: req.body,
            error,
            success
        });
    },

    getSubscribes(){

        return new Promise( (resolve, reject) => {

            mysql.query(`
            
                SELECT * FROM tb_emails;
            
            `, (error, result) => {

                if(error){

                    reject(error);

                } else {

                    resolve(result);

                }
            });
        });
    },

    save(field){

        return new Promise( (resolve, reject) => {

            if(! field.email){
                reject({ message: 'Preencha o e-mail' });
                return;
            }

            mysql.query(`

                INSERT INTO tb_emails (email) VALUES (?);
            
            `, [field.email], (error, result) => {

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
            
                DELETE FROM tb_emails WHERE id = ?;
            
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