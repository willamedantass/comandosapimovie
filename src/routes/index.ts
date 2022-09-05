import { urlPlayerController } from "../controller/urlPlayerController";
import { notificacaopix } from "../controller/notificacaoController";
import { listaController } from "../controller/listaController";
import { urlController } from "../controller/urlController";
import { PlayerApi } from "../controller/PlayerApi";
import { xmltv } from "../controller/xmltv";
import { Router } from "express";

const router = Router();
router.get('/lista/:provedor/:login', listaController);
router.get('/url/:provedor/:media/:login/:video', urlController);
router.get('/:media/:user/:password/:video', urlPlayerController);
router.post('/notificacoes', notificacaopix);
router.get('/player_api.php', PlayerApi)
router.get('/xmltv.php', xmltv)

export default router;