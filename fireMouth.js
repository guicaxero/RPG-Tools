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
            #buffForm {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(8px);
                color: #1f1c1a;
                font-family: "Poppins", sans-serif;
            }

            fieldset {
                background: linear-gradient(135deg, #D5E7F7, #ECF7FF);
                border-radius: 12px;
                padding: 15px;
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
                color: #333;
                font-size: 1rem;
                font-weight: 600;
                margin-bottom: 12px;
                border: 1px solid rgba(255, 255, 255, 0.5);
            }

            legend {
                font-size: 1.4rem;
                font-weight: bold;
                color: #2c3e50;
                text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
            }

            .teste {
                background: linear-gradient(135deg, #ff4500, #ff6b00, #ff9f00);
                color: #fff;
                border: 2px solid #ff6b81;
                box-shadow: 0 0 10px rgba(255, 69, 0, 0.7);
            }
                
           .teste legend {
                font-size: 1.4rem; /* Mantém um tamanho agradável */
                font-weight: bold;
                color: #fff; /* Mantém um bom contraste */
                padding: 5px 10px;
                border-radius: 5px;
                background: linear-gradient(135deg, #ff784f, #ffae42);
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            }

            input[type="checkbox"],
            input[type="radio"] {
                appearance: none;
                width: 18px;
                height: 18px;
                border: 2px solid #6ba2d4;
                border-radius: 50%;
                display: inline-block;
                position: relative;
                cursor: pointer;
                background-color: white;
                transition: all 0.2s ease-in-out;
            }

            input[type="radio"]:checked::before,
            input[type="checkbox"]:checked::before {
                content: "";
                width: 10px;
                height: 10px;
                background-color: #6ba2d4;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .dialog-buttons button {
                background: linear-gradient(135deg, #6ba2d4, #4b89c9);
                color: #fff;
                font-weight: bold;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
            }

            .dialog-buttons button:hover {
                background: linear-gradient(135deg, #4b89c9, #386ea3);
                transform: scale(1.05);
            }

            .dialog-buttons button:focus {
                outline: none;
            }

            .dialog-buttons {
                display: flex;
                justify-content: space-between;
                margin-top: 15px;
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
          <label><input type="radio" name="cantrip" id="boomingBlade"/> Lâmina Estrondante</label><br>
          <label><input type="radio" name="cantrip" id="flameBlade"/> Lâmina Ígnea</label><br>
          <label><input type="radio" name="cantrip" id="trueStrike"/> True Strike</label>
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
                    await token.document.update({ 
                        "light.bright": 12,
                        "light.dim": 24,
                        "light.color": "#ff9900", 
                        "light.alpha": 0.5, 
                        "light.animation": { 
                            type: "pulse",
                            speed: 5,
                            intensity: 15
                        }
                    });
                }
                ui.notifications.info(`🔥 Lâmina Língua de Fogo ativada!`);
    
            } else {
                let effect = actor.effects.find(e => e.label === "Lâmina Língua de Fogo");
                if (effect) await effect.delete();
    
                let token = canvas.tokens.controlled[0];
                if (token) {
                    await token.document.update({ 
                        "light.bright": 0, 
                        "light.dim": 0,
                        "light.animation": null
                    });
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
  