let rage = async function() {
    const effectName = "RAGEEEEEEEEEEEEEEEE";
    const target = canvas.tokens.controlled[0] || game.user.character.getActiveTokens()[0];

    if (!target) {
        ui.notifications.warn("Nenhum token selecionado.");
        return;
    }

    // Encontrar o efeito existente no ator
    let existingEffect = target.actor.effects.find(ef => ef.label === effectName);
    
    if (existingEffect) {
        // Se o efeito existe, desativá-lo
        await target.actor.deleteEmbeddedDocuments("ActiveEffect", [existingEffect.id]);
        var the_message = `<em><strong>${target.name}</strong> Entrou em Fúria.</em>`;
    } else {
        // Caso contrário, criar e ativar o efeito com +1d6 de dano em ataques corpo a corpo e à distância
        let effectData = {
            label: effectName,
            changes: [
                {
                    key: "system.bonuses.mwak.damage", // Para ataques corpo a corpo
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "2", // Adiciona 1d6 de dano
                    priority: 20
                },
                {
                    key: "system.bonuses.rwak.damage", // Para ataques à distância
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "2", // Adiciona 1d6 de dano
                    priority: 20
                }
            ],
            origin: target.actor.uuid, // Vincula o efeito ao ator atual
        };
        
        // Garantir que o efeito não seja duplicado ao ser aplicado várias vezes
        await target.actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
        var the_message = `<em><strong>${target.name}</strong> Amansou</em>`;
    }

    // Criar uma mensagem no chat para informar a mudança
    ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({token: target}),
        content: the_message,
        type: CONST.CHAT_MESSAGE_TYPES.EMOTE
    });
};

// Chamar a função
rage();
