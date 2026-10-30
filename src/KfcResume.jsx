import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ArrowUpRight, Star } from 'lucide-react'
import './KfcResume.css'

export default function KfcResume({ onClose, origin }) {
  const ref = useRef(null)
  const [hired, setHired] = useState(false)
  useEffect(() => {
    const dialog = ref.current, focus = document.activeElement
    dialog.showModal()
    document.body.classList.add('kfc-resume-open')
    return () => {
      dialog.close()
      document.body.classList.remove('kfc-resume-open')
      if (focus?.isConnected) focus.focus({ preventScroll: true })
    }
  }, [])
  return createPortal(<dialog ref={ref} className="kfc-resume" style={{ '--kfc-origin-x': `${origin?.x ?? window.innerWidth / 2}px`, '--kfc-origin-y': `${origin?.y ?? window.innerHeight / 2}px` }} aria-labelledby="kfc-resume-title" onCancel={event => { event.preventDefault(); onClose() }} onClick={event => { if (event.target === ref.current) onClose() }}>
    <div className="kfc-icon-arrival" aria-hidden="true">
      <div className="kfc-arrival-ring" />
      <div className="kfc-arrival-ring kfc-arrival-ring-second" />
      <img className="kfc-arrival-colonel" src="/assets/software/kfc-colonel.png" alt="" />
      <span className="kfc-arrival-caption">隐藏大佬 · 隆重登场</span>
    </div>
    <div className="kfc-burst" aria-hidden="true" />
    <div className="kfc-flying-word kfc-flying-one" aria-hidden="true">THURSDAY!</div>
    <div className="kfc-flying-word kfc-flying-two" aria-hidden="true">V ME 50</div>
    <article className="kfc-sheet">
      <button className="kfc-close" aria-label="关闭隐藏简历" onClick={onClose} autoFocus><X size={22} /></button>
      <header className="kfc-resume-header">
        <div className="kfc-resume-masthead"><img src="/assets/software/kfc-colonel.png" alt="KFC" /><span>SECRET MENU<br />PERSONAL RÉSUMÉ / NO. 0050</span></div>
        <div className="kfc-sticker"><Star size={18} fill="currentColor" /><span>野生人才<br />限时掉落</span></div>
        <p className="kfc-name">CRTYSS · 又名 大卫·戴</p>
        <h1 id="kfc-resume-title">个人 KFC<br /><em>疯狂点餐专家</em></h1>
        <p className="kfc-intro">表面上是产品设计师。<br />实际上，正在重新定义人类与全家桶的交互关系。</p>
        <div className="kfc-tags"><span>嫩牛五方绝世品鉴家</span><span>疯狂星期四签约大卫·戴</span></div>
      </header>
      <div className="kfc-sheet-body">
        <div className="kfc-receipt-meta"><span>取餐号 <b>A050</b></span><span>应聘岗位 <b>首席开炫官</b></span><span>到岗时间 <b>下一口</b></span></div>
        <div className="kfc-career-quote"><span>PERSONAL STATEMENT / 个人陈述</span><p>我不是饿了。<br />我是在做<span>行业研究。</span></p></div>
        <div className="kfc-stats"><div><strong>52<span>+</span></strong><small>每年周四出勤</small></div><div><strong>SSS</strong><small>嫩牛五方理解力</small></div><div><strong>0<span>次</span></strong><small>把最后一口让给别人</small></div></div>
        <section className="kfc-experience"><h2><span>01</span>从业经历 <small>EXPERIENCE</small></h2>
          <div><span className="kfc-job-year">长期在岗</span><h3>嫩牛五方 · 绝世品鉴家</h3><p>以五个角为研究边界，建立“先咬哪个角”的决策模型。擅长在第一口与最后一口之间，实现牛肉分布的动态平衡。</p></div>
          <div><span className="kfc-job-year">每周四限定</span><h3>疯狂星期四 · 签约大卫·戴</h3><p>独立完成从“今天周几”到“你 V 我 50”的全链路叙事。连续多年保持周四准时饿，项目交付稳定，情绪价值拉满。</p></div>
          <div><span className="kfc-job-year">正在扩张</span><h3>全家桶 · 独立解决方案架构师</h3><p>坚持一人即团队、一桶即闭环。用最少的餐巾纸，解决最多的手部油脂问题。核心方法论：先吃，复盘的事稍后再说。</p></div>
        </section>
        <section className="kfc-skills"><h2><span>02</span>核心竞争力 <small>SKILL SET</small></h2>{[['点餐决策速度', '98%', '快于朋友说“随便”'], ['原味鸡拆解能力', '95%', '结构分析，精准到骨'], ['薯条保卫意识', '100%', '你的可以分，我的另说']].map(([name, value, note]) => <div key={name}><p><b>{name}</b><span>{value}</span></p><div className="kfc-skill-line"><i style={{ width: value }} /></div><small>{note}</small></div>)}</section>
        <div className="kfc-endorsement"><span>★ 面试官评语</span><p>“此人对食物的热情，<br />已经超出了岗位说明书。”</p><small>—— 一位不愿透露姓名的上校（梦里说的）</small></div>
        <div className="kfc-hire-area"><button className="kfc-hire" onClick={() => setHired(true)} disabled={hired}>{hired ? '已录用，即刻开炫！' : '录用此人（包吃就行）'}<ArrowUpRight size={20} /></button>{hired && <div className="kfc-hired-stamp" role="status">已录用<br /><small>APPROVED TO EAT</small></div>}<button className="kfc-return" onClick={onClose}>退出江湖，继续设计 →</button></div>
        <footer className="kfc-receipt-footer"><div className="kfc-barcode" aria-hidden="true" /><b>THANK YOU. SEE YOU NEXT THURSDAY.</b><p>你发现了一个彩蛋。此履历纯属整活，非品牌官方认证或合作。</p><span>本单不开发票，只开胃。</span></footer>
      </div>
    </article>
  </dialog>, document.body)
}
