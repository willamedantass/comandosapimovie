import { Schema, Document, model, Types } from 'mongoose';
import { IUser } from './user.model';

interface ILogin extends Document {
  uid: Types.ObjectId | IUser;
  user: string;
  password: string;
  dataCadastro: string;
  vencimento: string;
  isLive: boolean;
  isTrial: boolean;
  contato?: string;
  data_msg_vencimento?: string;
  isClubtv?: boolean;
  conexoes?: string;
  remoteIp?: string;
  dataRemote?: string;
  countForbiddenAccess?: number;
  vencLong?: string;
  isAdult?: boolean;
  status?: string;
}

const LoginSchema: Schema = new Schema({
  uid: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  user: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dataCadastro: { type: String, required: true },
  vencimento: { type: String, required: true },
  isLive: { type: Boolean, required: true },
  isTrial: { type: Boolean, required: true },
  contato: { type: String },
  data_msg_vencimento: { type: String },
  isClubtv: { type: Boolean },
  conexoes: { type: String },
  remoteIp: { type: String },
  dataRemote: { type: String },
  countForbiddenAccess: { type: Number },
  vencLong: { type: String },
  isAdult: { type: Boolean },
  status: { type: String },
}, {timestamps: true});

const LoginModel = model<ILogin>('logins',LoginSchema)
export {ILogin, LoginModel}
