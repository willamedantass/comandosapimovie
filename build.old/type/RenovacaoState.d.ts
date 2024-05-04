export interface RenovacaoState {
    stage: RenovacaoStageEnum;
    selectedLogin: null | number;
    confirmed: boolean;
}
export declare enum RenovacaoStageEnum {
    selecionar = 0,
    confirmar = 1,
    renovar = 2
}
