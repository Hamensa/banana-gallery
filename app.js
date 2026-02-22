// --- SUPABASE CONFIG ---
const SUPABASE_URL = 'https://vwaidcntrtnixksyfuis.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Pt1-wpYkluwuXx6vTLp2vg_gpuFlZlw';
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// --- PREMIUM SEED DATA (NANOBANANA EDITION) ---
const SEED_DATA = [
    {
        title: "NANOBANANA - CYBERPUNK 2077",
        prompt: "A photorealistic yellow banana embedded with glowing cyan and magenta fiber-optic scales, floating in a dark rainy Neo-Tokyo street, cinematic lighting, 8k resolution.",
        image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1200&auto=format&fit=crop",
        model: "Midjourney v6",
        tags: ["Design", "3D"]
    },
    {
        title: "NANOBANANA - LIQUID GOLD",
        prompt: "Surreal photography of a banana melting into a pool of liquid gold, high speed splash, clean white background, minimalist, product photography style.",
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1200&auto=format&fit=crop",
        model: "DALL-E 3",
        tags: ["Design"]
    },
    {
        title: "NANOBANANA - ARCHITECTURAL VOID",
        prompt: "A massive banana-shaped pavilion in a white brutalist desert, people walking around, sharp shadows, architectural photography, hyper-minimalism.",
        image: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=1200&auto=format&fit=crop",
        model: "Flux.1",
        tags: ["3D", "Design"]
    },
    {
        title: "NANOBANANA - VOGUE PORTRAIT",
        prompt: "High fashion editorial portrait, model's face partially covered by translucent banana-patterned silk, soft studio lighting, pastel yellow tones.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
        model: "Midjourney v6",
        tags: ["Portrait"]
    },
    {
        title: "NANOBANANA - DIGITAL FRAGMENT",
        prompt: "A 3D isometric render of a banana made of transparent ice with frozen electronics inside, pastel purple background, cute aesthetic, Octane render.",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
        model: "Stable Diffusion XL",
        tags: ["3D"]
    }
];

let database = [];

async function startup() {
    console.log("🍌 BANANA ENGINE IGNITION...");
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '<p style="padding: 100px; text-align: center; color: #666;">아카이브를 동기화 중입니다...</p>';

    try {
        if (supabase) {
            const { data, error } = await supabase.from('prompts').select('*').order('id', { ascending: false });
            if (!error && data && data.length > 0) {
                database = data;
            } else {
                database = SEED_DATA;
            }
        } else {
            database = SEED_DATA;
        }
        render(database);
        initUI();
    } catch (e) {
        database = SEED_DATA;
        render(database);
    }
}

function render(data) {
    const gallery = document.getElementById('gallery');
    if (data.length === 0) {
        gallery.innerHTML = '<p style="padding: 100px; text-align: center; color: #666;">검색 결과가 없습니다.</p>';
        return;
    }

    gallery.innerHTML = data.map(p => `
        <div class="card" onclick="showDetail('${btoa(unescape(encodeURIComponent(JSON.stringify(p))))}')">
            <div class="card-img-wrapper">
                <img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=800&auto=format&fit=crop'">
            </div>
            <div class="card-info">
                <h3>${p.title}</h3>
                <p>${p.model}</p>
            </div>
        </div>
    `).join('');
}

function initUI() {
    // Search
    const search = document.getElementById('search-input');
    search.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = database.filter(p => p.title.toLowerCase().includes(query) || p.prompt.toLowerCase().includes(query));
        render(filtered);
    });

    // Filters
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        btn.onclick = () => {
            const tag = btn.dataset.tag;
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (tag === 'all') render(database);
            else {
                const filtered = database.filter(p => p.tags && p.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
                render(filtered);
            }
        };
    });
}

function showDetail(encoded) {
    const p = JSON.parse(decodeURIComponent(escape(atob(encoded))));
    const modal = document.getElementById('modal');
    document.getElementById('modal-image').src = p.image;
    document.getElementById('modal-title').innerText = p.title;
    document.getElementById('modal-model').innerText = p.model;
    document.getElementById('modal-prompt').innerText = p.prompt;

    document.getElementById('copy-btn').onclick = () => {
        navigator.clipboard.writeText(p.prompt);
        const btn = document.getElementById('copy-btn');
        btn.innerText = "복사되었습니다";
        btn.style.background = "#FFE135";
        btn.style.color = "#000";
        setTimeout(() => {
            btn.innerText = "프롬프트 복사";
            btn.style.background = "#3182f6";
            btn.style.color = "#fff";
        }, 2000);
    };

    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

document.getElementById('modal-close').onclick = () => {
    document.getElementById('modal').style.display = "none";
    document.body.style.overflow = "auto";
};

startup();
