const axios = require("axios");

exports.handler = async (event) => {
  const APP_KEY = process.env.OMIE_APP_KEY;
  const APP_SECRET = process.env.OMIE_APP_SECRET;

  const payload = {
    call: "ListarClientes",
    app_key: APP_KEY,
    app_secret: APP_SECRET,
    param: [
      {
        pagina: 1,
        registros_por_pagina: 10,
        apenas_importado_api: "N"
      }
    ]
  };

  try {
    const response = await axios.post("https://app.omie.com.br/api/v1/geral/clientes/", payload, {
      headers: { "Content-Type": "application/json" }
    });

    const clientes = response.data.clientes_cadastro || [];

    return {
      statusCode: 200,
      body: JSON.stringify({
        total: clientes.length,
        clientes: clientes.map(c => ({
          codigo: c.codigo_cliente_omie,
          nome: c.razao_social
        }))
      })
    };
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        erro: "Erro ao acessar a API do Omie",
        detalhes: error.response?.data || error.message
      })
    };
  }
};
