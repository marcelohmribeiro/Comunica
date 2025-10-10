export const STATUS_LABEL = {
  aberta: "Aberta",
  em_andamento: "Em andamento",
  resolvida: "Resolvida",
};

export const STATUS_COLOR = {
  aberta: "#EF4444",
  em_andamento: "#F59E0B",
  resolvida: "#10B981",
};

export const STATUS_PROGRESS = {
  aberta: 25,
  em_andamento: 70,
  resolvida: 100,
};

export const DEFAULT_REGION = {
  latitude: -3.7617664,
  longitude: -38.4958464,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export const CATEGORIES = [
  { value: "buraco_rua", label: "Buraco na Rua" },
  { value: "iluminacao_publica", label: "Iluminação Pública" },
  { value: "lixo_acumulado", label: "Lixo Acumulado" },
  { value: "rede_agua", label: "Rede de Água" },
  { value: "poste_danificado", label: "Poste Danificado" },
  { value: "arvore_caida", label: "Árvore Caída" },
  { value: "calcada_danificada", label: "Calçada Danificada" },
  { value: "barulho", label: "Barulho" },
  { value: "vizinhança", label: "Vizinhança" },
  { value: "limpeza", label: "Limpeza" },
  { value: "segurança", label: "Segurança" },
  { value: "outros", label: "Outro" },
];
