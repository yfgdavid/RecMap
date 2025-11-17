let loadingCallbacks: Array<{ setLoading?: (loading: boolean) => void; setLoadingMessage?: (message: string) => void }> = [];

// Função para atualizar callbacks
export const registerLoadingCallbacks = (callbacks: typeof loadingCallbacks) => {
  loadingCallbacks = callbacks;
};

const updateLoading = (isLoading: boolean, message = 'Carregando...') => {
  loadingCallbacks.forEach(cb => {
    if (cb.setLoading) cb.setLoading(isLoading);
    if (cb.setLoadingMessage) cb.setLoadingMessage(message);
  });
};

// Wrapper para fetch com suporte a loading
export async function fetchWithLoading(
  url: string,
  options: RequestInit = {},
  loadingMessage = 'Carregando...'
): Promise<Response> {
  updateLoading(true, loadingMessage);
  
  // Adiciona timeout de 30 segundos
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    updateLoading(false);
    
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    updateLoading(false);
    
    if (error.name === 'AbortError') {
      throw new Error('Tempo de espera esgotado. Verifique sua conexão.');
    }
    
    if (error.message === 'Failed to fetch') {
      throw new Error('Erro de conexão. Verifique sua internet.');
    }
    
    throw error;
  }
}

