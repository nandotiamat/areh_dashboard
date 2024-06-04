import {X} from "lucide-svelte";


export function reorderKeys(keyOrder, model) {
    const orderedModel = { documentID: model.documentID, name: "", category: "", subtitle: "", bottom_text: "", imageURL: ""};
    keyOrder.forEach((key) => {
      if (model[key] !== undefined) {
        orderedModel[key] = model[key];
      }
    });
    return orderedModel;
  }