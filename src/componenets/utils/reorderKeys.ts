import {X} from "lucide-svelte";


export function reorderKeys(keyOrder, model) {
    const orderedModel = { documentID: model.documentID };
    keyOrder.forEach((key) => {
      if (model[key] !== undefined) {
        orderedModel[key] = model[key];
      }
    });
    return orderedModel;
  }