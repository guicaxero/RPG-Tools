let increase2AC = async function() {
    const effectName = "Shield Of Faith";
    const target = game.user.character.getActiveTokens()[0];

    let existingEffect = target.actor.effects.find(ef => ef.label === effectName);
    
    if (existingEffect) {
        await target.actor.deleteEmbeddedDocuments("ActiveEffect", [existingEffect.id]);
    } else {
        let effectData = {
            label: effectName,
            icon: "icons/magic/defensive/shield-barrier-deflect-gold.webp",
            changes: [
                {
                    key: "system.attributes.ac.bonus",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: 2,
                }
            ],
            duration: {turns: 10},
            origin: target.actor.uuid, 
        };
        
        await target.actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
    }
};

increase2AC();
