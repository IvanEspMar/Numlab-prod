import type { SistemaNumerico } from '@/hooks/use-matriz-editable'

export const ejemploSistema: SistemaNumerico = {
  A: [[10, -1, 2], [-1, 11, -1], [2, -1, 10]],
  b: [6, 22, -10],
}

export const ejemploCrout: SistemaNumerico = {
  A: [[2, 4, 2], [4, 10, 6], [2, 6, 9]],
  b: [16, 38, 41],
}
