// Supabase Configuration - 이곳에 실제 값을 입력하세요!
const SUPABASE_URL = 'https://vwaidcntrtnixksyfuis.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Pt1-wpYkluwuXx6vTLp2vg_gpuFlZlw';
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

async function loadPrompts() {
    try {
        if (!supabase) {
            console.error("Supabase SDK not loaded");
            return;
        }

        const { data, error } = await supabase
            .from('prompts')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;
        renderGallery(data);
        setupFilters(data);
    } catch (e) {
        console.error("Failed to load prompts from Supabase:", e);
        // Fallback or error message for user
    }
}

function renderGallery(prompts) {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    if (prompts.length === 0) {
        gallery.innerHTML = '<p class="subtitle" style="grid-column: 1/-1; text-align: center; margin-top: 4rem;">데이터를 불러오는 중이거나 등록된 프롬프트가 없습니다.</p>';
        return;
    }

    gallery.innerHTML = prompts.map((p, index) => `
        <div class="card reveal" style="transition-delay: ${index * 0.1}s" onclick="openModal(${JSON.stringify(p).replace(/"/g, '&quot;')})">
            <img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.src='https://picsum.photos/seed/error/800/1000'">
            <div class="card-info">
                <p>${p.model}</p>
                <h3>${p.title}</h3>
            </div>
        </div>
    `).join('');

    // Trigger reveal animation with a small delay to ensure DOM is updated
    requestAnimationFrame(() => {
        setTimeout(() => {
            document.querySelectorAll('.card.reveal').forEach(card => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            });
        }, 50);
    });
}

function setupFilters(prompts) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            const tag = btn.dataset.tag;
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');

            if (tag === 'all') {
                renderGallery(prompts);
            } else {
                renderGallery(prompts.filter(p => p.tags.includes(tag)));
            }
        };
    });
}

function openModal(p) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-image').src = p.image;
    document.getElementById('modal-title').innerText = p.title;
    document.getElementById('modal-model').innerText = p.model;
    document.getElementById('modal-prompt').innerText = p.prompt;

    document.getElementById('copy-btn').onclick = () => {
        navigator.clipboard.writeText(p.prompt);
        const btn = document.getElementById('copy-btn');
        btn.innerText = "COPIED!";
        btn.style.background = "#00ff00";
        setTimeout(() => {
            btn.innerText = "COPY PROMPT";
            btn.style.background = "var(--accent)";
        }, 2000);
    };

    modal.style.display = "block";
}

document.querySelector('.close').onclick = () => {
    document.getElementById('modal').style.display = "none";
};

window.onclick = (event) => {
    if (event.target == document.getElementById('modal')) {
        document.getElementById('modal').style.display = "none";
    }
};

loadPrompts();
