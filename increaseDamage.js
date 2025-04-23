let assassinate = async function() {
    const effectName = "Assassinate";
    const target = game.user.character.getActiveTokens()[0];

    let existingEffect = target.actor.effects.find(ef => ef.label === effectName);
    
    if (existingEffect) {
        await target.actor.deleteEmbeddedDocuments("ActiveEffect", [existingEffect.id]);
    } else {
        let effectData = {
            label: effectName,
            changes: [
                {
                    key: "system.bonuses.weapon.damage",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "@classes.rogue.levels",
                    priority: 20
                }
            ],
            origin: target.actor.uuid, 
        };
        
        await target.actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
    }
};

assassinate();
