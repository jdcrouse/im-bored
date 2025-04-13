export const COLORS = {
  background: '#222222',
  modalBackground: '#1e1e1e',
  modalOverlay: 'rgba(0, 0, 0, 0.7)',
  text: '#ffffff',
  textSecondary: '#999999',
  border: '#2a2a2a',
  button: '#ff4444',
  icon: '#ffffff',
} as const;

export type Colors = typeof COLORS; 