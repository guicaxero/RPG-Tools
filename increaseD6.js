let increaseD6 = async function() {
    const effectName = "Flame Gem";
    const target = game.user.character.getActiveTokens()[0];

    let existingEffect = target.actor.effects.find(ef => ef.label === effectName);
    
    if (existingEffect) {
        await target.actor.deleteEmbeddedDocuments("ActiveEffect", [existingEffect.id]);
    } else {
        let effectData = {
            label: effectName,
            changes: [
                {
                    key: "system.bonuses.mwak.damage",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "1d6",
                    priority: 20
                }
            ],
            origin: target.actor.uuid, 
        };
        
        await target.actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
    }
};

increaseD6();
