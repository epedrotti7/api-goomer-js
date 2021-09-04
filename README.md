
API para criação de Restaurantes, com base no desafio da empresa Goomer:
https://github.com/goomerdev/job-dev-backend-interview/blob/master/README.md

Optei por fazer em JS puro, porém me arrependi arduamente pela falta de tipos, utilizei as tecnologias:

* [NodeJS](https://nodejs.org/en/)
* [ExpressJS](https://expressjs.com/pt-br/) 
* [mysql2](https://www.npmjs.com/package/mysql2)
* [Docker](https://www.docker.com/)

OBS: fiz as query concatenando strings, ciente de que esse é um método "ridiculo" pois é alvo facil de SQL Injection, porém como é algo para estudo, para mim não teve diferença.

Para rodar o projeto, basta ter o docker instalado, e rodar o arquivo docker compose com o comando 
```bash
    sudo docker-compose up 
```
Ao startar a api, as tabelas serão criadas, e basta fazer as requisições via client http, caso a api dê erro ao startar a primeira vez, starte-a novamente.
