// Glassy Minimalist Dashboard Component (Inspired by Glassy Dashboard V4 in IMG_1488.MP4)
import { dbService } from '../services/db-service.js';
import { notificationService } from '../services/notification-service.js';
import { soundEngine } from '../services/audio-service.js';

export class Dashboard {
  constructor(containerElement, onVideoAdded, onZikrAdded) {
    this.container = containerElement;
    this.onVideoAdded = onVideoAdded;
    this.onZikrAdded = onZikrAdded;
    this.init();
  }

  async init() {
    await this.render();
  }

  async render() {
    const todayCount = dbService.getTodayCount();
    const totalCount = dbService.getTotalCount();
    const streak = dbService.getStreak();
    const videos = await dbService.getAllVideos();

    this.container.innerHTML = `
      <div class="dashboard-wrapper">
        <!-- Dashboard Header (Glassy V4 Pill Style) -->
        <div class="dash-hero glass-card">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="pulse-indicator"></span>
                <span class="text-xs uppercase tracking-wider text-amber-300 font-semibold">Boshqaruv Paneli</span>
              </div>
              <h1 class="text-2xl font-bold text-white mt-1">Nur Tasbeh Dashboard</h1>
              <p class="text-xs text-white/60">Ibratli videolarni joylash, yangi zikrlarni qo'shish va statistikani kuzatish</p>
            </div>
            
            <div class="flex items-center gap-2">
              <button id="send-reminder-broadcast-btn" class="glass-btn-accent text-xs flex items-center gap-2">
                <svg class="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                <span>Eslatma jo'natish</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 4 Stat Cards Grid (From IMG_1488.MP4) -->
        <div class="dash-stats-grid">
          <div class="glass-stat-card">
            <div class="stat-icon-box bg-cyan-500/10 text-cyan-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <span class="stat-label">Bugungi Zikrlar</span>
              <h3 class="stat-value text-cyan-300">${todayCount.toLocaleString()}</h3>
            </div>
          </div>

          <div class="glass-stat-card">
            <div class="stat-icon-box bg-emerald-500/10 text-emerald-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <span class="stat-label">Jami Sanalgan</span>
              <h3 class="stat-value text-emerald-300">${totalCount.toLocaleString()}</h3>
            </div>
          </div>

          <div class="glass-stat-card">
            <div class="stat-icon-box bg-amber-500/10 text-amber-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/></svg>
            </div>
            <div>
              <span class="stat-label">Faol Streak</span>
              <h3 class="stat-value text-amber-300">${streak} kun</h3>
            </div>
          </div>

          <div class="glass-stat-card">
            <div class="stat-icon-box bg-rose-500/10 text-rose-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            </div>
            <div>
              <span class="stat-label">Videolar Soni</span>
              <h3 class="stat-value text-rose-300">${videos.length} ta</h3>
            </div>
          </div>
        </div>

        <!-- 2 Columns: Video Upload & Zikr Add -->
        <div class="dash-sections-grid">
          <!-- Video Upload Card -->
          <div class="glass-card dash-panel">
            <div class="flex items-center justify-between pb-3 border-b border-white/5">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <h3 class="font-bold text-white text-base">Yangi Video Joylash</h3>
              </div>
              <span class="text-[11px] text-white/50">MP4 / WebM / URL</span>
            </div>

            <form id="dash-video-form" class="space-y-3 mt-4">
              <div>
                <label class="dash-field-label">Video Sarlavhasi</label>
                <input type="text" id="v-title" class="dash-input" placeholder="Masalan: Allohning va'dasi haqdir..." required />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="dash-field-label">Notiq / Ustoz</label>
                  <input type="text" id="v-speaker" class="dash-input" placeholder="Shayx Nuriddin domla" required />
                </div>
                <div>
                  <label class="dash-field-label">Kategoriya</label>
                  <select id="v-category" class="dash-input">
                    <option value="Eslatma">Eslatma</option>
                    <option value="Ma'ruza">Ma'ruza</option>
                    <option value="Duo & Zikr">Duo & Zikr</option>
                    <option value="Qur'on">Qur'on</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="dash-field-label">Video Fayli (Qurilmangizdan yuklash)</label>
                <div class="file-dropzone" id="v-file-dropzone">
                  <input type="file" id="v-file" accept="video/mp4,video/webm" class="hidden" />
                  <div class="flex flex-col items-center justify-center p-3 text-center cursor-pointer" id="v-file-trigger">
                    <svg class="w-7 h-7 text-amber-400/80 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                    <span class="text-xs text-white/80 font-medium" id="v-file-status">Video faylini tanlang yoki shu yerga tashlang</span>
                    <span class="text-[10px] text-white/40 mt-0.5">MP4 format tavsiya etiladi</span>
                  </div>
                </div>
              </div>

              <div class="relative flex items-center justify-center my-1">
                <span class="text-[10px] uppercase tracking-wider text-white/30 bg-black/40 px-2 rounded">yoki havola orqali</span>
              </div>

              <div>
                <label class="dash-field-label">Video URL (To'g'ridan-to'g'ri havola)</label>
                <input type="url" id="v-url" class="dash-input" placeholder="https://.../video.mp4" />
              </div>

              <button type="submit" id="v-submit-btn" class="dash-submit-btn">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <span>Videoni e'lon qilish & bildirishnoma jo'natish</span>
              </button>
            </form>
          </div>

          <!-- Add Zikr Card -->
          <div class="glass-card dash-panel">
            <div class="flex items-center justify-between pb-3 border-b border-white/5">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                <h3 class="font-bold text-white text-base">Yangi Zikr / Duo Qo'shish</h3>
              </div>
              <span class="text-[11px] text-white/50">Sunnat Zikrlari</span>
            </div>

            <form id="dash-zikr-form" class="space-y-3 mt-4">
              <div>
                <label class="dash-field-label">Arabcha Matni</label>
                <input type="text" id="z-arabic" class="dash-input font-arabic text-lg" placeholder="سُبْحَانَ اللَّهِ" dir="rtl" required />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="dash-field-label">O'qilishi (Transliteratsiya)</label>
                  <input type="text" id="z-trans" class="dash-input" placeholder="Subhanalloh" required />
                </div>
                <div>
                  <label class="dash-field-label">Mo'ljal Soni</label>
                  <input type="number" id="z-target" class="dash-input" value="100" min="1" max="10000" required />
                </div>
              </div>

              <div>
                <label class="dash-field-label">O'zbekcha Ma'nosi</label>
                <textarea id="z-meaning" class="dash-input resize-none h-16" placeholder="Alloh barcha nuqsonlardan pokdir..." required></textarea>
              </div>

              <div>
                <label class="dash-field-label">Fazilati / Hadis tavsiyasi</label>
                <input type="text" id="z-benefit" class="dash-input" placeholder="Jannatda daraxt ekiladi..." />
              </div>

              <button type="submit" class="dash-submit-btn-cyan">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                <span>Zikrlar ro'yxatiga qo'shish</span>
              </button>
            </form>
          </div>
        </div>

        <!-- Video Management List -->
        <div class="glass-card dash-panel mt-6">
          <h3 class="font-bold text-white text-base mb-3 flex items-center gap-2">
            <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
            <span>Mavjud Videolar Ro'yxati</span>
          </h3>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-white/10 text-white/50">
                  <th class="py-2.5 px-3">Sarlavha</th>
                  <th class="py-2.5 px-3">Notiq</th>
                  <th class="py-2.5 px-3">Kategoriya</th>
                  <th class="py-2.5 px-3">Davomiyligi</th>
                  <th class="py-2.5 px-3 text-right">Amal</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5 text-white/80">
                ${videos.map(v => `
                  <tr>
                    <td class="py-3 px-3 font-medium text-white flex items-center gap-2">
                      <div class="w-6 h-6 rounded bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                      <span class="truncate max-w-xs">${v.title}</span>
                    </td>
                    <td class="py-3 px-3 text-white/70">${v.speaker}</td>
                    <td class="py-3 px-3"><span class="badge-amber text-[10px]">${v.category}</span></td>
                    <td class="py-3 px-3 text-white/50">${v.duration || '01:10'}</td>
                    <td class="py-3 px-3 text-right">
                      ${v.id !== 'lecture-1' ? `
                        <button class="delete-video-btn text-rose-400 hover:text-rose-300 p-1" data-video-id="${v.id}" title="O'chirish">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      ` : '<span class="text-[10px] text-white/30">Asosiy</span>'}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    // Broadcast notification button
    const broadcastBtn = this.container.querySelector('#send-reminder-broadcast-btn');
    if (broadcastBtn) {
      broadcastBtn.addEventListener('click', () => {
        soundEngine.playSoftTap();
        notificationService.notifyZikrReminder("Astaghfirulloh & Subhanalloh");
      });
    }

    // Video File selector
    const fileTrigger = this.container.querySelector('#v-file-trigger');
    const fileInput = this.container.querySelector('#v-file');
    const fileStatus = this.container.querySelector('#v-file-status');
    let selectedFileBlob = null;

    if (fileTrigger && fileInput) {
      fileTrigger.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          const file = e.target.files[0];
          selectedFileBlob = file;
          fileStatus.textContent = `✓ ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`;
          fileStatus.classList.add('text-emerald-400');
        }
      });
    }

    // Video Form Submit
    const videoForm = this.container.querySelector('#dash-video-form');
    if (videoForm) {
      videoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        soundEngine.playSoftTap();

        const title = this.container.querySelector('#v-title').value.trim();
        const speaker = this.container.querySelector('#v-speaker').value.trim();
        const category = this.container.querySelector('#v-category').value;
        const directUrl = this.container.querySelector('#v-url').value.trim();

        let finalUrl = directUrl;
        if (!finalUrl && selectedFileBlob) {
          finalUrl = URL.createObjectURL(selectedFileBlob);
        } else if (!finalUrl) {
          // If neither provided, fallback to demo lecture
          finalUrl = '/videos/lecture-1.mp4';
        }

        const newVideo = await dbService.saveVideo({
          title,
          speaker,
          category,
          url: finalUrl,
          blob: selectedFileBlob
        });

        // Push notification immediately to users!
        notificationService.notifyNewVideo(title, speaker);

        if (this.onVideoAdded) this.onVideoAdded(newVideo);
        await this.render();
      });
    }

    // Zikr Form Submit
    const zikrForm = this.container.querySelector('#dash-zikr-form');
    if (zikrForm) {
      zikrForm.addEventListener('submit', (e) => {
        e.preventDefault();
        soundEngine.playSoftTap();

        const arabic = this.container.querySelector('#z-arabic').value.trim();
        const transliteration = this.container.querySelector('#z-trans').value.trim();
        const meaning = this.container.querySelector('#z-meaning').value.trim();
        const target = parseInt(this.container.querySelector('#z-target').value, 10) || 100;
        const benefit = this.container.querySelector('#z-benefit').value.trim() || 'Fazilatli zikr';

        const newZikr = dbService.addCustomZikr({
          arabic,
          transliteration,
          meaning,
          target,
          category: 'kundalik',
          benefit,
          recommendation: `${target} marta aytish`
        });

        notificationService.showToast(`«${transliteration}» zikri muvaffaqiyatli qo'shildi! 🌸`, 'success');

        if (this.onZikrAdded) this.onZikrAdded(newZikr);
        zikrForm.reset();
      });
    }

    // Delete video buttons
    const delBtns = this.container.querySelectorAll('.delete-video-btn');
    delBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const vidId = btn.getAttribute('data-video-id');
        if (confirm("Ushbu videoni o'chirishni istaysizmi?")) {
          dbService.deleteVideo(vidId);
          await this.render();
          notificationService.showToast("Video o'chirildi", 'info');
        }
      });
    });
  }
}
