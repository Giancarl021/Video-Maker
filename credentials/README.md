# Credenciais

Esta pasta contém os arquivos necessários para autenticar o uso de APIs necessárias para o 
funcionamento da aplicação.

## Como Obter
Um tuturial detalhado se encontra no [README](https://github.com/filipedeschamps/video-maker/blob/master/README.md) repositório original.

## algorithmia.json

### Estrutura

```json
{
  "ApiKey": "..."
}
```

## google-custom-search.json

### Estrutura

```json
{
  "APIKey": "...",
  "SearchEngineAPIKey": "..."
}
```

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
