#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const chalk = require("chalk");
const readline = require("readline");

const program = new Command();
const FILE_PATH = path.join(
  process.env.HOME || process.env.USERPROFILE,
  ".todo-dev.json"
);

const TAG_COLORS = {
  bug: chalk.red.bold,
  urgente: chalk.redBright,
  melhoria: chalk.cyan,
  feature: chalk.blue,
  ideia: chalk.gray,
  refatorar: chalk.yellow,
  baixa: chalk.white.dim,
  media: chalk.white,
  alta: chalk.redBright,
};

const loadData = () => {
  if (!fs.existsSync(FILE_PATH)) return [];
  return JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
};

const saveData = (data) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

const renderTags = (tags) => {
  if (!tags || tags.length === 0) return "";
  return tags
    .map((tag) => {
      const color = TAG_COLORS[tag.toLowerCase()] || chalk.white;
      return color(`#${tag}`);
    })
    .join(" ");
};

const printTasks = (tasks) => {
  if (tasks.length === 0) {
    console.log(chalk.gray("Sem tarefas."));
    return;
  }
  tasks.forEach((t, i) => {
    const statusColor =
      {
        "a fazer": chalk.yellow,
        "em andamento": chalk.blue,
        "PR aberto": chalk.magenta,
        feito: chalk.green,
      }[t.status] || chalk.white;
    console.log(
      `[${i}] [${statusColor(t.status)}] ${t.text} ${renderTags(t.tags)}`
    );
  });
};

const updateStatus = (index, status) => {
  const data = loadData();
  if (!data[index]) return console.log(chalk.red("Índice inválido."));
  data[index].status = status;
  saveData(data);
  console.log(chalk.green(`Status atualizado para "${status}".`));
};

program
  .command("add [text]")
  .description("Adiciona uma nova tarefa")
  .option("--tag <tags...>", "Tags associadas à tarefa")
  .action((text, options) => {
    const data = loadData();

    const promptInput = async () => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const ask = (q) => new Promise((res) => rl.question(q, res));

      const enteredText = await ask(chalk.cyan("Digite a tarefa: "));
      const enteredTags = await ask(
        chalk.cyan("Tags (separadas por espaço, ou vazio): ")
      );

      rl.close();

      data.push({
        text: enteredText,
        status: "a fazer",
        tags: enteredTags ? enteredTags.split(" ") : [],
      });

      saveData(data);
      console.log(chalk.green("Tarefa adicionada."));
    };

    if (text) {
      data.push({ text, status: "a fazer", tags: options.tag || [] });
      saveData(data);
      console.log(chalk.green("Tarefa adicionada."));
    } else {
      promptInput();
    }
  });

program
  .command("list")
  .option("--status <status>", "Filtra por status")
  .option("--tag <tag>", "Filtra por tag")
  .description("Lista todas as tarefas")
  .action((opts) => {
    const data = loadData();
    let filtered = data;
    if (opts.status) {
      filtered = filtered.filter((d) => d.status === opts.status);
    }
    if (opts.tag) {
      filtered = filtered.filter((d) => d.tags && d.tags.includes(opts.tag));
    }
    printTasks(filtered);
  });

program
  .command("done <index>")
  .description("Marca a tarefa como feita")
  .action((index) => updateStatus(index, "feito"));
program
  .command("dn <index>")
  .description("Alias de done")
  .action((index) => updateStatus(index, "feito"));
program
  .command("doing <index>")
  .description("Marca como em andamento")
  .action((index) => updateStatus(index, "em andamento"));
program
  .command("dg <index>")
  .description("Alias de doing")
  .action((index) => updateStatus(index, "em andamento"));
program
  .command("todo <index>")
  .description("Marca como a fazer")
  .action((index) => updateStatus(index, "a fazer"));
program
  .command("td <index>")
  .description("Alias de todo")
  .action((index) => updateStatus(index, "a fazer"));
program
  .command("pr <index>")
  .description("Marca como PR aberto")
  .action((index) => updateStatus(index, "PR aberto"));
program
  .command("p <index>")
  .description("Alias de pr")
  .action((index) => updateStatus(index, "PR aberto"));

program
  .command("status <index> <status>")
  .description("Atualiza o status da tarefa manualmente")
  .action((index, status) => updateStatus(index, status));

program
  .command("remove")
  .description("Remove uma tarefa interativamente")
  .action(async () => {
    const data = loadData();
    if (data.length === 0) {
      console.log(chalk.gray("Nenhuma tarefa para remover."));
      return;
    }

    const choices = data.map((t, i) => {
      const status = t.status || "a fazer";
      const tags = renderTags(t.tags);
      return {
        name: `[${i}] [${status}] ${t.text} ${tags}`,
        value: i,
      };
    });

    choices.push({
      name: chalk.dim("Cancelar"),
      value: "cancel",
    });

    const { index } = await inquirer.prompt([
      {
        type: "list",
        name: "index",
        message: "Qual tarefa deseja remover?",
        choices,
      },
    ]);

    if (index === "cancel") {
      console.log(chalk.yellow("Operação cancelada."));
      return;
    }

    const { confirm } = await inquirer.prompt([
      {
        type: "list",
        name: "confirm",
        message: "Tem certeza que deseja remover essa tarefa?",
        choices: ["Sim", "Não"],
      },
    ]);

    if (confirm === "Sim") {
      data.splice(index, 1);
      saveData(data);
      console.log(chalk.green("Tarefa removida com sucesso!"));
    } else {
      console.log(chalk.yellow("Operação cancelada."));
    }
  });

program
  .command("clear")
  .description("Remove todas as tarefas")
  .action(() => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(
      chalk.red("Tem certeza que deseja remover todas as tarefas? (S/n): "),
      (answer) => {
        if (answer.toLowerCase() === "s" || answer.toLowerCase() === "sim") {
          saveData([]);
          console.log(chalk.green("Todas as tarefas foram removidas."));
        } else {
          console.log(chalk.yellow("Operação cancelada."));
        }
        rl.close();
      }
    );
  });

program.parse(process.argv);
