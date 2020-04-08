export interface IDungeonsStats {
  squamas: number;
  crowns: number;
  experience: number;
  helmet: IDungeonItem;
  chestplate: IDungeonItem;
  leggings: IDungeonItem;
  boots: IDungeonItem;
  sword: IDungeonItem;
  bow: IDungeonItem;
}

export interface IDungeonEnchantment {
  enchantment: string;
  level: number;
}

export interface IDungeonItem {
  material: number;
  pe: IDungeonEnchantment[];
}
