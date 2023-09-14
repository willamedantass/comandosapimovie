export interface RenovacaoState {
    stage: RenovacaoStageEnum;
    selectedLogin: null | number;
    confirmed: boolean;
}

export enum RenovacaoStageEnum {
    selecionar,
    confirmar,
    renovar,
}