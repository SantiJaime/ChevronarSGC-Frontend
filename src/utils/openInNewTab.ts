// Abre la URL en una pestaña nueva una vez que el servidor respondió. Si la
// respuesta tardó varios segundos, el navegador puede bloquearla (ya no cuenta
// como originada por el clic): por eso los toasts de éxito incluyen el enlace.
export const openInNewTab = (url: string): boolean => {
  const tab = window.open(url, "_blank");
  if (!tab) return false;
  // La página de destino no debe poder acceder a esta pestaña
  tab.opener = null;
  return true;
};
