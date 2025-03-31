const macroFlag = "sneak-attack-toggle"; 

if (!game.user.flags[macroFlag]) {
    ui.notifications.info("⚔️ Macro de Dano Ativada!");
    game.user.setFlag("world", macroFlag, true);
} else {
    ui.notifications.warn("⚔️ Macro de Dano Desativada!");
    game.user.unsetFlag("world", macroFlag);
}

Hooks.on("midi-qol.RollComplete", async (workflow) => {
    if (!game.user.flags[macroFlag]) return;

    if (!workflow.isAttackRoll || !workflow.hitTargets.size) return; 

    const attacker = workflow.actor;
    const target = workflow.hitTargets.first(); 

    if (!attacker || !target) return;

    const hasAdvantage = workflow.advantage;

    const alliesNearby = canvas.tokens.placeables.some(token => {
        if (token === target || token.actor === attacker) return false; 
        return token.actor?.alliance === attacker.alliance && canvas.grid.measureDistance(target, token) <= 5;
    });

    if (hasAdvantage || alliesNearby) {
        const roll = await new Roll("1d6").roll({async: true});

        workflow.damageRoll._total += roll.total;
        workflow.damageRoll.terms.push(...roll.terms);

        await workflow.damageRoll._evaluate();
        await workflow.item?.update({ "system.damage.parts": [[`${workflow.damageRoll.formula}`, ""] ] });

        ui.notifications.info(`🩸 Dano bônus aplicado: ${roll.total}`);
    }
});
