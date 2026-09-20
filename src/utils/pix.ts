import QRCode from 'qrcode';

export interface PixConfig {
  chavePix: string;
  nomeRecebedor: string;
  cidade: string;
  valor: number;
  txid?: string;
}

export const DEFAULT_PIX_CONFIG: PixConfig = {
  chavePix: '02598018796', // CPF do proprietário
  nomeRecebedor: 'FERNANDO BORGES',
  cidade: 'SOROCABA',
  valor: 9.99,
  txid: 'SOROCABA10'
};

function formatField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

/**
 * Calculates CRC16-CCITT (0xFFFF initial, 0x1021 polynomial)
 * as mandated by Banco Central do Brasil PIX standard.
 */
export function calculateCRC16(str: string): string {
  let crc = 0xFFFF;
  for (let c = 0; c < str.length; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Generates the official Pix Copia e Cola EMV string
 */
export function generatePixPayload(config: Partial<PixConfig> = {}): string {
  const finalConfig: PixConfig = {
    ...DEFAULT_PIX_CONFIG,
    ...config
  };

  const cleanChave = finalConfig.chavePix.replace(/\D/g, '');
  const cleanNome = finalConfig.nomeRecebedor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .slice(0, 25);
  const cleanCidade = finalConfig.cidade
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .slice(0, 15);
  const formattedValor = finalConfig.valor.toFixed(2);
  const txid = (finalConfig.txid || 'OP10').replace(/[^A-Za-z0-9]/g, '').slice(0, 25);

  // Field 26: Merchant Account Information
  const gui = formatField('00', 'br.gov.bcb.pix');
  const key = formatField('01', cleanChave);
  const merchantAccountInfo = formatField('26', `${gui}${key}`);

  // Field 62: Additional Data Field Template
  const refLabel = formatField('05', txid || '***');
  const additionalData = formatField('62', refLabel);

  const rawPayloadWithoutCRC =
    formatField('00', '01') +
    merchantAccountInfo +
    formatField('52', '0000') +
    formatField('53', '986') +
    formatField('54', formattedValor) +
    formatField('58', 'BR') +
    formatField('59', cleanNome) +
    formatField('60', cleanCidade) +
    additionalData +
    '6304';

  const crc = calculateCRC16(rawPayloadWithoutCRC);
  return `${rawPayloadWithoutCRC}${crc}`;
}

/**
 * Generates Data URL for QR Code image
 */
export async function generatePixQRCodeDataURL(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    });
  } catch (err) {
    console.error('Error generating Pix QR Code:', err);
    // Fallback using public high-availability QR API
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payload)}`;
  }
}
