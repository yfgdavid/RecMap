/**
 * Converte uma URL de imagem para URL completa
 * Se já for uma URL completa (http/https), retorna como está
 * Se for um caminho relativo, concatena com a URL base da API
 * 
 * SOLUÇÃO TEMPORÁRIA: Tenta adicionar extensão se não houver
 * (O ideal é corrigir no backend para salvar com extensão)
 */
export function getImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;
  
  let finalPath = imagePath;
  
  // Se já for uma URL completa
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('//')) {
    finalPath = imagePath.startsWith('//') ? `https:${imagePath}` : imagePath;
    
    // SOLUÇÃO TEMPORÁRIA: Se não tiver extensão, tentar adicionar
    // Isso é um workaround - o ideal é corrigir no backend
    if (!finalPath.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)) {
      // Tentar extensões comuns (jpeg é mais comum)
      const extensions = ['.jpg', '.jpeg', '.png'];
      // Por enquanto, não adicionamos automaticamente para evitar URLs inválidas
      // O backend precisa ser corrigido para salvar com extensão
    }
    
    return finalPath;
  }
  
  // Concatena com a URL base da API
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333';
  const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  
  // Se o caminho já começa com /, não precisa adicionar outro
  if (imagePath.startsWith('/')) {
    return `${baseUrl}${imagePath}`;
  }
  
  // Caso contrário, adiciona a barra
  return `${baseUrl}/${imagePath}`;
}

