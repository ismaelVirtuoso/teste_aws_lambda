const axios = require("axios");

// Configuration file or environment variable handler
const getConfig = () => ({
  appKey: process.env.OMIE_APP_KEY,
  appSecret: process.env.OMIE_APP_SECRET,
  apiUrl: "https://app.omie.com.br/api/v1/geral/clientes/"
});

// Function to construct payload
const createPayload = (page = 1, recordsPerPage = 10, importedApi = "N") => ({
  call: "ListarClientes",
  app_key: getConfig().appKey,
  app_secret: getConfig().appSecret,
  param: [
    {
      pagina: page,
      registros_por_pagina: recordsPerPage,
      apenas_importado_api: importedApi
    }
  ]
});

// Function to make API call
const fetchClientes = async (payload) => {
  try {
    const response = await axios.post(getConfig().apiUrl, payload, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data.clientes_cadastro || [];
  } catch (error) {
    console.error("Error fetching clients:", error.message);
    throw new Error("Failed to fetch clients from Omie API");
  }
};

// Function to format response
const formatClientes = (clientes) =>
  clientes.map((c) => ({
    codigo: c.codigo_cliente_omie,
    nome: c.razao_social
  }));

// Lambda handler
exports.handler = async (event) => {
  const payload = createPayload();

  try {
    const clientes = await fetchClientes(payload);
    return {
      statusCode: 200,
      body: JSON.stringify({
        total: clientes.length,
        clientes: formatClientes(clientes)
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};