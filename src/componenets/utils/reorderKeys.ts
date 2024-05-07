

export function reorderKeys(keyOrder, model) {
    const orderedModel = { documentID: model.documentID };
    keyOrder.forEach((key) => {
      if (model[key]) {
        orderedModel[key] = model[key];
      }
    });
    return orderedModel;
  }