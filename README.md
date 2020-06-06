# Video Maker

## Função

Video Maker é uma aplicação em *Nodejs* com o objetivo de renderizar um vídeo e carregá-lo no YouTube
com o mínimo de interferência do usuário. Este repositório foi baseado no projeto do 
[Filipe Deschamps](https://github.com/filipedeschamps/video-maker).

## Funcionamento

Ao executar o arquivo *index.js* o terminal irá pedir algumas informações:

### Utilização

Durante todo o processo, o terminal informará a operação que está sendo realizada no momento

#### Entradas

```
Digite o termo de busca (Wikipedia):
```

Esta linha irá receber as palavras-chave para serem pesquisadas na Wikipédia, bem como o título do 
vídeo que será postado posteriormente no YouTube.

```
[1] Quem e
[2] O que e
[3] A historia de
[0] CANCEL

Selecione um prefixo [1, 2, 3, 0]:
```

Esta linha irá receber o prefixo do título do vídeo que posteriormente ficará no YouTube e na 
*thumbnail* do vídeo.

**Por exemplo:**

- Palavras-chave: Superman
- Prefixo: Quem é
- Título do Vídeo: **Quem é Superman** 

```
[1] Superman
[2] Batman v Superman: Dawn of Justice
[3] Poderes e habilidades do Superman
[4] Superman (filme)
[5] Kryptonita
[6] Maldicao do Superman
[7] O Superman
[8] Superman III
[9] The Death of Superman
[a] Superman Returns
[0] CANCEL

Selecione o artigo [1...9, a, 0]:
```

Esta linha irá receber o artigo base para o material escrito do vídeo, sendo as opções os 10
primeiros artigos retornados da pesquisa das palavras-chave na Wikipédia.

```
> Aguardando autorização em <link>
```

Esta linha irá aguardar que o usuário autentique o envio do vídeo renderizado no YouTube por meio
do *link* impresso. Para autenticar, copie o link e cole-o no seu navegador, e siga o passos de
autenticação do Google.

Após ser feita a autenticação, o envio do vídeo será iniciado. 

#### Saída

```
> Vídeo disponível em <link>
```

Após o término do envio do vídeo e da thumbnail ao YouTube, o aplicativo informará a *URL* do
vídeo. Para assití-lo, basta copiar o link impresso e colá-lo no navegador.

# Instalação

### Dependências

Após clonar o projeto, execute na pasta raíz o comando

```
npm install
```

Este comando irá instalar todas as dependências do *Nodejs* necessárias para executar o projeto
 
### Credenciais

Dentro da pasta *Credentials* será necessária a adição de 4 arquivos:

 - algorithmia.json
 - google-custom-search.json
 - google-youtube.json
 - watson-nlu.json
 
 Cada arquivo destes necessita de chaves de API para todas as funções da aplicação executarem
 corretamente. Para mais informações leia o arquivo [README](credentials/README.md) localizado
 na pasta *Credentials*.
 
 ### Arquivos base
 
 A aplicação necessita de alguns arquivos base para funcionar, sendo estes localizados na pasta
 [*data*](data):
 
 - audio.json
 - audio/src/*.mp3
 - images/static/start.png
 - images/static/end.png
