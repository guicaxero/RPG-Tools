let rage = async function () {
    const target = canvas.tokens.controlled[0]?.actor || game.user.character;

    if (!target) {
        ui.notifications.warn("Nenhum token selecionado ou personagem ativo.");
        return;
    }

    const effectBear = "Fúria do Urso";
    const effectNormal = "Fúria";
    const iconBear = "icons/creatures/abilities/cougar-roar-rush-orange.webp"; // Ícone para Fúria do Urso
    const iconNormal = "icons/skills/social/intimidation-impressing.webp"; // Ícone para Fúria

    const alwaysKeepResistance = ["cold"]; // Resistências que sempre devem ser mantidas

    // Função para adicionar um efeito com ícone
    async function applyEffect(effectName, resistances, removeResistances, iconPath) {
        let currentResistances = target.system.traits.dr.value || [];
        if (!Array.isArray(currentResistances)) {
            currentResistances = [];
        }

        // Mantém resistências fixas, remove específicas e adiciona as novas
        let newResistances = currentResistances
            .filter(r => !removeResistances.includes(r) || alwaysKeepResistance.includes(r))
            .concat(resistances.filter(r => !currentResistances.includes(r)));

        await target.update({
            "system.traits.dr.value": newResistances
        });

        let existingEffect = target.effects.find(e => e.label === effectName);
        if (existingEffect) {
            await target.deleteEmbeddedDocuments("ActiveEffect", [existingEffect.id]);
        }

        let effectData = {
            label: effectName,
            icon: iconPath,
            changes: [],
            origin: target.uuid,
            duration: { rounds: 10 },
            flags: { core: { statusId: effectName } }
        };

        await target.createEmbeddedDocuments("ActiveEffect", [effectData]);

        ChatMessage.create({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor: target }),
            content: `<em><strong>${target.name}</strong> ativou ${effectName}!</em>`
        });
    }

    // Função para remover todos os efeitos de fúria
    async function removeEffects() {
        const effectsToRemove = [effectBear, effectNormal];
        const currentEffects = target.effects.filter(e => effectsToRemove.includes(e.label));

        if (currentEffects.length > 0) {
            const effectIds = currentEffects.map(e => e.id);
            await target.deleteEmbeddedDocuments("ActiveEffect", effectIds);
        }

        // Garante que a resistência "cold" seja mantida
        await target.update({
            "system.traits.dr.value": alwaysKeepResistance
        });

        // Mensagem única no chat
        await ChatMessage.create({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor: target }),
            content: `<em><strong>${target.name}</strong> desativou a fúria!</em>`
        });
    }

    new Dialog({
        title: "Escolha sua Fúria",
        content: `<p>Selecione o tipo de fúria ou remova o efeito:</p>`,
        buttons: {
            bearRage: {
                label: "Fúria do Urso",
                callback: () => applyEffect(
                    effectBear,
                    ["acid", "bludgeoning", "fire", "lightning", "piercing", "poison", "slashing", "thunder", "cold"],
                    [],
                    iconBear
                )
            },
            normalRage: {
                label: "Fúria",
                callback: () => applyEffect(
                    effectNormal,
                    ["slashing", "piercing", "bludgeoning", "cold"],
                    [],
                    iconNormal
                )
            },
            removeRage: {
                label: "Remover Fúria",
                callback: () => removeEffects()
            }
        },
        default: "removeRage"
    }).render(true);
};

// Executar a função
rage();