// Client Component - Landing hero with auto-advancing slider
'use client';

import { useActiveHeroSlides } from '@/hooks/queries/useHeroSlides';
import { HeroSlide } from '@/services/api/heroSlides';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const DEFAULTS: HeroSlide[] = [
  { id:'d1', sortOrder:0, chip:'AI-powered · built for SL students', title:'Learn while\nyou quiz.', body:"Every question comes with a short theory snippet — so you're not guessing, you're understanding. Built for O/L, A/L & university entrance prep.", primaryLabel:'Try a free quiz', primaryHref:'#quiz', ghostLabel:'Browse tests · from Rs.1,000', ghostHref:'/marketplace', photoUrl:'/hero-student.jpg', stats:[{n:'12,400+',l:'Students learning'},{n:'38',l:'Modules live'},{n:'4.8',l:'Avg. rating',star:true}], isActive:true, createdAt:new Date() },
  { id:'d2', sortOrder:1, chip:'5 subjects · 240+ modules', title:'Physics to\nEnglish.', body:'Every subject mapped to the Sri Lankan syllabus. Adaptive modules that find your weak spots and drill them until they click.', primaryLabel:'Explore subjects', primaryHref:'#subjects', ghostLabel:'See all modules', ghostHref:'#subjects', photoUrl:'/hero-student-subjects.jpg', subjectChips:[{n:'Physics',e:'⚛️'},{n:'Chemistry',e:'🧪'},{n:'ICT',e:'💻'},{n:'Maths',e:'📐'},{n:'English',e:'📚'}], isActive:true, createdAt:new Date() },
  { id:'d3', sortOrder:2, chip:'No subscription · pay per test', title:'Buy just the\ntests you need.', body:'Full papers, topic drills and flashcard decks from top SL tutors — from Rs.1,000. Keep them forever, replay as often as you like.', primaryLabel:'Browse the store', primaryHref:'/marketplace', ghostLabel:'Try flashcards', ghostHref:'/flashcards', photoUrl:'/hero-student-store.jpg', stats:[{n:'Rs.1,000',l:'Tests from'},{n:'320+',l:'Decks & papers'},{n:'∞',l:'Lifetime replays'}], isActive:true, createdAt:new Date() },
];

export function HeroSlider() {
  const { data } = useActiveHeroSlides();
  const slides = data && data.length > 0 ? data : DEFAULTS;
  const n = slides.length;
  const [active, setActive]   = useState(0);
  const [paused, setPaused]   = useState(false);

  useEffect(() => {
    if (paused || n < 2) return;
    const t = setInterval(() => setActive(a => (a + 1) % n), 5500);
    return () => clearInterval(t);
  }, [paused, n]);

  const go = (i: number) => setActive((i + n) % n);

  return (
    <section id="hero" style={{ paddingTop:0, paddingBottom:56 }}>
      <div className="hero-banner" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <span className="blob b1" /><span className="blob b2" /><span className="blob b3" />
        <div style={{ maxWidth:1240, margin:'0 auto', padding:'0 28px' }}>
          <div className="hero-grid">

            {/* Left — text slider */}
            <div className="hero-slider">
              <div className="hero-track" style={{ transform:`translateX(-${active * 100}%)` }}>
                {slides.map((s, i) => (
                  <div key={s.id} className="hero-slide" aria-hidden={i !== active}>
                    <SlideContent s={s} />
                  </div>
                ))}
              </div>
              <div className="hero-nav">
                <div className="hero-dots">
                  {slides.map((s, i) => (
                    <button key={s.id} className={`hero-dot${i === active ? ' on' : ''}`} onClick={() => go(i)} aria-label={`Slide ${i + 1}`}>
                      <span className="hero-dot-fill" style={{ animationPlayState: i === active && !paused ? 'running' : 'paused', animationName: i === active ? 'heroDotFill' : 'none' }} />
                    </button>
                  ))}
                </div>
                <div className="hero-arrows">
                  <button className="hero-arrow" onClick={() => go(active - 1)} aria-label="Previous">‹</button>
                  <button className="hero-arrow" onClick={() => go(active + 1)} aria-label="Next">›</button>
                </div>
              </div>
            </div>

            {/* Right — photo panel */}
            <div className="hero-art">
              <div className="hero-photo">
                {slides.map((s, i) => (
                  <div key={s.id} style={{ position:'absolute', inset:0, opacity: i === active ? 1 : 0, transform: i === active ? 'scale(1)' : 'scale(1.04)', transition:'opacity .7s ease, transform 1.2s ease' }}>
                    <Image src={s.photoUrl} alt="Megamind student" fill style={{ objectFit:'cover', objectPosition:'center top' }} priority={i === 0} />
                  </div>
                ))}
              </div>
              <div className="hero-float learners floaty" style={{ animationDelay:'1.4s' }}>
                <div style={{ display:'flex', alignItems:'center' }}>
                  {['var(--p-peach)','var(--p-mint)','var(--p-blue)'].map((c,i)=>(
                    <div key={i} style={{ width:38,height:38,borderRadius:999,border:'3px solid #fff',background:c,display:'grid',placeItems:'center',fontSize:16,marginLeft: i===0?0:-10,boxShadow:'0 2px 6px rgba(0,0,0,0.1)' }}>{['👩‍🎓','🧑‍🎓','👨‍🎓'][i]}</div>
                  ))}
                </div>
                <div>
                  <div style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:900, fontSize:15, color:'var(--p-ink)' }}>12,400+ joined</div>
                  <div style={{ fontSize:12, color:'var(--p-muted)' }}>this term</div>
                </div>
              </div>
              <div className="hero-float trial floaty" style={{ animationDelay:'0.7s' }}>14-day<br/>free trial</div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular subjects */}
      <div style={{ maxWidth:1240, margin:'0 auto', padding:'0 28px' }}>
        <div className="pop-row">
          <span className="pop-label">Popular subjects</span>
          <div className="pop-tiles">
            {([{n:'Physics',e:'⚛️',t:'var(--p-peach)'},{n:'Chemistry',e:'🧪',t:'var(--p-mint)'},{n:'ICT',e:'💻',t:'var(--p-blue)'},{n:'Maths',e:'📐',t:'var(--p-lav)'},{n:'English',e:'📚',t:'var(--p-pink)'}]).map(s=>(
              <a key={s.n} href="#subjects" className="pop-tile">
                <span className="pop-ic" style={{ background:s.t }}>{s.e}</span>
                <span>{s.n}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{HERO_CSS}</style>
    </section>
  );
}

function SlideContent({ s }: { s: HeroSlide }) {
  return (
    <div className="hero-copy">
      <span className="hero-chip"><span className="hero-chip-dot" /> {s.chip}</span>
      <h1 style={{ color:'#fff', fontSize:'clamp(40px,5.2vw,64px)', marginBottom:18 }}>
        {s.title.split('\n').map((line, i, arr) => <span key={i}>{line}{i < arr.length - 1 && <br />}</span>)}
      </h1>
      <p style={{ color:'rgba(255,255,255,0.92)', fontSize:18, lineHeight:1.6, maxWidth:480, marginBottom:26 }}>{s.body}</p>
      <div className="hero-cta">
        <Link href={s.primaryHref} className="hero-btn-primary">{s.primaryLabel} →</Link>
        <Link href={s.ghostHref} className="btn-ghost-light">{s.ghostLabel}</Link>
      </div>
      {s.stats && (
        <div className="hero-stats">
          {s.stats.map((st, i) => (
            <span key={i}>
              {i > 0 && <span className="hs-div" />}
              <div className="hs">
                <div style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:900, fontSize:'clamp(30px,4vw,46px)', lineHeight:1, letterSpacing:'-0.02em', color:'#fff' }}>{st.n}{st.star && ' ★'}</div>
                <div style={{ fontFamily:'var(--font-display,sans-serif)', fontWeight:700, fontSize:13, color:'rgba(255,255,255,0.85)', marginTop:4 }}>{st.l}</div>
              </div>
            </span>
          ))}
        </div>
      )}
      {s.subjectChips && (
        <div className="hero-subj-chips">
          {s.subjectChips.map(c => (
            <span key={c.n} className="hero-subj-chip"><span className="hero-subj-e">{c.e}</span>{c.n}</span>
          ))}
        </div>
      )}
    </div>
  );
}

const HERO_CSS = `
  .hero-banner { position:relative; background:linear-gradient(118deg,var(--p-hero-a) 0%,var(--p-hero-b) 52%,var(--p-hero-c) 100%); padding:64px 0 60px; overflow:hidden; }
  .hero-banner .blob { position:absolute; border-radius:999px; background:rgba(255,255,255,0.10); pointer-events:none; }
  .hero-banner .b1 { width:340px; height:340px; right:-90px; top:-120px; }
  .hero-banner .b2 { width:200px; height:200px; right:38%; bottom:-120px; background:rgba(255,255,255,0.07); }
  .hero-banner .b3 { width:120px; height:120px; left:-50px; top:40%; background:rgba(255,255,255,0.08); }
  .hero-grid { display:grid; grid-template-columns:1.08fr 0.92fr; gap:40px; align-items:center; }
  .hero-slider { position:relative; min-width:0; }
  .hero-track { display:flex; transition:transform .6s cubic-bezier(.5,.1,.2,1); }
  .hero-slide { flex:0 0 100%; min-width:0; }
  .hero-slide[aria-hidden="true"] { visibility:hidden; }
  .hero-copy { display:flex; flex-direction:column; }
  .hero-chip { display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.18); color:#fff; font-family:var(--font-display,sans-serif); font-weight:800; font-size:13px; padding:7px 14px; border-radius:999px; margin-bottom:20px; backdrop-filter:blur(4px); width:fit-content; }
  .hero-chip-dot { width:7px; height:7px; border-radius:999px; background:#fff; flex-shrink:0; }
  .hero-cta { display:flex; gap:14px; flex-wrap:wrap; align-items:center; margin-bottom:34px; }
  .hero-btn-primary { display:inline-flex; align-items:center; gap:8px; padding:16px 26px; border-radius:12px; background:#fff; color:var(--p-primary); font-family:var(--font-display,sans-serif); font-weight:800; font-size:15px; text-decoration:none; box-shadow:0 10px 28px rgba(0,0,0,0.18); transition:transform .15s,box-shadow .15s; }
  .hero-btn-primary:hover { transform:translateY(-2px); box-shadow:0 16px 36px rgba(0,0,0,0.22); }
  .btn-ghost-light { display:inline-flex; align-items:center; gap:8px; padding:16px 24px; border-radius:12px; border:1.6px solid rgba(255,255,255,0.6); color:#fff; font-family:var(--font-display,sans-serif); font-weight:800; font-size:15px; text-decoration:none; transition:background .15s,border-color .15s; }
  .btn-ghost-light:hover { background:rgba(255,255,255,0.14); border-color:#fff; }
  .hero-stats { display:flex; align-items:center; gap:26px; flex-wrap:wrap; }
  .hero-stats .hs { display:flex; flex-direction:column; }
  .hero-stats .hs-div { width:1px; height:38px; background:rgba(255,255,255,0.3); }
  .hero-subj-chips { display:flex; flex-wrap:wrap; gap:9px; margin-top:4px; }
  .hero-subj-chip { display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.16); color:#fff; font-family:var(--font-display,sans-serif); font-weight:800; font-size:14px; padding:8px 14px 8px 8px; border-radius:999px; backdrop-filter:blur(4px); }
  .hero-subj-e { width:26px; height:26px; border-radius:999px; background:rgba(255,255,255,0.92); display:grid; place-items:center; font-size:15px; }
  .hero-nav { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-top:30px; }
  .hero-dots { display:flex; align-items:center; gap:9px; }
  .hero-dot { position:relative; width:30px; height:6px; border-radius:999px; border:0; padding:0; cursor:pointer; overflow:hidden; background:rgba(255,255,255,0.34); transition:width .3s,background .3s; }
  .hero-dot.on { width:46px; }
  .hero-dot-fill { position:absolute; left:0; top:0; height:100%; width:0; background:#fff; border-radius:999px; }
  .hero-dot.on .hero-dot-fill { animation:heroDotFill 5.5s linear forwards; }
  @keyframes heroDotFill { from{width:0} to{width:100%} }
  .hero-arrows { display:flex; gap:9px; }
  .hero-arrow { width:40px; height:40px; border-radius:999px; cursor:pointer; background:rgba(255,255,255,0.16); border:1.4px solid rgba(255,255,255,0.4); color:#fff; display:grid; place-items:center; font-size:22px; line-height:1; transition:background .15s,transform .15s; }
  .hero-arrow:hover { background:rgba(255,255,255,0.28); border-color:#fff; transform:translateY(-1px); }
  .hero-art { position:relative; min-height:440px; }
  .hero-photo { position:relative; z-index:1; width:86%; margin:0 0 0 auto; aspect-ratio:1/1.05; border-radius:26px; overflow:hidden; box-shadow:0 24px 50px rgba(0,0,0,0.18); }
  .hero-float { position:absolute; z-index:3; background:#fff; border-radius:16px; box-shadow:0 16px 38px rgba(24,28,46,0.18); }
  .learners { right:-6px; bottom:28px; display:flex; align-items:center; gap:12px; padding:12px 16px; }
  .trial { left:6px; bottom:-14px; width:92px; height:92px; border-radius:999px; background:var(--p-ink); color:#fff; display:grid; place-items:center; text-align:center; font-family:var(--font-display,sans-serif); font-weight:900; font-size:14px; line-height:1.15; box-shadow:0 14px 30px rgba(0,0,0,0.22); }
  .pop-row { display:flex; align-items:center; gap:22px; margin-top:30px; flex-wrap:wrap; }
  .pop-label { font-family:var(--font-display,sans-serif); font-weight:800; font-size:14px; color:var(--p-muted); white-space:nowrap; }
  .pop-tiles { display:flex; gap:12px; flex-wrap:wrap; flex:1; }
  .pop-tile { display:flex; align-items:center; gap:10px; padding:9px 16px 9px 9px; border-radius:14px; background:var(--p-bg); border:1px solid var(--p-line); font-family:var(--font-display,sans-serif); font-weight:800; font-size:14.5px; color:var(--p-ink); text-decoration:none; box-shadow:var(--p-shadow-sm); transition:transform .15s,box-shadow .15s; }
  .pop-tile:hover { transform:translateY(-3px); box-shadow:var(--p-shadow); }
  .pop-ic { width:36px; height:36px; border-radius:10px; display:grid; place-items:center; font-size:19px; }
  @keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
  .floaty { animation:floaty 5s ease-in-out infinite; }
  @media (max-width:940px) { .hero-banner{padding:44px 0 40px;} .hero-grid{grid-template-columns:1fr;gap:30px;} .hero-art{min-height:320px;max-width:460px;} }
  @media (max-width:560px) { .hero-stats{gap:16px;} .hero-stats .hs-div{display:none;} .trial{display:none;} }
`;
