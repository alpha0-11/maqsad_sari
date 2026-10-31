// Notification and Reminder Service
import { soundEngine } from './audio-service.js';

class NotificationService {
  constructor() {
    this.timerId = null;
    this.toastContainer = null;
  }

  init() {
    this.createToastContainer();
    this.startScheduler();
  }

  createToastContainer() {
    if (!document.getElementById('nur-toast-container')) {
      const container = document.createElement('div');
      container.id = 'nur-toast-container';
      container.className = 'fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4';
      document.body.appendChild(container);
      this.toastContainer = container;
    } else {
      this.toastContainer = document.getElementById('nur-toast-container');
    }
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      this.showToast('Brauzeringiz tizim bildirishnomalarini qo\'llab-quvvatlamaydi. Ilova ichi eslatmalari faol!', 'info');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.showToast('Bildirishnomalar muvaffaqiyatli yoqildi! 🌸', 'success');
        this.sendSystemNotification('Nur Tasbeh', 'Zikr qilish eslatmalari va yangi videolar haqida xabardor qilamiz.');
        return true;
      } else {
        this.showToast('Bildirishnomalar rad etildi. Brauzer sozlamalaridan ruxsat bering.', 'warning');
        return false;
      }
    } catch (e) {
      console.warn('Notification permission error', e);
      return false;
    }
  }

  isPermissionGranted() {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  sendSystemNotification(title, body, url = '/') {
    if (this.isPermissionGranted()) {
      try {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then(reg => {
            reg.showNotification(title, {
              body,
              icon: '/icons/icon-192.svg',
              badge: '/icons/icon-192.svg',
              vibrate: [100, 50, 100],
              data: { url }
            });
          });
        } else {
          new Notification(title, {
            body,
            icon: '/icons/icon-192.svg'
          });
        }
      } catch (err) {
        console.warn('Native notification failed, using in-app toast', err);
      }
    }

    // Always show rich in-app toast as well
    this.showToast(`${title}: ${body}`, 'islamic');
    soundEngine.playSoftTap();
  }

  notifyNewVideo(videoTitle, speaker) {
    const title = "✨ Yangi Ibratli Video!";
    const body = `${speaker}: "${videoTitle}". Tomosha qilish va ibrat olish uchun bosing.`;
    this.sendSystemNotification(title, body, '#videolar');
  }

  notifyZikrReminder(zikrName = "Subhanalloh") {
    const title = "🌸 Zikr qilish vaqtingiz keldi";
    const body = `Qalbingizga huzur baxsh eting: Bugungi zikrlarni («${zikrName}») davom ettiring.`;
    this.sendSystemNotification(title, body, '#tasbeh');
  }

  startScheduler() {
    if (this.timerId) clearInterval(this.timerId);

    // Periodically check every 5 minutes or simulated interval
    this.timerId = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Morning zikr reminder around 07:00
      if (hours === 7 && minutes === 0) {
        this.notifyZikrReminder("Tonggi zikrlar & Astaghfirulloh");
      }
      // Evening zikr reminder around 19:30
      if (hours === 19 && minutes === 30) {
        this.notifyZikrReminder("Kechki zikrlar & Salovot");
      }
    }, 60000);
  }

  showToast(message, type = 'info') {
    this.createToastContainer();
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `glass-toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'islamic') {
      iconSvg = `<svg class="w-5 h-5 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.6-6.2 4.6 2.3-7.3-6.1-4.5h7.6z"/></svg>`;
    } else if (type === 'success') {
      iconSvg = `<svg class="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`;
    } else {
      iconSvg = `<svg class="w-5 h-5 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    }

    toast.innerHTML = `
      <div class="toast-inner">
        ${iconSvg}
        <div class="toast-content">
          <p class="toast-text">${message}</p>
        </div>
        <button class="toast-close" aria-label="Yopish">×</button>
      </div>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.add('toast-fadeout');
      setTimeout(() => toast.remove(), 300);
    });

    this.toastContainer.appendChild(toast);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add('toast-fadeout');
        setTimeout(() => toast.remove(), 300);
      }
    }, 5000);
  }
}

export const notificationService = new NotificationService();
