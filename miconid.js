let entidadeSimbiotica = async function() {
    const effectName = "Entidade Simbiótica";
    const actor = game.user.character;
    if (!actor) return ui.notifications.warn("Você não tem um personagem atribuído.");
    const token = actor.getActiveTokens()[0];
    if (!token) return ui.notifications.warn("Nenhum token ativo encontrado.");

    let existingEffect = actor.effects.find(ef => ef.label === effectName);
    
    if (existingEffect) {
        await actor.deleteEmbeddedDocuments("ActiveEffect", [existingEffect.id]);
        ui.notifications.info(`${effectName} desativada.`);
    } else {
        const effectData = {
            label: effectName,
            origin: actor.uuid,
            changes: [
                { key: "system.bonuses.mwak.damage", mode: CONST.ACTIVE_EFFECT_MODES.ADD, value: "1d6", priority: 20 },
                { key: "system.bonuses.rwak.damage", mode: CONST.ACTIVE_EFFECT_MODES.ADD, value: "1d6", priority: 20 },
                { key: "system.bonuses.msak.damage", mode: CONST.ACTIVE_EFFECT_MODES.ADD, value: "1d6", priority: 20 },
                { key: "system.bonuses.rsak.damage", mode: CONST.ACTIVE_EFFECT_MODES.ADD, value: "1d6", priority: 20 }
            ],
        };

        await actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
    }
};

entidadeSimbiotica();
