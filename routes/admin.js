var express = require('express');
var router = express.Router();

const moment = require('moment');
moment.locale('pt-BR');

const admin = require('../database/include/admin');
const loginSession = require('../midwares/loginSession');
const sidebarMenu = require('../midwares/sidebarMenu');
const users = require('../database/include/users');
const menus = require('../database/include/menus');
const contacts = require('../database/include/contacts');
const reservations = require('../database/include/reservations');
const subscribe = require('../database/include/subscribe');

router.use(loginSession);
router.use(sidebarMenu);

////////////////////////////////

module.exports = function (io){

	router.get('/', async (req, res, next) => {

		try {
	
			let data = await admin.dashboard();
	
			res.render('admin/index', admin.getParams(req, { data })); 
			
		} catch (error) {
			console.error(error);
		}
	});
	
	router.get('/dashboard', async (req, res, next) => {
	
		try {
	
			let data = await reservations.dashboard();
	
			res.send(data);
			
		} catch (error) {
			res.status(500).send(error);
		}
	});
	
	router.get('/login', (req, res, next) => {
	
		users.render(req, res, null); 
			
	});
	
	router.post('/login', async (req, res, next) => {
	
		if(! req.body.email){
	
			users.render(req, res, 'Preencha o campo e-mail');
	
		} else if(! req.body.password){
	
			users.render(req, res, 'Preencha o campo senha');
	
		} else {
	
			try {
	
				let user = await users.login(req.body.email, req.body.password);
	
				req.session.user = user;
	
				res.redirect('/admin');
				
			} catch (error) {
				users.render(req, res, error.message || error);
			}
		}
	});
	
	router.get('/logout', (req, res, next) => {
	
		delete req.session.user;
		
		res.redirect('/admin/login');
			
	});
	
	router.get('/contacts', async (req, res, next) => {
	
		try {
	
			let data = await contacts.getContacts();
	
			res.render('admin/contacts', admin.getParams(req, {
				data
			})); 
			
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
		}
	});
	
	router.delete('/contacts/:id', async (req, res, next) => {
	
		try {
	
			let data = await contacts.delete(req.params.id);
	
			res.json(data);

			io.emit('dashboard update');
			
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
		}
	});
	
	router.get('/emails', async (req, res, next) => {
	
		try {
	
			let data = await subscribe.getSubscribes();
	
			res.render('admin/emails', admin.getParams(req, {
				data
			})); 
			
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
		}
	});
	
	router.delete('/emails/:id', async (req, res, next) => {
	
		try {
	
			let result = await subscribe.delete(req.params.id);
	
			res.json(result);

			io.emit('dashboard update');
			
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
		}
	});
	
	
	router.get('/menus', async (req, res, next) => {
	
		try {
	
			let data = await menus.getMenus();
	
			res.render('admin/menus', admin.getParams(req, { data })); 
			
		} catch (error) {
			console.error(error);
		}
	});
	
	router.post('/menus', async (req, res, next) => {
	
		try {
	
			let result = await menus.save(req.fields, req.files);
	
			res.json(result);

			io.emit('dashboard update');
			
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
		}
	});
	
	router.delete('/menus/:id', async (req, res, next) => {
	
		try {
	
			let result = await menus.delete(req.params.id);
	
			res.json(result);

			io.emit('dashboard update');
			
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
		}
	});
	
	router.get('/reservations', async (req, res, next) => {
	
		try {
	
			let start = (req.query.start) ? req.query.start : moment()/*.subtract(1, 'day')*/.format('YYYY-MM-DD');
			let end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');
	
			let pagination = await reservations.getReservations(req);
	
			res.render('admin/reservations', admin.getParams(req, { 
				date: {
					start,
					end
				},
				data: pagination.data,
				moment,
				links: pagination.links
			}));
			
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
		}
	});
	
	router.get('/reservations/chart', async (req, res, next) => {
	
		req.query.start = (req.query.start) ? req.query.start : moment()/*.subtract(1, 'day')*/.format('YYYY-MM-DD');
		req.query.end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');
	
		try {
	
			let chartData = await reservations.chart(req);
	
			res.send(chartData);
			
		} catch (error) {
			res.status(500).send(error);
		}
	});
	
	router.post('/reservations', async (req, res, next) => {
	
		try {
	
			let result = await reservations.save(req.fields);
	
			res.json(result);

			io.emit('dashboard update');
			
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
		}
	});
	
	router.delete('/reservations/:id', async (req, res, next) => {
	
		try {
	
			let result = await reservations.delete(req.params.id);
	
			res.json(result);

			io.emit('dashboard update');
			
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
		}
	});
	
	router.get('/users', async (req, res, next) => {
	
		try {
	
			let data = await users.getUsers();
	
			res.render('admin/users', admin.getParams(req, {
				data
			})); 
			
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
		}
	});
	
	router.post('/users', async (req, res, next) => {
	
		try {
			
			let result = await users.save(req.fields);
	
			res.json(result);

			io.emit('dashboard update');
			
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
		}
	});
	
	router.post('/users/changepassword', async (req, res, next) => {
	
		try {
			
			let result = await users.changePassword(req.fields);
	
			res.json(result);
			
		} catch (error) {
			console.error(error);
			res.status(400).json(error);
		}
	});
	
	router.delete('/users/:id', async (req, res, next) => {
	
		try {
	
			let result = await users.delete(req.params.id);
	
			res.json(result);

			io.emit('dashboard update');
			
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
		}
	});

	return router;
} 