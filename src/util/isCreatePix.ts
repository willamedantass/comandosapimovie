import { updateUser } from "../data/userDB";
import { User } from "../type/user";

export const isCriarPix = (user: User) => {
  const agora = new Date();
  const dataPix = new Date(user.data_pix);
  if (dataPix.getDate() === agora.getDate()) {
    const limite = user.limite_pix;
    if (limite < 5) {
      user.limite_pix = limite + 1;
      updateUser(user);
      return true;
    } else {
      return false;
    }
  } else {
    user.limite_pix = user.limite_pix + 1;
    user.data_pix = agora.toISOString();
    updateUser(user);
    return true;
  }
}