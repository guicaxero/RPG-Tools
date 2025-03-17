if (!canvas.tokens.controlled.length) {
    ui.notifications.warn("Selecione seu token antes de usar a macro!");
    return;
}

let actorD = canvas.tokens.controlled[0].actor;
if (!actorD) {
    ui.notifications.warn("Erro: Nenhum ator encontrado!");
    return;
}

let item = actorD.items.find(i => i.name === "Ataque Desarmado");
if (!item) {
    ui.notifications.warn("O personagem não possui um Ataque Desarmado!");
    return;
}

new Dialog({
    title: "Escolha o Tipo de Dano",
    content: `<p>Qual tipo de dano o Ataque Desarmado causará?</p>`,
    buttons: {
        force: {
            label: "Força",
            callback: async () => {
                await item.update({ "system.damage.parts": [["1d10 + @dex", "force"]] });
                ui.notifications.info("Dano do Ataque Desarmado configurado como FORÇA.");
            }
        },
        bludgeoning: {
            label: "Contundente",
            callback: async () => {
                await item.update({ "system.damage.parts": [["1d10 + @dex", "bludgeoning"]] });
                ui.notifications.info("Dano do Ataque Desarmado configurado como CONTUNDENTE.");
            }
        }
    },
    default: "bludgeoning"
}).render(true);