// Minimal JS for dashboard interactions: collapsible sections, lesson play, active state
(function(){
  function qs(sel, el=document){return el.querySelector(sel)}
  function qsa(sel, el=document){return Array.from(el.querySelectorAll(sel))}

  // Initialize collapsible sections
  qsa('.section').forEach(section=>{
    const toggle = section.querySelector('.section-toggle')
    const body = section.querySelector('.section-body')
    // use attribute to store open state
    if(toggle.getAttribute('aria-expanded') === 'true'){
      section.setAttribute('open','')
      body.style.maxHeight = body.scrollHeight + 'px'
    }
    toggle.addEventListener('click', ()=>{
      const isOpen = section.hasAttribute('open')
      if(isOpen){
        section.removeAttribute('open')
        toggle.setAttribute('aria-expanded','false')
        body.style.maxHeight = null
      } else {
        section.setAttribute('open','')
        toggle.setAttribute('aria-expanded','true')
        body.style.maxHeight = body.scrollHeight + 'px'
      }
    })
  })

  // Play lesson in player
  const player = qs('#coursePlayer')
  function setActiveLesson(el){
    qsa('.lesson').forEach(l=>l.classList.remove('active'))
    el.classList.add('active')
  }

  qsa('.lesson-play').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const lesson = e.target.closest('.lesson')
      const vid = lesson.getAttribute('data-video')
      if(!vid) return
      player.src = `https://www.youtube.com/embed/${vid}?rel=0&autoplay=1`
      setActiveLesson(lesson)
      // update module/lesson header if present
      const title = lesson.querySelector('.lesson-title')?.textContent || ''
      qs('.player-title').textContent = title
      // small persist
      localStorage.setItem('hsk_current_lesson', vid)
    })
  })

  // Restore lesson if present
  const saved = localStorage.getItem('hsk_current_lesson')
  if(saved){player.src = `https://www.youtube.com/embed/${saved}?rel=0`}

})();
