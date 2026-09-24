// Los navegadores bloquean las pestañas que se abren después de esperar una
// respuesta del servidor (ya no cuentan como originadas por el clic). Por eso la
// pestaña se abre en el momento del clic y se le carga la URL cuando llega.
export interface PendingTab {
  navigate: (url: string) => void;
  close: () => void;
}

export const openPendingTab = (): PendingTab => {
  const tab = window.open("", "_blank");

  if (tab) {
    tab.document.title = "Generando documento...";
    const message = tab.document.createElement("p");
    message.textContent = "Generando documento, esperá unos segundos...";
    message.style.fontFamily = "sans-serif";
    message.style.padding = "2rem";
    tab.document.body.appendChild(message);
  }

  return {
    navigate: (url: string) => {
      if (tab && !tab.closed) {
        // La página de destino no debe poder acceder a esta pestaña
        tab.opener = null;
        tab.location.href = url;
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    },
    close: () => {
      if (tab && !tab.closed) tab.close();
    },
  };
};
