export const positions = {
    PG: 1,
    SG: 2,
    SF: 4,
    PF: 8,
    C: 16,
    G: 32,
    F: 64,
} as const;

export const slotToPosition = [
    positions.PG,
    positions.SG,
    positions.SF,
    positions.PF,
    positions.C,
    positions.G,
    positions.F,
] as const;

export interface Player {
    id: number;
    fullName: string;
    proTeam: number;
    positions: number;
}