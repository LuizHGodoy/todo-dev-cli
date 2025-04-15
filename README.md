# 🧠 todo-dev

[![npm](https://img.shields.io/npm/v/ttodo-cli)](https://www.npmjs.com/package/ttodo-cli)

Um CLI minimalista para desenvolvedores gerenciarem tarefas de forma rápida e direta no terminal.  
Ideal pra acompanhar o fluxo de PRs, bugs, refatorações ou qualquer coisa que você tá tramando no código.  
Funciona em **Windows, macOS e Linux** via Node.js.

---

## 📦 Instalação

### Usar direto com npx (recomendado):

```bash
npx ttodo-cli add "testando o CLI"
npx ttodo-cli list
```

### Ou instalar globalmente:

```bash
npm install -g ttodo-cli
todo add "primeira tarefa"
todo list
```

---

## 🛠 Comandos disponíveis

```bash
todo add "Texto da tarefa"
todo add             # modo interativo para digitar a tarefa e tags
todo list
todo list --status "feito"
todo done <index>
todo status <index> "<novo status>"
todo remove <index>
todo remove          # modo interativo com seleção da tarefa
todo clear
```

### 🎯 Aliases rápidos:

```bash
todo td <index>       # a fazer
todo dg <index>       # em andamento
todo p <index>        # PR aberto
todo dn <index>       # feito
```

---

## 💾 Onde os dados são salvos?

```bash
C:\Users\SeuUsuário\.todo-dev.json
```

---

🧠 Feito por e para devs cansados de tools overkill 😎
