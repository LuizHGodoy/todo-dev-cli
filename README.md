# 🧠 todo-dev

[![npm](https://img.shields.io/npm/v/ttodo-cli)](https://www.npmjs.com/package/ttodo-cli)

Um CLI minimalista para desenvolvedores gerenciarem tarefas de forma rápida e direta no terminal.
Ideal pra acompanhar o fluxo de PRs, bugs, refatorações ou qualquer coisa que você tá tramando no código.
Funciona no Windows 11 como um `.exe` com wrapper `.cmd` global.

---

## 📦 Instalação

1. Copie `todo-dev.exe` e `todo.cmd` para uma pasta (ex: `C:\dev-tools\todo-cli\`)
2. Adicione essa pasta ao `PATH` do sistema
3. Agora você pode usar o comando `todo` de qualquer lugar 🎯

---

### 🛠 Comandos disponíveis

Comandos disponíveis:

todo add "Texto da tarefa"
→ Adiciona uma nova tarefa com status padrão "a fazer"

todo list
→ Lista todas as tarefas

todo list --status "feito"
→ Lista tarefas filtrando por status

todo done <index>
→ Marca a tarefa com o índice especificado como "feito"
Ex: todo done 1

todo status <index> "<novo status>"
→ Atualiza o status da tarefa
Ex: todo status 0 "PR aberto"

todo remove <index>
→ Remove a tarefa com o índice especificado
Ex: todo remove 2

### 📝 Listar tarefas

```bash
todo list
```

### ➕ Adicionar uma nova tarefa

```bash
todo add "Implementar cache no backend"
```

### ✅ Marcar uma tarefa como feita

```bash
todo done <index>
```

### ❌ Remover uma tarefa

```bash
todo remove <index>
```

### 📝 Exemplo:

```bash
todo remove 0
```

💾 Onde os dados são salvos?
Atualmente em:
C:\Users\SeuUsuário\.todo-dev.json
(Em breve: opção pra salvar no mesmo dir do .exe)

🧠 Feito por e para devs cansados de tools overkill 😎
