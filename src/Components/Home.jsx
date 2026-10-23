import React, { useEffect, useRef, useState } from "react"; 
import gsap from "gsap";                     
import * as THREE from "three";              
import "../assets/Style/style.css";          

// ---------- IMAGES ----------
import karthi from '../assets/Image/perfbg.png';    

import karthi1 from '../assets/Image/perf1.png';    
import karthi2 from '../assets/Image/perf2.png';    // sliding cards
import karthi3 from '../assets/Image/perf3.png';    // sliding cards
import karthi4 from '../assets/Image/perf4.png';    // sliding cards
import karthi5 from '../assets/Image/perf5.png';    // sliding cards
import karthi6 from '../assets/Image/perf6.png';    // sliding cards

import karthi7 from '../assets/Image/percard1.jpg';   
import karthi8 from '../assets/Image/percard2.jpg';   
import karthi9 from '../assets/Image/percard3.webp';  

import karthi10 from '../assets/Image/alister.webp';  
import karthi11 from '../assets/Image/alisterpg.jpg'; 


// ---------- SLIDING CARDS - edhu edhu image nu inga maathalaam ----------
// top row: left pakkam nagarum
const topRow = [karthi1, karthi2, karthi3, karthi4, karthi5];

// bottom row: right pakkam nagarum
const bottomRow = [karthi6, karthi5, karthi4, karthi3, karthi2];


function Smoke({ side, maxOpacity }) {

    // smoke canvas podura box
    const boxRef = useRef(null);

    useEffect(() => {
        const box = boxRef.current;
        let w = box.clientWidth;     // box width
        let h = box.clientHeight;    // box height

        // scene + camera (pixel alavu padi velai seyyum camera)
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(0, w, h, 0, -10, 10);

        // renderer - alpha:true = background transparent
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(w, h);
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.style.display = "block";
        box.appendChild(renderer.domElement);

        const c = document.createElement("canvas");
        c.width = 128;
        c.height = 128;
        const ctx = c.getContext("2d");
        const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(0.4, "rgba(255,255,255,0.35)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 128, 128);
        const texture = new THREE.CanvasTexture(c);

        const direction = side === "left" ? 1 : -1;

        const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const speedFactor = calm ? 0.91 : 15;

        function resetPuff(p, randomAge) {
            p.age = randomAge ? Math.random() : 0;      
            p.speed = 0.025 + Math.random() * 0.03;     
            p.offsetX = Math.random() * 120;            
            p.offsetY = Math.random() * 60 - 20;        
            p.phase = Math.random() * Math.PI * 2;      
            p.size = 120 + Math.random() * 100;         
            p.spin = (Math.random() - 0.5) * 0.004;     
        }

        const puffs = [];
        for (let i = 0; i < 22; i++) {
            const material = new THREE.SpriteMaterial({
                map: texture,
                color: 0xf3e3d0,         
                transparent: true,
                opacity: 0,
                depthWrite: false
            });
            const sprite = new THREE.Sprite(material);
            const p = { sprite: sprite };
            resetPuff(p, true);
            scene.add(sprite);
            puffs.push(p);
        }

        const clock = new THREE.Clock();
        let frameId;

        function animate() {
            frameId = requestAnimationFrame(animate);
            const dt = Math.min(clock.getDelta(), 0.05);

            for (let i = 0; i < puffs.length; i++) {
                const p = puffs[i];
                p.age += dt * p.speed * speedFactor;
                if (p.age >= 1) resetPuff(p, false);   

                const a = p.age;
                const startX = side === "left" ? p.offsetX : w - p.offsetX;

                p.sprite.position.x = startX + direction * a * w * 0.5 + Math.sin(a * 7 + p.phase) * (20 + a * 70);

                p.sprite.position.y = p.offsetY + a * h * 0.55;

                const size = p.size + a * 200;
                p.sprite.scale.set(size, size, 1);

                p.sprite.material.rotation += p.spin;

                p.sprite.material.opacity = Math.sin(a * Math.PI) * maxOpacity;
            }

            renderer.render(scene, camera);
        }
        animate();

        function resize() {
            w = box.clientWidth;
            h = box.clientHeight;
            if (w === 0 || h === 0) return;
            camera.right = w;
            camera.top = h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }
        const observer = new ResizeObserver(resize);
        observer.observe(box);

        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            box.removeChild(renderer.domElement);
            puffs.forEach((p) => p.sprite.material.dispose());
            texture.dispose();
            renderer.dispose();
        };
    }, [side, maxOpacity]);

    return <div className="smoke-box" ref={boxRef}></div>;
}



function Home() {

    // contact form show / hide (true = form theriyum)
    const [showForm, setShowForm] = useState(false);

    const [formSent, setFormSent] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();      
        setFormSent(true);       
    }

    // form close panna
    function closeForm() {
        setShowForm(false);
        setFormSent(false);      
    }

    useEffect(() => {
        const anim = gsap.fromTo(
            ".hero-text",
            { opacity: 0, y: 40 },                        
            { opacity: 1, y: 0, duration: 1.2, stagger: 0.2 } 
        );

        return () => {
            anim.kill();
        };
    }, []);

    return (
        <div className="perfume-page">

            {/* ---------- NAVBAR ---------- */}
            <nav className="navbar">
                <h2 className="logo">PERFUME</h2>

                <ul className="nav-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#collection">Collection</a></li>
                    <li><a href="#story">Story</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>

            {/* ---------- HERO SECTION ---------- */}
            <section
                id="home"
                className="hero"
                style={{ backgroundImage: `url(${karthi})` }}
            >
                {/* navy blue overlay - image mela dark blue shade */}
                <div className="hero-overlay"></div>

                {/* SMOKE - right bottom corner la irundhu lite-ah varum, cards kum text kum pinnaadi pogum */}
                <Smoke side="right" maxOpacity={0.10} />

                {/* LEFT SIDE - text content */}
                <div className="hero-left">
                    <p className="hero-small hero-text">Luxury fragrances</p>

                    <h1 className="hero-title hero-text">PERFUME</h1>

                    <p className="hero-desc hero-text">
                        Every bottle holds a story. Find the scent that stays
                        with you long after you leave the room.
                    </p>

                    <button className="hero-button hero-text">All Collection</button>
                </div>

                {/* RIGHT SIDE - 3 cards */}
                <div className="hero-right">
                    <div className="card-stack">

                        <div className="card card-left">
                            <img src={karthi7} alt="perfume card 1" />
                        </div>

                        <div className="card card-right">
                            <img src={karthi8} alt="perfume card 3" />
                        </div>

                        <div className="card card-center">
                            <img src={karthi9} alt="perfume card 2" />
                        </div>

                    </div>
                </div>
            </section>


            {/* ---------- ABOUT SECTION  ---------- */}
            <section className="about">

                <h2 className="about-heading">The Art of Fragrance</h2>

                <p className="about-text">
                    A perfume is more than a scent. It is the first thing people
                    notice and the one thing they remember. Every fragrance opens
                    fresh, warms up into its heart and settles into a deep base
                    that stays on your skin for hours.
                </p>

                {/* 3 cards - left, center, right */}
                <div className="note-cards">

                    <div className="note-card note-left">
                        <h3>Top Notes</h3>
                        <p>
                            The first spray. Light citrus, bergamot and mint
                            greet you and fade in the first 15 to 30 minutes.
                        </p>
                    </div>

                    <div className="note-card note-center">
                        <h3>Heart Notes</h3>
                        <p>
                            The true character. Rose, jasmine and lavender
                            bloom once the top notes fade and stay for a few hours.
                        </p>
                    </div>

                    <div className="note-card note-right">
                        <h3>Base Notes</h3>
                        <p>
                            The long goodbye. Oud, amber, musk and vanilla
                            linger on your skin for many hours.
                        </p>
                    </div>

                </div>
            </section>


            {/* ---------- COLLECTION SECTION ---------- */}
            <section id="collection" className="collection">

                <h2 className="collection-heading">Our Collection</h2>

                {/* TOP ROW  */}
                <div className="slider-row">
                    <div className="slider-track slide-left">
                        {/* topRow rendu thadava podrom, appo thaan nagarum bodhu gap varaadhu */}
                        {[...topRow, ...topRow].map((img, index) => (
                            <div className="slide-card" key={index}>
                                <img src={img} alt="perfume" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* BOTTOM ROW - right*/}
                <div className="slider-row">
                    <div className="slider-track slide-right">
                        {[...bottomRow, ...bottomRow].map((img, index) => (
                            <div className="slide-card" key={index}>
                                <img src={img} alt="perfume" />
                            </div>
                        ))}
                    </div>
                </div>

            </section>


            {/* ---------- STORY SECTION  ---------- */}
            <section
                className="parallax"
                style={{
                    backgroundImage: `linear-gradient(rgba(30, 18, 11, 0.6), rgba(30, 18, 11, 0.6)), url(${karthi11})`
                }}
            >
                <div className="parallax-first">
                    <h3 className="parallax-heading">Made in Small Batches</h3>

                    <p className="parallax-text">
                        Every bottle begins with a single note. We blend rare oils,
                        aged woods and fresh flowers in small batches, so each scent
                        feels personal and lasts all day.
                    </p>
                </div>

                <div id="contact" className="parallax-next">
                    <div className="parallax-box">
                        <h3>Find your signature scent</h3>

                        <p>
                            Visit our store or send us a message. We will help
                            you pick the fragrance that feels like you.
                        </p>

                        <button className="hero-button" onClick={() => setShowForm(true)}>Contact Us</button>
                    </div>
                </div>
            </section>


            {/* ---------- STORY SECTION (left image, right headings + paragraphs) ---------- */}
            <section id="story" className="story">

                {/* LEFT  */}
                <img className="story-image" src={karthi10} alt="perfume story" />

                {/* RIGHT */}
                <div className="story-content">
                    <h2 className="story-heading">Our Story</h2>

                    <div className="story-item">
                        <h3>Born from a single scent</h3>
                        <p>
                            It started with one oud blend and a simple idea: a perfume
                            should feel like a memory, not an advertisement.
                        </p>
                    </div>

                    <div className="story-item">
                        <h3>Rare ingredients</h3>
                        <p>
                            We source oud, amber, rose and sandalwood from trusted
                            growers and age every blend for weeks before it reaches a bottle.
                        </p>
                    </div>

                    <div className="story-item">
                        <h3>Made to last</h3>
                        <p>
                            Every bottle is filled by hand and tested for how long it
                            stays on skin, so your scent lasts from morning till night.
                        </p>
                    </div>
                </div>
            </section>


            {/* ---------- FOOTER ---------- */}
            <footer className="footer">

                <div className="footer-top">

                    <div className="footer-brand">
                        <h2 className="footer-logo">PERFUME</h2>
                        <p className="footer-slogan">Wear your story.</p>

                        <div className="social-icons">

                            <a className="social-icon" href="#home" aria-label="Instagram">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>

                            <a className="social-icon" href="#home" aria-label="Facebook">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>

                            <a className="social-icon" href="#home" aria-label="YouTube">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                                </svg>
                            </a>

                        </div>
                    </div>

                    <div className="footer-column footer-brands">
                        <h4>Brands</h4>
                        <ul>
                            <li>French Essence</li>
                            <li>Denver</li>
                            <li>Horizon</li>
                        </ul>
                    </div>

                    <div className="footer-column footer-quick">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#home">Home</a></li>
                            <li><a href="#collection">Collection</a></li>
                            <li><a href="#story">Story</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>

                </div>

                <p className="footer-bottom">© 2026 Perfume. All rights reserved.</p>
            </footer>


            {showForm && (
                <div className="modal-bg" onClick={closeForm}>

                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>

                        <button className="modal-close" onClick={closeForm}>✕</button>

                        {formSent ? (
                            <div className="modal-thanks">
                                <h3>Thank you!</h3>
                                <p>We got your message and will reply soon.</p>
                                <button className="hero-button" onClick={closeForm}>Close</button>
                            </div>
                        ) : (
                            // form
                            <form onSubmit={handleSubmit}>
                                <h3>Contact us</h3>

                                <input className="form-input" type="text" placeholder="Your name" required />
                                <input className="form-input" type="email" placeholder="Your email" required />
                                <textarea className="form-input form-message" placeholder="Your message" required></textarea>

                                <button type="submit" className="hero-button form-button">Send Message</button>
                            </form>
                        )}

                    </div>
                </div>
            )}

        </div>
    );
}

export default Home;