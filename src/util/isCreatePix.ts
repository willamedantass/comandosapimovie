import { userUpdate } from "../data/user.service";
import { IUser } from "../type/user.model";

export const isCriarPix = async (user: IUser): Promise<boolean> => {
  try {
    const agora = new Date();
    const dataPix = new Date(user.data_pix);
    
    if (dataPix.getDate() === agora.getDate()) {
      if (user.limite_pix < 5) {
        user.limite_pix++;
        await userUpdate(user);
        return true;
      } else {
        return false;
      }
    } else {
      user.limite_pix = 1;
      user.data_pix = agora.toISOString();
      await userUpdate(user);
      return true;
    }
  } catch (error) {
    console.error('Erro ao processar isCriarPix:', error);
    return false;
  }
}