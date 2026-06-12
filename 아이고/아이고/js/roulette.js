const WIN_PROBABILITY = 0.4;

const segments = [
  { label: '500원\n할인', type: 'win', prize: '500원 할인 쿠폰' },
  { label: '꽝', type: 'lose' },
  { label: '음료\n무료', type: 'win', prize: '음료 1잔 무료' },
  { label: '꽝', type: 'lose' },
  { label: '1,000원\n할인', type: 'win', prize: '1,000원 할인 쿠폰' },
  { label: '꽝', type: 'lose' },
  { label: '간식\n증정', type: 'win', prize: '시장 간식 증정' },
  { label: '꽝', type: 'lose' },
];

const SPIN_DURATION = 3500;

function pickTargetIndex(isWinner) {
  const pool = segments
    .map((seg, i) => ({ seg, i }))
    .filter(({ seg }) => (isWinner ? seg.type === 'win' : seg.type === 'lose'));
  return pool[Math.floor(Math.random() * pool.length)].i;
}

function calcRotation(targetIndex) {
  const slice = 360 / segments.length;
  const center = targetIndex * slice + slice / 2;
  const extraSpins = 5 + Math.floor(Math.random() * 3);
  return extraSpins * 360 + (360 - center);
}

function showResultModal(isWinner, prize) {
  const modal = document.getElementById('resultModal');
  const title = document.getElementById('resultTitle');
  const message = document.getElementById('resultMessage');

  if (isWinner) {
    title.textContent = '축하합니다!';
    message.textContent = `${prize}에 당첨되었습니다. 시장 안내 데스크에서 확인해주세요.`;
    document.getElementById('resultIcon').textContent = '🎉';
    modal.classList.add('result-modal--win');
    modal.classList.remove('result-modal--lose');
    launchConfetti();
  } else {
    title.textContent = '아쉬워요!';
    message.textContent = '다음 기회에! 오늘도 이음 시장을 즐겨주세요.';
    document.getElementById('resultIcon').textContent = '🍀';
    modal.classList.add('result-modal--lose');
    modal.classList.remove('result-modal--win');
  }

  modal.showModal();
}

function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#C0392B', '#2E7D5E', '#D4A017', '#1A3A6B', '#8B3A2A'];
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * 100,
    w: 6 + Math.random() * 6,
    h: 4 + Math.random() * 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    vy: 2 + Math.random() * 4,
    vx: -2 + Math.random() * 4,
    rot: Math.random() * 360,
    vr: -5 + Math.random() * 10,
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    if (frame < 120) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

document.addEventListener('DOMContentLoaded', () => {
  const wheel = document.getElementById('rouletteWheel');
  const spinBtn = document.getElementById('spinBtn');
  const resultModal = document.getElementById('resultModal');
  let spinning = false;
  let currentRotation = 0;

  segments.forEach((seg, i) => {
    const el = document.createElement('div');
    el.className = 'wheel-segment';
    el.style.setProperty('--i', i);
    el.innerHTML = `<span>${seg.label.replace('\n', '<br>')}</span>`;
    wheel.appendChild(el);
  });

  spinBtn.addEventListener('click', () => {
    if (spinning) return;
    spinning = true;
    spinBtn.disabled = true;

    const isWinner = Math.random() < WIN_PROBABILITY;
    const targetIndex = pickTargetIndex(isWinner);
    const prize = segments[targetIndex].prize;
    const rotation = calcRotation(targetIndex);

    currentRotation += rotation;
    wheel.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`;
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
      spinning = false;
      spinBtn.disabled = false;
      showResultModal(isWinner, prize);
    }, SPIN_DURATION + 200);
  });

  document.getElementById('closeResult')?.addEventListener('click', () => resultModal.close());
  resultModal?.addEventListener('click', (e) => {
    if (e.target === resultModal) resultModal.close();
  });
});
