$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    if (name) {
        $('#name').text(name);
    }

    const dustCanvas = document.getElementById('gold-dust');
    const dustCtx = dustCanvas.getContext('2d');
    let particles = [];

    function resizeDust() {
        dustCanvas.width = window.innerWidth;
        dustCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeDust);
    resizeDust();

    class Particle {
        constructor() {
            this.x = Math.random() * dustCanvas.width;
            this.y = Math.random() * dustCanvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > dustCanvas.width) this.x = 0;
            if (this.x < 0) this.x = dustCanvas.width;
            if (this.y > dustCanvas.height) this.y = 0;
            if (this.y < 0) this.y = dustCanvas.height;
        }
        draw() {
            dustCtx.fillStyle = `rgba(0, 191, 255, ${this.opacity})`;
            dustCtx.beginPath();
            dustCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            dustCtx.fill();
        }
    }

    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }

    function animateDust() {
        dustCtx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateDust);
    }
    animateDust();

    $('#play').click(function() {
        $('#loader').fadeOut(1000, function() {
            $('#main').fadeIn(1000);
            startConfetti();
            
            const audio = document.getElementById('song');
            $('#music-loader').show();
            audio.addEventListener('canplaythrough', function() {
                $('#music-loader').fadeOut();
            }, { once: true });
            audio.play().catch(function() {
                $('#music-loader').fadeOut();
            });
            
            new Typed('#typed', {
                stringsElement: '#typed-strings',
                typeSpeed: 40,
                backSpeed: 20,
                loop: true
            });
        });
    });

    $('.letter-btn').click(function(e) {
        e.preventDefault();
        const targetUrl = $(this).attr('href');
        $('#main').fadeOut(800, function() {
            window.location.href = targetUrl;
        });
    });

    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 100;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                if ($('#letter-btn').is(':visible')) {
                    $('#letter-btn').trigger('click');
                }
            }
        }
    }

    $('#wish-btn').click(function() {
        $(this).fadeOut(300);
        $('.visuals').fadeOut(300);
        $('.typing-container').fadeOut(300);
        setTimeout(() => {
            $('#candle-container').fadeIn(500);
            startCountdown();
        }, 300);
    });

    function startCountdown() {
        let count = 10;
        const clockNumber = $('#clock-number');
        const clockHand = document.getElementById('clock-hand');
        clockNumber.text(count);
        
        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                clockNumber.text(count);
                const rotation = (10 - count) * 36;
                clockHand.style.transform = `rotate(${rotation}deg)`;
                clockHand.style.transformOrigin = '50% 50%';
            } else {
                clearInterval(countdownInterval);
                $('.clock-container').fadeOut(300);
                setTimeout(() => {
                    $('.blow-instruction').text('Now blow the candle 🕯️');
                    setTimeout(() => {
                        blowCandle();
                    }, 3000);
                }, 300);
            }
        }, 1000);
    }

    function blowCandle() {
        const flame = document.getElementById('flame');
        const wick = document.getElementById('wick');
        const smoke = document.getElementById('smoke');
        
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }
        
        flame.style.display = 'none';
        wick.style.display = 'none';
        smoke.style.display = 'block';
        $('.blow-instruction').text('✨ Making your wish come true... ✨');
        
        setTimeout(() => {
            $('#candle-container').fadeOut(500);
            setTimeout(() => {
                $('#wish-message').fadeIn(500);
                $('#letter-btn').fadeIn(500);
                createWishAnimation();
            }, 500);
        }, 2000);
    }

    function createWishAnimation() {
        const canvas = document.getElementById('confetti');
        const ctx = canvas.getContext('2d');
        let wishParticles = [];
        const numberOfParticles = 100;
        const colors = ['#FFD700', '#FF69B4', '#00BFFF', '#87CEEB', '#FFFFFF'];

        class WishParticle {
            constructor() {
                this.x = canvas.width / 2;
                this.y = canvas.height / 2;
                this.size = Math.random() * 8 + 4;
                this.speedX = (Math.random() - 0.5) * 15;
                this.speedY = (Math.random() - 0.5) * 15;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = 1;
                this.decay = Math.random() * 0.02 + 0.01;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.speedY += 0.2;
                this.opacity -= this.decay;
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < numberOfParticles; i++) {
            wishParticles.push(new WishParticle());
        }

        function animateWish() {
            wishParticles.forEach((p, index) => {
                p.update();
                p.draw();
                if (p.opacity <= 0) {
                    wishParticles.splice(index, 1);
                }
            });
            if (wishParticles.length > 0) {
                requestAnimationFrame(animateWish);
            }
        }
        animateWish();
    }

    function startConfetti() {
        const canvas = document.getElementById('confetti');
        const ctx = canvas.getContext('2d');
        let pieces = [];
        const numberOfPieces = 50;
        const colors = ['#00BFFF', '#87CEEB', '#E0F4FF', '#FFFFFF', '#FFD700'];

        function resizeConfetti() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeConfetti);
        resizeConfetti();

        startBalloons();

        canvas.addEventListener('click', function(e) {
            createConfettiBurst(e.clientX, e.clientY);
        });

        canvas.addEventListener('touchstart', function(e) {
            const touch = e.touches[0];
            createConfettiBurst(touch.clientX, touch.clientY);
        });

        class Piece {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height - canvas.height;
                this.rotation = Math.random() * 360;
                this.speed = Math.random() * 3 + 2;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.width = Math.random() * 10 + 5;
                this.height = Math.random() * 10 + 5;
            }
            update() {
                this.y += this.speed;
                this.rotation += 1;
                if (this.y > canvas.height) {
                    this.y = -20;
                    this.x = Math.random() * canvas.width;
                }
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation * Math.PI / 180);
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
                ctx.restore();
            }
        }

        for (let i = 0; i < numberOfPieces; i++) {
            pieces.push(new Piece());
        }

        function animateConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateConfetti);
        }
        animateConfetti();
    }

    function createConfettiBurst(x, y) {
        const canvas = document.getElementById('confetti');
        const ctx = canvas.getContext('2d');
        let burstParticles = [];
        const numberOfBurst = 20;
        const burstColors = ['#FFD700', '#FF69B4', '#00BFFF', '#87CEEB', '#FFFFFF'];

        class BurstParticle {
            constructor() {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 6 + 3;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 8 + 4;
                this.speedX = Math.cos(angle) * speed;
                this.speedY = Math.sin(angle) * speed;
                this.color = burstColors[Math.floor(Math.random() * burstColors.length)];
                this.opacity = 1;
                this.decay = Math.random() * 0.03 + 0.02;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.speedY += 0.3;
                this.opacity -= this.decay;
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < numberOfBurst; i++) {
            burstParticles.push(new BurstParticle());
        }

        function animateBurst() {
            burstParticles.forEach((p, index) => {
                p.update();
                p.draw();
                if (p.opacity <= 0) {
                    burstParticles.splice(index, 1);
                }
            });
            if (burstParticles.length > 0) {
                requestAnimationFrame(animateBurst);
            }
        }
        animateBurst();
    }

    function startBalloons() {
        const canvas = document.getElementById('balloons');
        const ctx = canvas.getContext('2d');
        let balloons = [];
        const balloonColors = ['#FF69B4', '#87CEEB', '#FFD700', '#98FB98', '#DDA0DD'];

        function resizeBalloons() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeBalloons);
        resizeBalloons();

        class Balloon {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + 50;
                this.size = Math.random() * 30 + 20;
                this.speed = Math.random() * 1 + 0.5;
                this.color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
                this.wobble = Math.random() * Math.PI * 2;
                this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            }
            update() {
                this.y -= this.speed;
                this.wobble += this.wobbleSpeed;
                this.x += Math.sin(this.wobble) * 0.5;
                if (this.y < -50) {
                    this.y = canvas.height + 50;
                    this.x = Math.random() * canvas.width;
                }
            }
            draw() {
                ctx.save();
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.ellipse(this.x, this.y, this.size * 0.8, this.size, 0, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.beginPath();
                ctx.ellipse(this.x - this.size * 0.2, this.y - this.size * 0.3, this.size * 0.2, this.size * 0.3, -0.5, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.strokeStyle = '#666';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y + this.size);
                ctx.lineTo(this.x, this.y + this.size + 20);
                ctx.stroke();
                ctx.restore();
            }
        }

        for (let i = 0; i < 8; i++) {
            balloons.push(new Balloon());
        }

        function animateBalloons() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            balloons.forEach(b => {
                b.update();
                b.draw();
            });
            requestAnimationFrame(animateBalloons);
        }
        animateBalloons();
    }
});
