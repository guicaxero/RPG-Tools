const actor = canvas.tokens.controlled[0]?.actor;
if (!actor) {
  ui.notifications.warn("Selecione seu token primeiro!");
  return;
}

const activeEffects = actor.effects.map(e => e.label);
const fireBladeActive = activeEffects.includes("Lâmina Língua de Fogo");

new Dialog({
  title: "🎇 Escolha de Ataques",
  content: `
    <style>
        .teste {
            background-color: #;
        }
    </style>

    <form id="buffForm">
      <fieldset class="teste">
        <legend>Lâmina Língua de Fogo</legend>
        <label>
          <input type="checkbox" id="fireBlade" ${fireBladeActive ? "checked" : ""}/> Ativar (2d6 fogo, luz 12m/12m)
        </label>
      </fieldset>
      <fieldset>
        <legend>Escolha um Truque</legend>
        <label><input type="radio" name="cantrip" id="boomingBlade"/> Lâmina Estrondante (+2d8 trovejante no próximo ataque)</label><br>
        <label><input type="radio" name="cantrip" id="flameBlade"/> Lâmina Ígnea (+2d8 ígneo no próximo ataque)</label><br>
        <label><input type="radio" name="cantrip" id="trueStrike"/> True Strike (+2d6 radiante, TODO dano vira radiante)</label>
      </fieldset>
    </form>
  `,
  buttons: {
    confirm: {
      label: "✅ Apply",
      callback: async (html) => {
        const fireBladeChecked = html.find("#fireBlade")[0].checked;
        const selectedCantrip = html.find("input[name='cantrip']:checked").attr("id");

        if (fireBladeChecked !== fireBladeActive) {
          if (fireBladeChecked) {
            await actor.createEmbeddedDocuments("ActiveEffect", [{
              label: "Lâmina Língua de Fogo",
              icon: "icons/skills/ranged/bullet-sparks-yellow.webp",
              changes: [{ key: "system.bonuses.mwak.damage", mode: 2, value: "+2d6[fire]" }],
              duration: { seconds: null }
            }]);

            let token = canvas.tokens.controlled[0];
            if (token) {
              await token.document.update({ "light.bright": 12, "light.dim": 24, "light.color": "#ff9900" });
            }
            ui.notifications.info(`🔥 Lâmina Língua de Fogo ativada!`);

          } else {
            let effect = actor.effects.find(e => e.label === "Lâmina Língua de Fogo");
            if (effect) await effect.delete();

            let token = canvas.tokens.controlled[0];
            if (token) {
              await token.document.update({ "light.bright": 0, "light.dim": 0 });
            }

            ui.notifications.info(`🔥 Lâmina Língua de Fogo Desativada!`);
          }
        }

        const buffsMap = {
            boomingBlade: { label: "Lâmina Estrondante", dice: "2d8", type: "thunder" },
            flameBlade: { label: "Lâmina Ígnea", dice: "2d8", type: "fire" },
            trueStrike: { label: "True Strike", dice: "2d6", type: "radiant" }
        };

        let buff = buffsMap[selectedCantrip];

        if (buff) {
          await actor.createEmbeddedDocuments("ActiveEffect", [{
            label: buff.label,
            icon: "icons/magic/light/swords-light-glowing-white.webp",
            changes: [
              { key: "system.bonuses.mwak.damage", mode: 2, value: `+${buff.dice}[${buff.type}]` }
            ],
            duration: { turns: 1 },
          }]);

          ui.notifications.info(`Truque ${buff.label} ativo!`);

        }

        Hooks.once("midi-qol.RollComplete", async (workflow) => {
          if (workflow.actor.id === actor.id) {
            const effectsToRemove = actor.effects.filter(e => e.label === buff.label);
            for (let effect of effectsToRemove) {
              await effect.delete();
            }

          }
        });

      }
    },
    cancel: { label: "❌ Cancelar" }
  }
}).render(true);
