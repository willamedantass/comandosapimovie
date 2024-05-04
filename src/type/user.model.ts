import { Schema, Document, model } from 'mongoose';

interface IUser extends Document {
  nome: string;
  data_cadastro: string;
  remoteJid: string;
  pgtos_id: number[];
  isCadastrando: boolean;
  acesso: 'usuario' | 'revenda' | 'adm';
  credito: number;
  valor?: string;
  data_teste?: string;
  data_pix: string;
  limite_pix: number;
  vencimento?: string;
  logins?: string[];
}

const UserSchema: Schema = new Schema({
  nome: { type: String },
  data_cadastro: { type: String},
  remoteJid: { type: String, required: true, unique: true },
  pgtos_id: { type: [Number]},
  isCadastrando: { type: Boolean, required: true },
  acesso: { type: String, enum: ['usuario', 'revenda', 'adm'], required: true },
  credito: { type: Number, required: true },
  valor: { type: String },
  data_teste: { type: String },
  data_pix: { type: String, required: true },
  limite_pix: { type: Number, required: true },
  vencimento: { type: String },
  logins: { type: [String] }
}, { timestamps: true });

const UserModel = model<IUser>('users', UserSchema);

export { IUser, UserModel };
