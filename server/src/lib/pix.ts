/**
 * Gerador de PIX BR Code (cópia-e-cola) dinâmico.
 * Segue o padrão BACEN EMV/QRCode para PIX.
 *
 * Estrutura:
 *   ID 00 (Payload Format Indicator) = "01"
 *   ID 26 (Merchant Account Information) - GUI 0BR.GOV.BCB.PIX + chave + txid
 *   ID 52 (Merchant Category Code) = "0000"
 *   ID 53 (Transaction Currency) = "986" (BRL)
 *   ID 54 (Transaction Amount) = valor
 *   ID 58 (Country Code) = "BR"
 *   ID 59 (Merchant Name)
 *   ID 60 (Merchant City)
 *   ID 62 (Additional Data Field Template) - txid
 *   ID 63 (CRC16-CCITT)
 */

const ID_PAYLOAD_FORMAT_INDICATOR = '00';
const ID_MERCHANT_ACCOUNT_INFO = '26';
const ID_MERCHANT_CATEGORY_CODE = '52';
const ID_TRANSACTION_CURRENCY = '53';
const ID_TRANSACTION_AMOUNT = '54';
const ID_COUNTRY_CODE = '58';
const ID_MERCHANT_NAME = '59';
const ID_MERCHANT_CITY = '60';
const ID_ADDITIONAL_DATA = '62';
const ID_CRC16 = '63';

const GUI = 'br.gov.bcb.pix';

/** TLV helper: monta "ID(len)(value)" */
function tlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

/** CRC16-CCITT (polinômio 0x1021, init 0xFFFF) conforme spec PIX */
export function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) crc = ((crc << 1) ^ 0x1021) & 0xffff;
      else crc = (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export interface PixInput {
  chave: string;
  tipoChave: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  valor: number;
  txid: string;
  merchantName: string;
  merchantCity: string;
  descricao?: string;
}

/**
 * Gera o BR Code PIX dinâmico (string copia-e-cola).
 * Valor deve ser > 0 e txid entre 1-25 chars alfanuméricos.
 */
export function generatePixCode(input: PixInput): string {
  const { chave, tipoChave, valor, txid, merchantName, merchantCity, descricao } = input;

  if (valor <= 0) throw new Error('Valor deve ser positivo');
  if (!/^[a-zA-Z0-9]{1,25}$/.test(txid)) throw new Error('txid inválido (1-25 alfanum)');

  // Merchant Account Information (ID 26)
  //   GUI (ID 00) + chave (ID 01) + descricao opcional (ID 02)
  const merchantInfoInner =
    tlv('00', GUI) +
    tlv('01', chave) +
    (descricao ? tlv('02', descricao.slice(0, 72)) : '');
  const merchantInfo = tlv(ID_MERCHANT_ACCOUNT_INFO, merchantInfoInner);

  // Additional Data Field Template (ID 62) - só txid (ID 05)
  const additionalData = tlv(ID_ADDITIONAL_DATA, tlv('05', txid));

  // Monta tudo sem o CRC
  const payload =
    tlv(ID_PAYLOAD_FORMAT_INDICATOR, '01') +
    merchantInfo +
    tlv(ID_MERCHANT_CATEGORY_CODE, '0000') +
    tlv(ID_TRANSACTION_CURRENCY, '986') +
    tlv(ID_TRANSACTION_AMOUNT, valor.toFixed(2)) +
    tlv(ID_COUNTRY_CODE, 'BR') +
    tlv(ID_MERCHANT_NAME, merchantName.slice(0, 25)) +
    tlv(ID_MERCHANT_CITY, merchantCity.slice(0, 15)) +
    additionalData +
    '6304'; // ID 63 + length 04 (reservado pro CRC)

  const crc = crc16(payload);
  return payload + crc;
}

/**
 * Valida um BR Code PIX (verifica o CRC).
 */
export function validatePixCode(code: string): boolean {
  if (code.length < 16) return false;
  const body = code.slice(0, -4);
  const crc = code.slice(-4);
  return crc16(body + '6304') === crc;
}
