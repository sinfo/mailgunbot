curl -i -H "Content-type: application/json" -X POST http://localhost:8888 -d '
    {
	    "name" : "Pedro",
	    "email" : "pedro.correia.105@gmail.com",
	    "subject" : "Teste-Sinfo",
	    "message" : "Eu amo o Bagulho (not really)",
	    "recaptcha" : "123"
    }'