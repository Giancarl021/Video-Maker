# Credenciais

Esta pasta contém os arquivos necessários para autenticar o uso de APIs necessárias para o 
funcionamento da aplicação.

## algorithmia.json

### Estrutura

```json
{
  "ApiKey": "..."
}
```

### Como obter

Crie uma conta no [Algorithmia](https://algorithmia.com/), e após o cadastro vá para sua *home*
e clique em **API Keys**. Em seguida copie o conteúdo dentro de *default-key* e cole no valor para
a chave "ApiKey" no arquivo *json*.

## google-custom-search.json

### Estrutura

```json
{
  "APIKey": "...",
  "SearchEngineAPIKey": "..."
}
```

### Como obter

**_Work in Progress..._**

## google-youtube.json

### Estrutura

```json
{
  "web": {
    "client_id": "...",
    "project_id": "...",
    "auth_uri": "...",
    "token_uri": "...",
    "auth_provider_x509_cert_url": "...",
    "client_secret": "...",
    "redirect_uris": [
      "..."
    ],
    "javascript_origins": [
      "..."
    ]
  }
}
```

### Como obter

**_Work in Progress..._**

## watson-nul.json

### Estrutura
```json
{
  "apikey" : "...",
  "iam_apikey_description" : "...",
  "iam_apikey_name": "...",
  "iam_role_crn": "...",
  "iam_serviceid_crn": "...",
  "url": "..."
}
```

### Como obter

**_Work in Progress..._**
