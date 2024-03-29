var express = require('express');
var router = express.Router();
var sequelize = require('../models').sequelize;
var Registro = require('../models').Registro;

/* Recuperar os últimos N registros */
router.get('/ultimas', function(req, res, next) {
	
	// quantos são os últimos registros que quer? 8 está bom?
	const limite_linhas = 7;

	console.log(`Recuperando os últimos ${limite_linhas} registros`);
	
	const instrucaoSql = `select top ${limite_linhas} 
						data_hora, 
						situacao,
						FORMAT(data_hora,'HH:mm:ss') as momento_grafico
						from tb_registros order by id_registro`;

	sequelize.query(instrucaoSql, {
		model: Registro,
		mapToModel: true
	  })
	  .then(resultado => {
			console.log(`Encontrados: ${resultado.length}`);
			res.json(resultado);
	  }).catch(erro => {
			console.error(erro);
			res.status(500).send(erro.message);
	  });
});


// tempo real (último valor de cada leitura)
router.get('/tempo-real', function (req, res, next) {
	
	console.log(`Recuperando os últimos registros`);

	const instrucaoSql = `select top 1 situacao from tb_registros order by id_registro`;

	sequelize.query(instrucaoSql, { type: sequelize.QueryTypes.SELECT })
		.then(resultado => {
			res.json(resultado[0]);
		}).catch(erro => {
			console.error(erro);
			res.status(500).send(erro.message);
		});
  
});


// estatísticas (max, min, média, mediana, quartis etc)
router.get('/estatisticas', function (req, res, next) {
	
	console.log(`Recuperando as estatísticas atuais`);

	const instrucaoSql = `select 
							max(temperatura) as temp_maxima, 
							min(temperatura) as temp_minima, 
							avg(temperatura) as temp_media,
							max(umidade) as umidade_maxima, 
							min(umidade) as umidade_minima, 
							avg(umidade) as umidade_media 
						from tb_registros`;

	sequelize.query(instrucaoSql, { type: sequelize.QueryTypes.SELECT })
		.then(resultado => {
			res.json(resultado[0]);
		}).catch(erro => {
			console.error(erro);
			res.status(500).send(erro.message);
		});
  
});


module.exports = router;
