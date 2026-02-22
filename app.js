// --- SUPABASE CONFIG ---
const SUPABASE_URL = 'https://vwaidcntrtnixksyfuis.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Pt1-wpYkluwuXx6vTLp2vg_gpuFlZlw';
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// --- PREMIUM MASSIVE SEED DATA (NANOBANANA EDITION) ---
const SEED_DATA = [
    {
        title: "NANOBANANA - CYBERPUNK 2077",
        prompt: "A photorealistic yellow banana embedded with glowing cyan and magenta fiber-optic scales, floating in a dark rainy Neo-Tokyo street, cinematic lighting, 8k resolution.",
        image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1200&auto=format&fit=crop",
        model: "Midjourney v6",
        tags: ["Design", "3D"]
    },
    {
        title: "LIQUID GOLD LUXURY",
        prompt: "Surreal photography of a banana melting into a pool of liquid gold, high speed splash, clean white background, minimalist, product photography style.",
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1200&auto=format&fit=crop",
        model: "DALL-E 3",
        tags: ["Design", "Art"]
    },
    {
        title: "ARCHITECTURAL VOID",
        prompt: "A massive banana-shaped pavilion in a white brutalist desert, people walking around, sharp shadows, architectural photography, hyper-minimalism.",
        image: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=1200&auto=format&fit=crop",
        model: "Flux.1",
        tags: ["3D", "Design"]
    },
    {
        title: "VOGUE EDITORIAL",
        prompt: "High fashion editorial portrait, model's face partially covered by translucent banana-patterned silk, soft studio lighting, pastel yellow tones.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
        model: "Midjourney v6",
        tags: ["Portrait", "Art"]
    },
    {
        title: "DIGITAL FRAGMENT",
        prompt: "A 3D isometric render of a banana made of transparent ice with frozen electronics inside, pastel purple background, cute aesthetic, Octane render.",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
        model: "Stable Diffusion XL",
        tags: ["3D", "Design"]
    },
    {
        title: "NEON SYNTHWAVE",
        prompt: "Retro 80s synthwave style, a glowing wireframe banana flying over a neon grid landscape, purple and orange color palette, vhs glitch effect.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
        model: "Midjourney v6",
        tags: ["Design", "3D"]
    },
    {
        title: "BOTANICAL STUDY",
        prompt: "Vintage botanical illustration of a futuristic mechanical banana plant, detailed blueprints, aged parchment paper background, ink drawing.",
        image: "https://images.unsplash.com/photo-1618331835717-8178cc05d9c2?q=80&w=1200&auto=format&fit=crop",
        model: "DALL-E 3",
        tags: ["Art", "Design"]
    },
    {
        title: "HYPER CAR CONCEPT",
        prompt: "Concept art of a sleek sports car inspired by the shape of a peeled banana, glossy yellow paint, aerodyamic curves, studio lighting.",
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop",
        model: "Midjourney v6",
        tags: ["3D", "Design"]
    },
    {
        title: "MINIMALIST POSTER",
        prompt: "Swiss graphic design poster, a perfect yellow circle and a single black line forming an abstract banana shape, typography layout, clean white background.",
        image: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1200&auto=format&fit=crop",
        model: "Flux.1",
        tags: ["Design", "Art"]
    },
    {
        title: "SURREALIST SCULPTURE",
        prompt: "A marble statue of a classical Greek figure holding a giant, hyper-realistic glowing banana, museum exhibition setting, dramatic lighting.",
        image: "https://images.unsplash.com/photo-1520607162513-7770f40d6c5d?q=80&w=1200&auto=format&fit=crop",
        model: "Stable Diffusion",
        tags: ["3D", "Art"]
    }
];

let database = [];

async function startup() {
    console.log("🍌 BANANA ENGINE IGNITION...");
    const gallery = document.getElementById('gallery');
    if (gallery) {
        gallery.innerHTML = '<div style="grid-column: 1/-1; padding: 100px; text-align: center; color: #666; font-size: 1.2rem;">데이터베이스를 동기화 중입니다...</div>';
    }

    try {
        if (supabase) {
            const { data, error } = await supabase.from('prompts').select('*').order('id', { ascending: false });
            if (!error && data && data.length > 0) {
                // If cloud has data, we append the local seed data so it always looks full
                database = [...data, ...SEED_DATA];
            } else {
                database = SEED_DATA;
            }
        } else {
            database = SEED_DATA;
        }
    } catch (e) {
        console.error("Supabase Error:", e);
        database = SEED_DATA;
    }

    if (gallery) {
        render(database);
        initUI();
    }
}

function render(data) {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    if (!data || data.length === 0) {
        gallery.innerHTML = `
            <div style="grid-column: 1/-1; padding: 120px 20px; text-align: center; border-radius: 20px; background: #f9fafb; border: 1px dashed #ced4da;">
                <h3 style="font-size: 24px; color: #191f28; margin-bottom: 8px;">검색 결과가 없습니다</h3>
                <p style="color: #6b7280; font-size: 16px;">다른 키워드나 태그로 검색해 보세요.</p>
            </div>
        `;
        return;
    }

    gallery.innerHTML = data.map(p => {
        // Safe encoding for onclick handler
        const pString = JSON.stringify(p);
        const encoded = btoa(unescape(encodeURIComponent(pString)));
        return `
        <div class="card" onclick="showDetail('${encoded}')">
            <div class="card-img-wrapper">
                <img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=800&auto=format&fit=crop'">
            </div>
            <div class="card-info">
                <h3>${p.title}</h3>
                <p>${p.model}</p>
            </div>
        </div>
        `;
    }).join('');
}

function initUI() {
    // Search Functionality
    const search = document.getElementById('search-input');
    if (search) {
        search.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                // Apply current active filter if search is cleared
                const activeBtn = document.querySelector('.filter-btn.active');
                if (activeBtn) applyFilter(activeBtn.dataset.tag);
                else render(database);
                return;
            }

            const filtered = database.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.prompt.toLowerCase().includes(query)
            );
            render(filtered);
        });
    }

    // Tag Filtering Functionality
    const btns = document.querySelectorAll('.filter-btn');
    if (btns) {
        btns.forEach(btn => {
            btn.onclick = () => {
                const tag = btn.dataset.tag;

                // Visual Update
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Logic Update
                applyFilter(tag);

                // Clear search when clicking a filter
                const searchInput = document.getElementById('search-input');
                if (searchInput) searchInput.value = '';
            };
        });
    }

    // Close modal when clicking X
    const modalCloseBtn = document.getElementById('modal-close');
    if (modalCloseBtn) {
        modalCloseBtn.onclick = closeModal;
    }

    // Close modal when clicking outside content
    window.onclick = (e) => {
        const modal = document.getElementById('modal');
        if (e.target === modal) {
            closeModal();
        }
    };
}

function applyFilter(tag) {
    if (!tag || tag === 'all') {
        render(database);
    } else {
        const filtered = database.filter(p => {
            if (!p.tags) return false;
            // Handle both array format and comma-separated string format
            const tagArray = Array.isArray(p.tags) ? p.tags : String(p.tags).split(',');
            return tagArray.some(t => t.trim().toLowerCase() === tag.toLowerCase());
        });
        render(filtered);
    }
}

function showDetail(encoded) {
    let p;
    try {
        p = JSON.parse(decodeURIComponent(escape(atob(encoded))));
    } catch (e) {
        console.error("Decoding error for modal:", e);
        return;
    }

    const modal = document.getElementById('modal');
    if (!modal) return;

    document.getElementById('modal-image').src = p.image;
    document.getElementById('modal-title').innerText = p.title;
    document.getElementById('modal-model').innerText = p.model;
    document.getElementById('modal-prompt').innerText = p.prompt;

    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        // Reset button state whenever modal opens
        copyBtn.innerText = "프롬프트 복사";
        copyBtn.style.background = "#3182f6";
        copyBtn.style.color = "#fff";

        copyBtn.onclick = () => {
            navigator.clipboard.writeText(p.prompt).then(() => {
                copyBtn.innerText = "복사되었습니다!";
                copyBtn.style.background = "#191f28";

                setTimeout(() => {
                    copyBtn.innerText = "프롬프트 복사";
                    copyBtn.style.background = "#3182f6";
                }, 2000);
            }).catch(err => {
                console.error("Failed to copy!", err);
            });
        };
    }

    // Set display flex to keep modal layout structure
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// Start application
startup();
