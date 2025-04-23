const itemName = "Teste";
const healingDie = "d12";

const actor = canvas.tokens.controlled[0]?.actor;
if (!actor) return ui.notifications.warn("Selecione o token do personagem.");

const item = actor.items.getName(itemName);
if (!item) return ui.notifications.warn(`Item "${itemName}" não encontrado na ficha.`);

const usesLeft = item.system.uses?.value ?? 0;
if (usesLeft <= 0) return ui.notifications.warn(`${itemName} não possui usos restantes.`);

const chosenUses = await new Promise((resolve) => {
  new Dialog({
    title: `Usar ${itemName}`,
    content: `<p>Você possui <strong>${usesLeft}</strong> uso(s). Quantos deseja usar?</p>
              <input type="number" id="uses" name="uses" value="1" min="1" max="${usesLeft}" style="width: 100%">`,
    buttons: {
      ok: {
        label: "Usar",
        callback: (html) => {
          const val = parseInt(html.find("#uses").val());
          resolve(isNaN(val) ? 0 : val);
        }
      },
      cancel: {
        label: "Cancelar",
        callback: () => resolve(0)
      }
    },
    default: "ok"
  }).render(true);
});

if (chosenUses < 1) return;

const roll = await new Roll(`${chosenUses}${healingDie}`).roll({ async: true });
await roll.toMessage({
  speaker: ChatMessage.getSpeaker({ actor }),
  flavor: `${itemName} - Cura ${chosenUses}${healingDie}`
});

await actor.applyHealing(roll.total);

await item.update({ "system.uses.value": usesLeft - chosenUses });
