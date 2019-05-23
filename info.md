########## EXPRESS FRONT ###########

```
sudo npm i -g express-generator
```

```
express --ejs nome-projeto
```

```
npm i
```

```
DEBUG=projeto-restaurante:* & npm start
```

########## BOWER ################

```
sudo npm i -g bower
```

```
bower i
```

########## MYSQL ###############

```
sudo docker run -d --name mariadb-restaurante -e MYSQL_RANDOM_ROOT_PASSWORD=yes -e MYSQL_DATABASE=restaurante -e MYSQL_USER=user -e MYSQL_PASSWORD=123 -p 3306:3306 mariadb:10.3.14-bionic --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
```

```
sudo docker exec -ti mariadb-restaurante mysql -u user -p
```

# backup
```
docker exec mariadb-restaurante sh -c 'exec mysqldump --all-databases -uroot -p"$MYSQL_ROOT_PASSWORD"' > /home/bruno/Workspace/JavaScript/curso-javascript-completo-udemy/projeto-restaurante/public/db/mariadb-restaurante.sql
```


############ REDIS #################

```
sudo docker run -d --name redis-restaurante -p 6379:6379 redis:5.0.5-stretch
```