/**
 * Gera uma URL de thumbnail a partir de uma URL de imagem original
 * 
 * Opções:
 * 1. Se o backend suportar thumbnails, pode retornar uma URL modificada
 * 2. Se não, retorna a URL original (o CSS fará o redimensionamento)
 * 
 * Para implementação futura no backend:
 * - Criar endpoint que recebe a URL da imagem e retorna thumbnail
 * - Ou modificar a URL para adicionar parâmetros de query (ex: ?thumbnail=true)
 */
export function getThumbnailUrl(originalUrl: string | null | undefined): string | null {
  if (!originalUrl) return null;

  // Por enquanto, retorna a URL original
  // O componente MapMarkerPopup fará o redimensionamento via CSS
  return originalUrl;

  // Exemplo de implementação futura com backend:
  // if (originalUrl.includes('?')) {
  //   return `${originalUrl}&thumbnail=true&size=80`;
  // }
  // return `${originalUrl}?thumbnail=true&size=80`;
}

/**
 * Gera uma thumbnail usando Canvas (client-side)
 * Útil quando não há suporte no backend
 */
export async function generateThumbnail(
  imageUrl: string,
  maxWidth: number = 80,
  maxHeight: number = 80,
  quality: number = 0.7
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Não foi possível criar contexto do canvas'));
          return;
        }

        // Calcular dimensões mantendo proporção
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Converter para base64 com qualidade reduzida
        const thumbnailDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(thumbnailDataUrl);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Erro ao carregar imagem para gerar thumbnail'));
    };

    img.src = imageUrl;
  });
}

