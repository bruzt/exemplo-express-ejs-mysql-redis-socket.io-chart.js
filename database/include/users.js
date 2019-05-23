const mysql = require('../mysql');

module.exports = {

    render(req, res, error){

        res.render('admin/login', {
            body: req.body,
            error
        });

    },

    login(email, password){

        return new Promise( (resolve, reject) => {

            mysql.query(`

                SELECT * FROM tb_users WHERE email=?
            
            `, [

                email

            ], (error, result) => {

                if(error){

                    reject(error);

                } else {
                    
                    if(/*Object.keys(result)*/ result.length == 0){
                        
                        reject('Usuário ou senha incorretos');

                    } else if(result[0].password !== password){

                        reject('Usuário ou senha incorretos');

                    } else {

                        resolve(result[0]);

                    }
                }
            });
        });
    },

    getUsers(){

        return new Promise( (resolve, reject) => {

            mysql.query(`

                SELECT * FROM tb_users;

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

            let query;

            let params = [
                fields.name,
                fields.email,
            ];
            
            if(parseInt(fields.id) > 0){
                
                params.push(fields.id);

                query = `
                    UPDATE tb_users SET
                        name = ?,
                        email = ?
                    WHERE id = ?
                `;

            } else {

                params.push(fields.password);

                query = `
                    INSERT INTO tb_users (name, email, password)
                    VALUES (?, ?, ?);
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

    changePassword(fields){

        return new Promise( (resolve, reject) => {

            if(! fields.password){

                reject({ message: 'Preencha a senha' });
                return;

            } else if(fields.password !== fields.passwordConfirm){

                reject({ message: 'As senhas estão diferentes' });
                return;

            } else {

                let query = `
                    UPDATE tb_users SET 
                        password = ?
                    WHERE id = ?
                `;

                let params = [
                    fields.password,
                    fields.id
                ];

                mysql.query(query, params, (error, result) => {

                    if(error){

                        reject(error);

                    } else {

                        resolve(result);

                    }
                });
            }
        });
    },

    delete(id){

        return new Promise( (resolve, reject) => {

            mysql.query(`

                DELETE FROM tb_users WHERE id = ?

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