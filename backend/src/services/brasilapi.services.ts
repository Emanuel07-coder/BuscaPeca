export interface CNPJData {
  cnpj: string;
  name: string;
  fantasyName: string;
  status: string;
  address: {
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zip: string;
  };
}

export class BrasilAPIService {
  static async verifyCNPJ(cnpj: string): Promise<CNPJData | null> {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    if (cleanCNPJ.length !== 14) {
      throw new Error('CNPJ inválido');
    }

    const BRASIL_API_URL = process.env.BRASIL_API_URL || 'https://brasilapi.com.br/api';

    try {
      const res = await fetch(`${BRASIL_API_URL}/cnpj/v1/${cleanCNPJ}`);
      
      if (!res.ok) {
        return null;
      }

      const data = await res.json();

      return {
        cnpj: data.cnpj,
        name: data.razao_social || '',
        fantasyName: data.nome_fantasia || '',
        status: data.descricao_situacao_cadastral || 'unknown',
        address: {
          street: data.logradouro || '',
          number: data.numero || '',
          complement: data.complemento || '',
          city: data.municipio || '',
          state: data.uf || '',
          zip: data.cep || '',
        },
      };
    } catch (err) {
      console.error('BrasilAPI Error:', err);
      return null;
    }
  }
}
