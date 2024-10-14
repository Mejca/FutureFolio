import React, { createContext, useContext, useReducer, useCallback } from 'react';

const MindMapContext = createContext();

const initialState = {
  nodes: [],
  links: [],
  contextMenu: null,
  editingNode: null,
  scale: 1,
  pan: { x: 0, y: 0 },
  history: [],
  future: [],
};

function mindMapReducer(state, action) {
  switch (action.type) {
    case 'ADD_NODE':
      return {
        ...state,
        nodes: [...state.nodes, action.payload],
        history: [...state.history, { action: 'ADD_NODE', data: action.payload }],
        future: [],
      };
    case 'UPDATE_NODE':
      return {
        ...state,
        nodes: state.nodes.map(node =>
          node.id === action.payload.id ? { ...node, ...action.payload.updates } : node
        ),
        history: [...state.history, { action: 'UPDATE_NODE', data: action.payload }],
        future: [],
      };
    case 'DELETE_NODE':
      return {
        ...state,
        nodes: state.nodes.filter(node => node.id !== action.payload),
        links: state.links.filter(link => link.source !== action.payload && link.target !== action.payload),
        history: [...state.history, { action: 'DELETE_NODE', data: action.payload }],
        future: [],
      };
    case 'ADD_LINK':
      return {
        ...state,
        links: [...state.links, action.payload],
        history: [...state.history, { action: 'ADD_LINK', data: action.payload }],
        future: [],
      };
    case 'DELETE_LINK':
      return {
        ...state,
        links: state.links.filter(link => link.id !== action.payload),
        history: [...state.history, { action: 'DELETE_LINK', data: action.payload }],
        future: [],
      };
    case 'SET_CONTEXT_MENU':
      return { ...state, contextMenu: action.payload };
    case 'SET_EDITING_NODE':
      return { ...state, editingNode: action.payload };
    case 'UPDATE_SCALE':
      return { ...state, scale: action.payload };
    case 'UPDATE_PAN':
      return { ...state, pan: action.payload };
    case 'SET_NODES_AND_LINKS':
      return { ...state, nodes: action.payload.nodes, links: action.payload.links };
    case 'UNDO':
      if (state.history.length === 0) return state;
      const lastAction = state.history[state.history.length - 1];
      return {
        ...state,
        history: state.history.slice(0, -1),
        future: [lastAction, ...state.future],
        // Implement the reverse of the last action here
      };
    case 'REDO':
      if (state.future.length === 0) return state;
      const nextAction = state.future[0];
      return {
        ...state,
        history: [...state.history, nextAction],
        future: state.future.slice(1),
        // Implement the action here
      };
    default:
      return state;
  }
}

export function MindMapProvider({ children }) {
  const [state, dispatch] = useReducer(mindMapReducer, initialState);

  const addNode = useCallback((node) => {
    dispatch({ type: 'ADD_NODE', payload: node });
  }, []);

  const updateNode = useCallback((nodeId, updates) => {
    dispatch({ type: 'UPDATE_NODE', payload: { id: nodeId, updates } });
  }, []);

  const deleteNode = useCallback((nodeId) => {
    dispatch({ type: 'DELETE_NODE', payload: nodeId });
  }, []);

  const addLink = useCallback((link) => {
    dispatch({ type: 'ADD_LINK', payload: link });
  }, []);

  const deleteLink = useCallback((linkId) => {
    dispatch({ type: 'DELETE_LINK', payload: linkId });
  }, []);

  const setContextMenu = useCallback((contextMenuData) => {
    dispatch({ type: 'SET_CONTEXT_MENU', payload: contextMenuData });
  }, []);

  const setEditingNode = useCallback((nodeId) => {
    dispatch({ type: 'SET_EDITING_NODE', payload: nodeId });
  }, []);

  const updateScale = useCallback((scale) => {
    dispatch({ type: 'UPDATE_SCALE', payload: scale });
  }, []);

  const updatePan = useCallback((pan) => {
    dispatch({ type: 'UPDATE_PAN', payload: pan });
  }, []);

  const setNodesAndLinks = useCallback((nodes, links) => {
    dispatch({ type: 'SET_NODES_AND_LINKS', payload: { nodes, links } });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const value = {
    state,
    addNode,
    updateNode,
    deleteNode,
    addLink,
    deleteLink,
    setContextMenu,
    setEditingNode,
    updateScale,
    updatePan,
    setNodesAndLinks,
    undo,
    redo,
  };

  return <MindMapContext.Provider value={value}>{children}</MindMapContext.Provider>;
}

export function useMindMap() {
  const context = useContext(MindMapContext);
  if (!context) {
    throw new Error('useMindMap must be used within a MindMapProvider');
  }
  return context;
}
