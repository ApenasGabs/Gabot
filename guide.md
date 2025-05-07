# Estrutura da Mensagem do WhatsApp no Venom-Bot

Esta documentação explica a estrutura de objetos de mensagem recebidos pelo Venom-Bot, o que pode ser útil para desenvolvedores que desejam manipular, filtrar ou processar mensagens específicas.

## Objeto de Mensagem Completo

Quando você recebe uma mensagem no seu bot através do evento `onMessage`, o Venom-Bot fornece um objeto detalhado contendo todas as informações sobre a mensagem. Vamos analisar os campos mais importantes deste objeto:ls

## Campos Principais

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | String | Identificador único da mensagem |
| `body` | String | Conteúdo textual da mensagem |
| `content` | String | Conteúdo da mensagem (equivalente a `body`) |
| `type` | String | Tipo da mensagem (ex: "chat", "image", "video") |
| `from` | String | ID de origem da mensagem (número de telefone ou ID do grupo) |
| `to` | String | ID de destino (geralmente o número do bot) |
| `author` | String | ID do autor da mensagem (em grupos) |
| `timestamp` | Number | Timestamp da mensagem (em segundos) |
| `notifyName` | String | Nome de exibição do remetente |
| `isGroupMsg` | Boolean | Indica se a mensagem veio de um grupo |

## Identificação de Grupos

```javascript
// Exemplo de como identificar uma mensagem de grupo
if (message.isGroupMsg) {
  const groupId = message.from;  // ID do grupo: '120363132077830172@g.us'
  const groupName = message.groupInfo.name;  // Nome do grupo: 'Eu você e o bot'
  const authorId = message.author;  // ID de quem enviou: '5522988382799@c.us'
  const authorName = message.sender.pushname;  // Nome de quem enviou: 'Isadora Guerra'
}
```

### Campos Específicos de Grupo

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `isGroupMsg` | Boolean | `true` para mensagens de grupo |
| `from` | String | ID do grupo (termina com `@g.us`) |
| `author` | String | ID do participante que enviou a mensagem |
| `groupInfo` | Object | Informações detalhadas sobre o grupo |
| `groupInfo.name` | String | Nome do grupo |
| `groupInfo.id` | String | ID do grupo |

## Informações do Remetente

O objeto `sender` contém informações detalhadas sobre quem enviou a mensagem:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `sender.id` | String | ID do remetente |
| `sender.pushname` | String | Nome de exibição do remetente |
| `sender.name` | String | Nome completo do remetente (se disponível) |
| `sender.shortName` | String | Nome curto do remetente |
| `sender.isUser` | Boolean | Indica se o remetente é um usuário |
| `sender.profilePicThumbObj` | Object | Informações sobre a foto de perfil |

## Conteúdo da Mensagem

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `body` | String | Texto da mensagem |
| `content` | String | Conteúdo da mensagem (geralmente igual a `body`) |
| `type` | String | Tipo do conteúdo (texto, imagem, vídeo, etc.) |
| `mediaData` | Object | Informações sobre mídia anexada (se houver) |
| `isForwarded` | Boolean | Indica se a mensagem foi encaminhada |

## Status da Mensagem

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `ack` | Number | Status de confirmação (0-4) |
| `isNewMsg` | Boolean | Indica se é uma mensagem nova |
| `viewed` | Boolean | Indica se a mensagem foi visualizada |
| `fromMe` | Boolean | Indica se a mensagem foi enviada pelo bot |

## Exemplos de Uso

### Verificando se a mensagem é de um grupo específico

```javascript
function isFromAllowedGroup(message, allowedGroupIds) {
  if (!message.isGroupMsg) {
    return false;
  }
  return allowedGroupIds.includes(message.from);
}
```

### Obtendo informações do autor da mensagem em um grupo

```javascript
function getGroupMessageAuthorInfo(message) {
  if (!message.isGroupMsg) {
    return null;
  }
  
  return {
    groupId: message.from,
    groupName: message.groupInfo.name,
    authorId: message.author,
    authorName: message.sender.pushname,
    content: message.body,
    timestamp: new Date(message.timestamp * 1000)
  };
}
```

### Identificando comandos em mensagens de grupo

```javascript
function handleGroupCommand(message) {
  if (!message.isGroupMsg) {
    return false;
  }
  
  const content = message.body.trim();
  if (content.startsWith('!')) {
    const command = content.substring(1).split(' ')[0];
    const params = content.substring(command.length + 1).trim();
    
    return {
      command,
      params,
      author: message.sender.pushname,
      groupId: message.from,
      groupName: message.groupInfo.name
    };
  }
  
  return false;
}
```

## Observações Importantes

1. Os IDs de grupo sempre terminam com `@g.us`
2. Os IDs de usuário geralmente terminam com `@c.us`
3. Em mensagens de grupo, `from` contém o ID do grupo e `author` contém o ID do remetente
4. Em conversas privadas, `from` contém o ID do remetente e não há `author`
5. Para responder a uma mensagem de grupo, use o ID do grupo (`message.from`)
