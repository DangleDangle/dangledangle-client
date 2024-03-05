export const shelterKey = {
  all: ['shelter'] as const,
  animalLists: () => [...shelterKey.all, 'observation-animal-list'] as const,
  animalList: (shelterId: number) =>
    [...shelterKey.animalLists(), shelterId] as const,
  animal: (id: number) => [...shelterKey.animalLists(), 'animal', id] as const,
  info: () => [...shelterKey.all, 'info'] as const,
  image: () => [...shelterKey.info(), 'image'] as const,
  homeInfo: () => [...shelterKey.info(), 'home'] as const
};
