var express = require('express');
var router = express.Router();
const menus = require('../database/include/menus');
const reservations = require('../database/include/reservations');
const contacts = require('../database/include/contacts');
const subscribe = require('../database/include/subscribe');

module.exports = function (io){

	/* GET home page. */
	router.get('/', async function(req, res, next) {

		try {

			res.render('index', { 
				title: 'Restaurante',
				menus: await menus.getMenus(),
				isHome: true
			}); 
			
		} catch (error) {
			//res.status(500).json(error)
				console.error(error);
		}
	});

	router.get('/contacts', (req, res) => {

		contacts.render(req, res);

	});

	router.post('/contacts', async (req, res) => {

		if(! req.body.name){

			contacts.render(req, res, 'Digite seu nome');

		} else if (! req.body.email){

			contacts.render(req, res, 'Digite seu email');

		} else if (! req.body.message){

			contacts.render(req, res, 'Digite sua mensagem');

		} else {

			try {

				await contacts.save(req.body);

				req.body = {};
			
				contacts.render(req, res, null, 'Mensagem enviada com sucesso!');

				io.emit('dashboard update');
				
			} catch (error) {
				contacts.render(req, res, error.message);
			}
		}
	});

	router.get('/menus', async (req, res) => {

		try {

			res.render('menus', {
				title: 'Menu - Restaurante',
				background: 'images/img_bg_1.jpg',
				h1: 'Saboreie nosso menu!',
				menus: await menus.getMenus()
			});
		
		} catch (error) {
			console.error(error);
		}
	});

	router.get('/reservations', (req, res) => {

		reservations.render(req, res);

	});

	router.post('/reservations', async (req, res) => {

		if(! req.body.name) {

			reservations.render(req, res, 'Digite um nome');

		} else if(! req.body.email) {

			reservations.render(req, res, 'Digite um email');
		
		} else if(! req.body.people) {

			reservations.render(req, res, 'Defina quantas pessoas');
		
		} else if(! req.body.date) {

			reservations.render(req, res, 'Escolha uma data');
		
		} else if(! req.body.time) {

			reservations.render(req, res, 'Escolha um horário');

		} else {

			try {

				await reservations.save(req.body);

				req.body = {};

				/*
				for(let key in req.body){
					req.body[key] = '';
				}*/
				
				reservations.render(req, res, undefined, 'Reserva realizada com sucesso!');

				io.emit('dashboard update');
			
			} catch (error) {
				reservations.render(req, res, error.message);
			}
		}
	});

	router.get('/services', (req, res) => {

		res.render('services', {
			title: 'Serviços - Restaurante',
			background: 'images/img_bg_1.jpg',
			h1: 'É um prazer poder servir!'
		});

	});

	router.post('/subscribe', async (req, res) => {

		try {

			await subscribe.save(req.body);
			
			res.redirect('/');

			io.emit('dashboard update');
			
		} catch (error) {
			console.error(error);
		}
	});
	
	return router;
}
