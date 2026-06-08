// ========== 1. SLIDER ==========

const slides      = document.querySelectorAll('.slide');
const dotNavs     = document.querySelectorAll('.dot-nav');
const slideNum    = document.getElementById('slideNum');
const progressBar = document.getElementById('progressBar');
const prevBtn     = document.getElementById('prevBtn');
const nextBtn     = document.getElementById('nextBtn');

const INTERVAL = 5000;   // 5 giây đổi slide
let current = 0;
let autoTimer = null;

// Đi đến slide số n
function goTo(n) {
  // Bỏ active slide cũ
  slides[current].classList.remove('active');
  dotNavs[current].classList.remove('active');

  // Tính slide mới (vòng tròn)
  current = (n + slides.length) % slides.length;

  // Bật active slide mới
  slides[current].classList.add('active');
  dotNavs[current].classList.add('active');
  slideNum.textContent = (current + 1) + ' / ' + slides.length;

  // Reset progress bar
  progressBar.style.animation = 'none';
  progressBar.offsetWidth;   // trick: force reflow
  progressBar.style.animation = 'progress ' + (INTERVAL / 1000) + 's linear infinite';
}

// Tự động chạy
function startAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(function() { goTo(current + 1); }, INTERVAL);
}

// Gán sự kiện nút
prevBtn.addEventListener('click', function() { goTo(current - 1); startAuto(); });
nextBtn.addEventListener('click', function() { goTo(current + 1); startAuto(); });

// Gán sự kiện dot
dotNavs.forEach(function(dot) {
  dot.addEventListener('click', function() {
    goTo(parseInt(dot.dataset.i));
    startAuto();
  });
});

// Khởi động
startAuto();


// ========== 2. SIDEBAR TOGGLE ==========

const sidebar       = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

// Mặc định: sidebar MỞ (không có class 'collapsed')
// Bấm toggle: thêm/bỏ class 'collapsed'
sidebarToggle.addEventListener('click', function() {
  sidebar.classList.toggle('collapsed');
});


// ========== 3. LOGIN MODAL ==========

const avatarBtn  = document.getElementById('avatarBtn');
const loginModal = document.getElementById('loginModal');
const modalClose = document.getElementById('modalClose');
const loginBtn   = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');

// Danh sách tài khoản (thực tế sẽ lấy từ backend)
// role: 'admin' hoặc 'customer'
const ACCOUNTS = [
  { email: 'admin@pczone.vn',  password: 'admin123', name: 'Admin',    role: 'admin'    },
  { email: 'user@pczone.vn',   password: 'user123',  name: 'Khách',    role: 'customer' },
];

// Trạng thái đăng nhập (lưu trong biến, đơn giản)
let currentUser = null;

// Mở modal khi bấm avatar
avatarBtn.addEventListener('click', function() {
  if (currentUser) {
    // Đã đăng nhập → hỏi đăng xuất
    if (confirm('Đăng xuất tài khoản ' + currentUser.name + '?')) {
      logout();
    }
  } else {
    // Chưa đăng nhập → mở modal
    openModal();
  }
});

// Đóng modal khi bấm X
modalClose.addEventListener('click', closeModal);

// Đóng modal khi bấm ra ngoài
loginModal.addEventListener('click', function(e) {
  if (e.target === loginModal) closeModal();
});

// Bấm nút đăng nhập
loginBtn.addEventListener('click', doLogin);

// Bấm Enter trong input cũng đăng nhập
document.getElementById('loginPassword').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') doLogin();
});

function openModal() {
  loginModal.classList.add('show');
  document.getElementById('loginEmail').focus();
  loginError.style.display = 'none';
}

function closeModal() {
  loginModal.classList.remove('show');
}

function doLogin() {
  var email    = document.getElementById('loginEmail').value.trim();
  var password = document.getElementById('loginPassword').value;

  // Tìm tài khoản khớp
  var found = ACCOUNTS.find(function(acc) {
    return acc.email === email && acc.password === password;
  });

  if (!found) {
    // Sai → hiện lỗi
    loginError.textContent = '❌ Email hoặc mật khẩu không đúng!';
    loginError.style.display = 'block';
    return;
  }

  // Đúng → lưu user, đóng modal, cập nhật UI
  currentUser = found;
  closeModal();
  updateNavAfterLogin(found);
}

function logout() {
  currentUser = null;
  // Reset avatar về trạng thái ban đầu
  avatarBtn.innerHTML = '<svg viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  avatarBtn.classList.remove('avatar-logged');
  avatarBtn.title = 'Đăng nhập';
}

function updateNavAfterLogin(user) {
  // Đổi icon avatar thành chữ viết tắt + màu theo role
  var initials = user.name.charAt(0).toUpperCase();

  if (user.role === 'admin') {
    // Admin: nền đỏ nhạt + chữ đỏ
    avatarBtn.innerHTML = '<span style="font-size:13px;font-weight:900;color:#dc2626">' + initials + '</span>';
    avatarBtn.style.background = '#fee2e2';
    avatarBtn.style.borderColor = '#fca5a5';
    avatarBtn.title = 'Admin: ' + user.name + ' (bấm để đăng xuất)';

    // Thêm badge ADMIN vào navbar (tùy chọn)
    showToast('👑 Xin chào Admin ' + user.name + '!', '#7c3aed');

  } else {
    // Khách hàng: nền cyan nhạt + chữ cyan
    avatarBtn.innerHTML = '<span style="font-size:13px;font-weight:900;color:#0097a7">' + initials + '</span>';
    avatarBtn.style.background = '#e0f7fa';
    avatarBtn.style.borderColor = '#00bcd4';
    avatarBtn.title = 'Khách: ' + user.name + ' (bấm để đăng xuất)';

    showToast('👋 Xin chào ' + user.name + '!', '#00bcd4');
  }
}

// Toast thông báo nhỏ
function showToast(msg, color) {
  var toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = [
    'position:fixed', 'bottom:24px', 'right:24px',
    'background:' + color, 'color:white',
    'padding:10px 20px', 'border-radius:40px',
    'font-family:Nunito,sans-serif', 'font-size:14px', 'font-weight:700',
    'box-shadow:0 4px 16px rgba(0,0,0,0.15)',
    'z-index:9999', 'opacity:0',
    'transition:opacity 0.3s'
  ].join(';');

  document.body.appendChild(toast);

  // Fade in
  setTimeout(function() { toast.style.opacity = '1'; }, 10);
  // Fade out sau 3 giây
  setTimeout(function() {
    toast.style.opacity = '0';
    setTimeout(function() { toast.remove(); }, 300);
  }, 3000);
}