const mysql = require('../mysql');
const Pagination = require('./Pagination');
const moment = require('moment');

module.exports = {

    render(req, res, error, success){

        res.render('reservations', {
            title: 'Reserva - Restaurante',
            background: 'images/img_bg_2.jpg',
            h1: 'Reserve uma Mesa!',
            body: req.body,
            error,
            success
        });
    },

    getReservations(req){

        return new Promise( async (resolve, reject) => {

            let page = (req.query.page) ? req.query.page : 1;
            let dateStart = (req.query.start) ? req.query.start : moment().format('YYYY-MM-DD');
            let dateEnd = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');

            let params = [];

            if(dateStart && dateEnd) params.push(dateStart, dateEnd);

            let pagination = new Pagination(`

                SELECT SQL_CALC_FOUND_ROWS * FROM 
                tb_reservations 
                ${(dateStart && dateEnd) ? 'WHERE date BETWEEN ? AND ?' : ''}
                ORDER BY date, time 
                DESC LIMIT ?, ?

            `, params);

            try {

                let data = await pagination.getPage(page);

                resolve({
                    data,
                    links: pagination.getNavigation(req.query)
                });
                
            } catch (error) {
                reject(error)
            }
        });
    },

    save(fields){

        return new Promise( (resolve, reject) => {

            if(fields.date.indexOf('/') > -1){

                let date = fields.date.split('/'); // fileds.date chega no formato dia-mês-ano
                fields.date = `${date[2]}-${date[1]}-${date[0]}`; // muda ela para o formato ano-mês-dia, para ser inserida no banco de dados

            }

            let query;
            let params =  [

                fields.name,
                fields.email,
                fields.people,
                fields.date,
                fields.time

            ];

            if(parseInt(fields.id) > 0){

                query = `
                    UPDATE tb_reservations SET
                        name = ?,
                        email = ?,
                        people = ?,
                        date = ?,
                        time = ?
                    WHERE id = ?;
                `;

                params.push(fields.id);

            } else {

                query = `
                    INSERT INTO tb_reservations (name, email, people, date, time)
                    VALUES (?, ?, ?, ?, ?);
                `;

            }

            mysql.query(query, params, (err, result) => {

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

                DELETE FROM tb_reservations WHERE id = ?

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
    },

    chart(req){

        return new Promise( (resolve, reject) => {

            mysql.query(`

                SELECT
                    CONCAT(YEAR(date), '-', MONTH(date)) AS date,
                    COUNT(*) AS total,
                    SUM(people) / COUNT(*) AS avg_people
                FROM tb_reservations
                WHERE
	                date BETWEEN ? AND ?
                GROUP BY YEAR(date) DESC, MONTH(date) DESC
                ORDER BY YEAR(date) DESC, MONTH(date) DESC;
            
            `, [req.query.start, req.query.end], (error, result) => {

                if(error){

                    reject(error);

                } else {

                    let months = [];
                    let values = [];

                    result.forEach( (row) => {
                        
                        months.push(moment(row.date).format('MMM YYYY'));
                        values.push(row.total);

                    });

                    resolve({
                        months,
                        values
                    });
                }
            });
        });
    },

    dashboard(){

        return new Promise( (resolve, reject) => {

            mysql.query(`
	
                SELECT
                    (SELECT COUNT(*) FROM tb_contacts) AS nrcontacts,
                    (SELECT COUNT(*) FROM tb_menus) AS nrmenus,
                    (SELECT COUNT(*) FROM tb_reservations) AS nrreservations,
                    (SELECT COUNT(*) FROM tb_users) AS nrusers;
	
                `, (error, result) => {

                    if(error){

                        reject(error);
                        
                    } else {

                        resolve(result[0]);

                    }
	        });
        });
    }
}