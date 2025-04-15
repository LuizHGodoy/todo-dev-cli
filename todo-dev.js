#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const readline = require("readline");

const program = new Command();
const FILE_PATH = path.join(
  process.env.HOME || process.env.USERPROFILE,
  ".todo-dev.json"
);

const loadData = () => {
  if (!fs.existsSync(FILE_PATH)) return [];
  return JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
};

const saveData = (data) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
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
    console.log(`[${i}] [${statusColor(t.status)}] ${t.text}`);
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
  .command("add <text>")
  .description("Adiciona uma nova tarefa")
  .action((text) => {
    const data = loadData();
    data.push({ text, status: "a fazer" });
    saveData(data);
    console.log(chalk.green("Tarefa adicionada."));
  });

program
  .command("list")
  .option("--status <status>", "Filtra por status")
  .description("Lista todas as tarefas")
  .action((opts) => {
    const data = loadData();
    const filtered = opts.status
      ? data.filter((d) => d.status === opts.status)
      : data;
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
  .description("Marca a tarefa como em andamento")
  .action((index) => updateStatus(index, "em andamento"));

program
  .command("dg <index>")
  .description("Alias de doing")
  .action((index) => updateStatus(index, "em andamento"));

program
  .command("todo <index>")
  .description("Marca a tarefa como a fazer")
  .action((index) => updateStatus(index, "a fazer"));

program
  .command("td <index>")
  .description("Alias de todo")
  .action((index) => updateStatus(index, "a fazer"));

program
  .command("pr <index>")
  .description("Marca a tarefa como PR aberto")
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
  .command("remove <index>")
  .description("Remove uma tarefa")
  .action((index) => {
    const data = loadData();
    if (!data[index]) return console.log(chalk.red("Índice inválido."));
    data.splice(index, 1);
    saveData(data);
    console.log(chalk.green("Tarefa removida."));
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
      chalk.red("Tem certeza que deseja remover todas as tarefas? (s/n): "),
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
