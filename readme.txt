Para executar a aplicação iniciar a API com:
"npm run api"

Para alterar arquivo enviar.js realizar o comando:
"browserify ./client/enviar.html > ./client/dist/bundle.js"
or
"browserify ./client/enviar.html -o ./client/dist/bundle.js"

Ou então automatiza o processo utilizando watchify:
"npm i -D watchify"
Atualiza 'package.json' com o comando:
"watch" : "npx watchify <source>.js -o <output>.js"
Depois roda:
"npm run watch"
