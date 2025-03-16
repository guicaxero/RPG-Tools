const token = canvas.tokens.controlled[0];
if (!token) {
    ui.notifications.warn("Nenhum token selecionado!");
    return;
}

const actor = token.actor;
const effectName = "Fogo da Língua";

// Verifica se o efeito já está ativo corretamente
let effect = actor.effects.find(e => e.name === effectName);

if (effect) {
    // Remove o efeito e desativa a iluminação
    await effect.delete();
    await token.document.update({
        "light.dim": 0,
        "light.bright": 0,
        "light.color": null,
        "light.alpha": 0,
        "light.animation.type": ""
    });

    ui.notifications.info("🔥 Língua de Fogo desativada.");
} else {
    // Cria o efeito de dano adicional
    const changes = [
        {
            key: "system.bonuses.mwak.damage",
            mode: CONST.ACTIVE_EFFECT_MODES.ADD,
            value: "2d6[fire]",
            priority: 20
        }
    ];

    await actor.createEmbeddedDocuments("ActiveEffect", [{
        name: effectName,
        icon: "icons/weapons/swords/sword-flaming-red.webp",
        changes: changes,
        origin: "Língua de Fogo",
        disabled: false
    }]);

    // Pequeno atraso para evitar conflitos com módulos
    setTimeout(async () => {
        await token.document.update({
            "light.dim": 6, // Alcance da luz
            "light.bright": 3, // Centro mais forte da luz
            "light.color": "#ff6600", // Cor de fogo
            "light.alpha": 0.5, // Transparência da luz
            "light.animation": { type: "torch", speed: 2, intensity: 5 } // Efeito oscilante
        });
    }, 250); // Atraso de 250ms para evitar conflitos

    ui.notifications.info("🔥 Língua de Fogo ativada! Seu token agora brilha como uma espada flamejante.");
}
