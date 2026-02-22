// --- CONFIGURATION ---
const SUPABASE_URL = 'https://vwaidcntrtnixksyfuis.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Pt1-wpYkluwuXx6vTLp2vg_gpuFlZlw';
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// --- CEO'S SELECTION (DUMMY CONTENT) ---
const LOCAL_VAULT = [
    {
        id: 'dummy-1',
        title: "천재 바나나의 탄생 / GENESIS BANANA",
        prompt: "A photorealistic yellow banana floating in a void of pure digital light, binary code raining in the background, neon yellow glow, 8k resolution, cinematic.",
        image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1200&auto=format&fit=crop",
        model: "Midjourney v6",
        tags: ["Design", "3D"]
    },
    {
        id: 'dummy-2',
        title: "골든 본 / GOLDEN BONE",
        prompt: "Stylized portrait of a dog wearing golden sunglasses and a banana-patterned silk shirt, high fashion editorial, minimalist black background.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
        model: "DALL-E 3",
        tags: ["Portrait"]
    },
    {
        id: 'dummy-3',
        title: "네온 정글 / NEON JUNGLE",
        prompt: "Surreal jungle at night, trees are made of glowing yellow bananas, exotic birds with golden feathers, bioluminescent plants, dreamlike atmosphere.",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
        model: "Flux.1",
        tags: ["3D", "Design"]
    }
];

let masterPrompts = [];

async function init() {
    console.log("💼 CEO/CTO ENGINE STARTING...");
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '<p class="subtitle" style="grid-column: 1/-1;">데이터를 감싱 중입니다... / SYNCING DATA...</p>';

    try {
        if (supabase) {
            const { data, error } = await supabase.from('prompts').select('*').order('id', { ascending: false });
            if (!error && data && data.length > 0) {
                masterPrompts = data;
                console.log("✅ CLOUD SYNC SUCCESS.");
            } else {
                console.warn("⚠️ CLOUD EMPTY. LOADING VAULT.");
                masterPrompts = LOCAL_VAULT;
            }
        } else {
            masterPrompts = LOCAL_VAULT;
        }

        render(masterPrompts);
        setupSearch();
        setupFilters();
    } catch (err) {
        console.error("❌ ENGINE FAILURE:", err);
        masterPrompts = LOCAL_VAULT;
        render(masterPrompts);
    }
}

function render(prompts) {
    const gallery = document.getElementById('gallery');
    if (prompts.length === 0) {
        gallery.innerHTML = '<p class="subtitle" style="grid-column: 1/-1;">검색 결과가 없습니다. / NO RESULTS.</p>';
        return;
    }

    gallery.innerHTML = prompts.map(p => `
        <div class="card" onclick="openModal('${btoa(unescape(encodeURIComponent(JSON.stringify(p))))}')">
            <div class="card-img-wrapper">
                <img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=800&auto=format&fit=crop'">
            </div>
            <div class="card-info">
                <h3>${p.title}</h3>
                <span class="model-tag">${p.model}</span>
            </div>
        </div>
    `).join('');
}

function setupSearch() {
    const search = document.getElementById('search-input');
    search.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = masterPrompts.filter(p =>
            p.title.toLowerCase().includes(query) ||
            p.prompt.toLowerCase().includes(query)
        );
        render(filtered);
    });
}

function setupFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        btn.onclick = () => {
            const tag = btn.dataset.tag;
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (tag === 'all') {
                render(masterPrompts);
            } else {
                const filtered = masterPrompts.filter(p =>
                    p.tags && p.tags.some(t => t.toLowerCase() === tag.toLowerCase())
                );
                render(filtered);
            }
        };
    });
}

function openModal(encoded) {
    const p = JSON.parse(decodeURIComponent(escape(atob(encoded))));
    const modal = document.getElementById('modal');

    document.getElementById('modal-image').src = p.image;
    document.getElementById('modal-title').innerText = p.title;
    document.getElementById('modal-model').innerText = p.model;
    document.getElementById('modal-prompt').innerText = p.prompt;

    document.getElementById('copy-btn').onclick = () => {
        navigator.clipboard.writeText(p.prompt);
        const btn = document.getElementById('copy-btn');
        btn.innerText = "복사 완료! / COPIED";
        btn.style.background = "#FFE135";
        setTimeout(() => {
            btn.innerText = "프롬프트 복사 / COPY PROMPT";
            btn.style.background = "#FFFFFF";
        }, 2000);
    };

    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

document.getElementById('modal-close').onclick = () => {
    document.getElementById('modal').style.display = "none";
    document.body.style.overflow = "auto";
};

init();
