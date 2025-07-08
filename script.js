// Refill & Go - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Sticky Header
    const header = document.querySelector('header');
    let scrollPosition = window.scrollY;
    
    window.addEventListener('scroll', function() {
        scrollPosition = window.scrollY;
        
        if (scrollPosition > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Testimonial Slider (Simple Version)
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;
    
    // Only initialize if there are testimonials
    if (testimonials.length > 1) {
        // Hide all testimonials except the first one
        testimonials.forEach((testimonial, index) => {
            if (index !== 0) {
                testimonial.style.display = 'none';
            }
        });
        
        // Function to show next testimonial
        function showNextTestimonial() {
            testimonials[currentTestimonial].style.display = 'none';
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            testimonials[currentTestimonial].style.display = 'flex';
        }
        
        // Auto-rotate testimonials every 5 seconds
        setInterval(showNextTestimonial, 5000);
    }
    
    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Here you would typically send the email to your server
                // For demo purposes, we'll just show an alert
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            }
        });
    }
    
    // Donation Button Click Handler
    const donateBtn = document.querySelector('.donate-btn');
    if (donateBtn) {
        donateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // In a real implementation, this would redirect to a payment processor
            alert('Thank you for your interest in supporting our environmental mission! In a real implementation, this would connect to a secure payment system like PayPal or Stripe.');
        });
    }
    
    // === COMMENT SECTION LOGIC START ===

const commentForm = document.createElement('form');
commentForm.id = 'comment-form';
commentForm.innerHTML = `
  <h2>Leave a Comment</h2>
  <label>Name (required):<br><input type="text" name="name" required maxlength="100"></label><br>
  <label>Message (required):<br><textarea name="message" required maxlength="1000" rows="4"></textarea></label><br>
  <button type="submit">Submit</button>
  <div id="comment-form-error" style="color:red;"></div>
`;

const commentSection = document.createElement('section');
commentSection.id = 'comments-section-inner';
commentSection.innerHTML = `
  <h2>What Our Community Says</h2>
                <p class="section-subtitle">Join hundreds of happy refill enthusiasts</p>
  <div id="comments-list"></div>
`;

const commentsFlex = document.createElement('div');
commentsFlex.className = 'comments-flex';
commentsFlex.appendChild(commentForm);
commentsFlex.appendChild(commentSection);

const commentsContainer = document.getElementById('comments-section');
if (commentsContainer) {
  commentsContainer.appendChild(commentsFlex);
}

function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

commentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorDiv = document.getElementById('comment-form-error');
  errorDiv.textContent = '';
  const formData = new FormData(commentForm);
  const name = formData.get('name').trim();
  const message = formData.get('message').trim();
  if (!name || !message) {
    errorDiv.textContent = 'Name and message are required.';
    return;
  }
  if (message.length > 1000) {
    errorDiv.textContent = 'Message is too long (max 1000 characters).';
    return;
  }
  let imageBase64 = '';
  const imageFile = formData.get('image');
  if (imageFile && imageFile.size > 0) {
    if (!imageFile.type.startsWith('image/')) {
      errorDiv.textContent = 'Only image files are allowed.';
      return;
    }
    imageBase64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });
  }
  const payload = {
    name,
    message,
    image_base64: imageBase64
  };
  try {
    const res = await fetch('/.netlify/functions/post-comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to post comment');
    commentForm.reset();
    fetchAndRenderComments();
  } catch (err) {
    errorDiv.textContent = 'Error posting comment.';
  }
});

let allComments = [];
let showingAll = false;
let hideAllBtn = null;

function renderComments(comments, showAll = false) {
  const listDiv = document.getElementById('comments-list');
  if (!comments || comments.length === 0) {
    listDiv.innerHTML = '<p>No comments yet.</p>';
    if (hideAllBtn) hideAllBtn.style.display = 'none';
    return;
  }
  listDiv.innerHTML = '';
  const toShow = showAll ? comments : comments.slice(0, 5);
  for (const c of toShow) {
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `
      <div class="comment-header">
        <strong>${sanitize(c.name)}</strong>
        <span class="comment-date">${new Date(c.created_at).toLocaleString()}</span>
      </div>
      ${c.image_url ? `<img src="${sanitize(c.image_url)}" alt="comment image" class="comment-image">` : ''}
      <div class="comment-message">${sanitize(c.message)}</div>
    `;
    listDiv.appendChild(div);
  }
  // Show button if not showing all and more than 5 comments
  let showAllBtn = document.getElementById('show-all-comments-btn');
  if (!showAll && comments.length > 5) {
    if (!showAllBtn) {
      showAllBtn = document.createElement('button');
      showAllBtn.id = 'show-all-comments-btn';
      showAllBtn.textContent = 'Show all comments';
      showAllBtn.className = 'show-all-comments-btn';
      showAllBtn.onclick = () => {
        showingAll = true;
        renderComments(allComments, true);
      };
      listDiv.parentElement.appendChild(showAllBtn);
    } else {
      showAllBtn.style.display = '';
    }
    if (hideAllBtn) hideAllBtn.style.display = 'none';
  } else if (showAll) {
    if (!hideAllBtn) {
      hideAllBtn = document.createElement('button');
      hideAllBtn.id = 'hide-all-comments-btn';
      hideAllBtn.textContent = 'Hide all comments';
      hideAllBtn.className = 'hide-all-comments-btn';
      hideAllBtn.onclick = () => {
        showingAll = false;
        renderComments(allComments, false);
      };
      document.body.appendChild(hideAllBtn);
    }
    hideAllBtn.style.display = 'block';
    if (showAllBtn) showAllBtn.style.display = 'none';
  } else {
    if (showAllBtn) showAllBtn.style.display = 'none';
    if (hideAllBtn) hideAllBtn.style.display = 'none';
  }
}

async function fetchAndRenderComments() {
  const listDiv = document.getElementById('comments-list');
  listDiv.innerHTML = 'Loading...';
  try {
    const res = await fetch('/.netlify/functions/get-comments');
    if (!res.ok) throw new Error('Failed to fetch comments');
    const comments = await res.json();
    if (!Array.isArray(comments)) throw new Error('Invalid response');
    allComments = comments;
    renderComments(comments, showingAll);
  } catch (err) {
    listDiv.innerHTML = '<p>Error loading comments.</p>';
  }
}

fetchAndRenderComments();

// === COMMENT SECTION LOGIC END ===
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animation on scroll (simple version)
    const animatedElements = document.querySelectorAll('.step, .product-card, .benefit-card, .vision-card');
    
    function checkIfInView() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
        
        // Animate progress bar when in view
        const supportProgress = document.querySelector('.support-progress');
        if (supportProgress) {
            const progressBar = supportProgress.querySelector('.progress');
            const progressTop = supportProgress.getBoundingClientRect().top;
            
            if (progressTop < window.innerHeight - 100) {
                // Set initial width to 0 and then animate to the target width
                if (!progressBar.classList.contains('animated')) {
                    progressBar.style.width = '0%';
                    setTimeout(() => {
                        progressBar.style.width = '45%';
                        progressBar.classList.add('animated');
                    }, 300);
                }
            }
        }
    }
    
    // Add visible class to elements in view on page load
    window.addEventListener('load', checkIfInView);
    
    // Add visible class to elements in view on scroll
    window.addEventListener('scroll', checkIfInView);
    
    console.log('Refill & Go - JavaScript initialized');
});