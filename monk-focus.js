if (!canvas.tokens.controlled.length) {
    ui.notifications.warn("Selecione seu token antes de usar a macro!");
    return;
}

let actorD = canvas.tokens.controlled[0].actor;
if (!actorD) {
    ui.notifications.warn("Erro: Nenhum ator encontrado!");
    return;
}

let features = [
    {
        name: "Flurry of Blows",
        cost: 1,
        action: async () => {
            let item = actorD.items.find(i => i.name === "Flurry of Blows");
            if (item) {
                await item.use();
            } else {
                ui.notifications.warn("Flurry of Blows não encontrado no personagem!");
            }
        }
    },
    {
        name: "Stunning Strike",
        cost: 1,
        action: async () => {
            let item = actorD.items.find(i => i.name === "Stunning Strike");
            if (item) {
                await item.use();
            } else {
                ui.notifications.warn("Stunning Strike não encontrado no personagem!");
            }
        }
    },
    {
        name: "Deflect Attacks",
        cost: 1,
        action: async () => {
            let item = actorD.items.find(i => i.name === "Deflect Attacks");
            if (item) {
                await item.use();
            } else {
                ui.notifications.warn("Deflect Attacks não encontrado no personagem!");
            }
        }
    },
    {
        name: "Step of the Wind",
        cost: 1,
        action: async () => {
            let item = actorD.items.find(i => i.name === "Step of the Wind");
            if (item) {
                await item.use();
            } else {
                ui.notifications.warn("Step of the Wind não encontrado no personagem!");
            }
        }
    },
    {
        name: "Patient Defense",
        cost: 1,
        action: async () => {
            let item = actorD.items.find(i => i.name === "Patient Defense");
            if (item) {
                await item.use();
            } else {
                ui.notifications.warn("Patient Defense não encontrado no personagem!");
            }
        }
    }
];

let monkFocus = actorD.items.find(i => i.name === "Monk's Focus");
if (!monkFocus) {
    ui.notifications.warn("Não foi encontrado o item 'Monk's Focus' no personagem!");
    return;
}

let buttons = {};
features.forEach(feature => {
    buttons[feature.name] = {
        label: feature.name,
        callback: async () => {
            if (monkFocus.system.uses.value >= feature.cost) {
                let newFocusValue = monkFocus.system.uses.value - feature.cost;
                await monkFocus.update({ "system.uses.value": newFocusValue });

                await feature.action();

                ui.notifications.info(`Monk Focus reduzido! Restam ${newFocusValue} usos.`);
            } else {
                ui.notifications.warn("Pontos de Monk Focus insuficientes!");
            }
        }
    };
});

new Dialog({
    title: "Escolha a Feature",
    content: `<p>Escolha qual habilidade você deseja usar:</p>`,
    buttons: buttons,
    default: features[0].name
}).render(true);
