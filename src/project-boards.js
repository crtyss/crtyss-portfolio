// Original presentation boards, matched by project ID so existing managed content stays intact.
const board = (file, label, labelEn) => ({ href: `/assets/portfolio/boards/${file}.jpg`, label, labelEn })

export const projectBoards = {
  furniture: [
    board('furniture-landscape', '展板预览 · 横版', 'Presentation board · Landscape'),
    board('furniture-portrait', '展板预览 · 竖版', 'Presentation board · Portrait'),
  ],
  air: [board('air', '展板预览', 'Presentation board')],
  micro: [board('micro', '展板预览', 'Presentation board')],
  rope: [board('rope', '展板预览', 'Presentation board')],
  toothbrush: [board('toothbrush', '展板预览', 'Presentation board')],
  culture: [
    board('culture-main', '展板预览 · 主展板', 'Presentation board · Overview'),
    board('culture-form', '展板预览 · 形', 'Presentation board · Form'),
    board('culture-meaning', '展板预览 · 意', 'Presentation board · Meaning'),
  ],
  gater: [board('gater', '展板预览', 'Presentation board')],
}
