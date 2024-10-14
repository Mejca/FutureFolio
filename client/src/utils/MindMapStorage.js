export const saveMindMap = (name, nodes, links) => {
  const data = JSON.stringify({ nodes, links });
  localStorage.setItem(`mindmap_${name}`, data);
};

export const loadMindMap = (name) => {
  const data = localStorage.getItem(`mindmap_${name}`);
  return data ? JSON.parse(data) : null;
};

export const listMindMaps = () => {
  return Object.keys(localStorage)
    .filter(key => key.startsWith('mindmap_'))
    .map(key => key.replace('mindmap_', ''));
};
