 ## :bookmark: Projeto 

- Grades Control API, projeto criado para aprendizado de utilização da linguagem [NodeJS](https://nodejs.org/en/ "NodeJS"), visando controle de notas por atividades (type) de cada matéria (subject) utilizando como forma de armazenamento arquivo [JSON](https://www.json.org/json-en.html "JSON")

## :computer: Tecnologias 

- [NodeJS](https://nodejs.org/en/ "NodeJS")
- [Express](https://expressjs.com/ "Express")
- [Winston](https://github.com/winstonjs/winston "Winston") - Criação de Logs
- [Insomnia](https://insomnia.rest/ "Insomnia") - Efetuando testes das requisições

## :arrow_forward: Getting Started

- Passo 1: executar a instalação do [NodeJS](https://nodejs.org/en/ "NodeJS")
- Passo 2: git clone do projeto grades-control-api

      # Navegando até a pasta do projeto
      $ cd grades-control-api
    
      # Instalando todas as depêndencias necessárias
      $ npm install
    
      # Starting o backend da aplicação
      $ npm run dev

## :hammer: Casos de Teste 
    # Requisição de criação
    POST - /grades
    params: {
      "student": "Rafael Sanzio",
      "subject": "01 - JavaScript",
      "type": "Fórum",
      "value": 10
    }

	# Requisições de listagens
	GET - /grades #Listando todas as grades
	GET - /grades/{id} #Retornando apenas uma grade

	# Requisição de exclusão
	DELETE - /grades/{id}

	# Requisição de atualização
	PUT - /grades/{id}
	params: {
      "student": "Rafael Sanzio",
      "subject": "03 - React",
      "type": "Desafio",
      "value": 15
	}

	# Requisição retornando soma dos valores do estudante para a matéria
	GET - /grades/sum/values
	params: {
      "student": "Rafael Sanzio",
      "subject": "03 - React"
	}

	# Requisição retornando a média das notas da matéria pelo tipo de atividade
	GET - /grades/avg/values
	params: {
      "subject": "04 - MongoDB",
      "type": "Trabalho Prático"
	}

	# Requisição retornando os três maiores valores da matéria pelo tipo de atividade
	GET - /grades/max/values
	params: {
      "subject": "04 - MongoDB",
      "type": "Trabalho Prático"
	}

<h1 align="center">
	<img alt="Desafio conceitos nodeJS" src="https://insomnia.rest/images/run.svg" />
</h1>


## :camera: Imagens 
<h1 align="center">
    <img alt="Grades Control nodeJS" src="https://user-images.githubusercontent.com/18368947/84332540-8c2b9580-ab63-11ea-9118-4ceeaea6c9f6.png" />
</h1>

## :congratulations: Considerações 
- Projeto desenvolvido no Bootcamp - Full Stack da [IGTI](https://www.igti.com.br/ "IGTI")  by:

- <i class="fa fa-github" aria-hidden="true"></i> [Rafael Sanzio - GitHub](https://github.com/rafaelsanzio "Rafael Sanzio")
- <i class="fa fa-linkedin" aria-hidden="true"></i> [Rafael Sanzio - LinkedIn](https://www.linkedin.com/in/rafael-sanzio-012778143/ "Rafael Sanzio")
