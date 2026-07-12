const API_URL = '/api';
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    setMinDate();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('searchForm').addEventListener('submit', handleSearch);
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    document.getElementById('bookingForm').addEventListener('submit', handleBooking);
}

function updateAuthUI() {
    const authLinks = document.getElementById('authLinks');
    const userMenu = document.getElementById('userMenu');

    if (authToken && currentUser) {
        authLinks.style.display = 'none';
        userMenu.style.display = 'block';
    } else {
        authLinks.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

// Auth Functions
function openLoginModal() {
    document.getElementById('loginModal').classList.add('show');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
}

function openSignupModal() {
    document.getElementById('signupModal').classList.add('show');
}

function closeSignupModal() {
    document.getElementById('signupModal').classList.remove('show');
}

function toggleAuthModals() {
    if (document.getElementById('loginModal').classList.contains('show')) {
        closeLoginModal();
        openSignupModal();
    } else {
        closeSignupModal();
        openLoginModal();
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (data.success) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showSuccess('Login successful!');
            closeLoginModal();
            updateAuthUI();
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('Login failed: ' + error.message);
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const userType = document.getElementById('signupUserType').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password, userType })
        });

        const data = await response.json();
        if (data.success) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showSuccess('Account created successfully!');
            closeSignupModal();
            updateAuthUI();
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('Signup failed: ' + error.message);
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showSuccess('Logged out successfully');
    document.getElementById('journeyResults').innerHTML = '';
}

// Journey Search
async function handleSearch(e) {
    e.preventDefault();
    if (!authToken) {
        showError('Please login to search journeys');
        openLoginModal();
        return;
    }

    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;
    const date = document.getElementById('date').value;

    try {
        const response = await fetch(
            `${API_URL}/journeys?source=${source}&destination=${destination}&departureDate=${date}`,
            {
                headers: { 'Authorization': `Bearer ${authToken}` }
            }
        );

        const data = await response.json();
        if (data.success && data.journeys) {
            displayJourneys(data.journeys);
        } else {
            showError('No journeys found');
            document.getElementById('journeyResults').innerHTML = '';
        }
    } catch (error) {
        showError('Search failed: ' + error.message);
    }
}

function displayJourneys(journeys) {
    const resultsContainer = document.getElementById('journeyResults');
    resultsContainer.innerHTML = '';

    if (journeys.length === 0) {
        resultsContainer.innerHTML = '<p>No journeys available for your search</p>';
        return;
    }

    journeys.forEach(journey => {
        const journeyCard = document.createElement('div');
        journeyCard.className = 'journey-card';

        const departTime = new Date(journey.departureTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        const arriveTime = new Date(journey.arrivalTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        journeyCard.innerHTML = `
            <div class="journey-header">
                <div class="route-name">${journey.routeName}</div>
                <div class="price">₹${journey.pricePerSeat}</div>
            </div>
            <div class="journey-details">
                <p><i class="fas fa-map-marker-alt"></i> ${journey.source.city} → ${journey.destination.city}</p>
                <p><i class="fas fa-clock"></i> ${departTime} - ${arriveTime}</p>
                <p><i class="fas fa-car"></i> ${journey.vehicle.type} (${journey.vehicle.name})</p>
                <p><i class="fas fa-user"></i> Driver: ${journey.driver.name}</p>
            </div>
            <div class="seats-info">Available Seats: ${journey.availableSeats} / ${journey.totalSeats}</div>
            <div class="amenities">
                ${journey.amenities.map(a => `<span class="amenity-tag">${a}</span>`).join('')}
            </div>
            <button class="btn-primary" onclick="openBookingModal('${journey._id}', '${journey.routeName}', ${journey.pricePerSeat}, ${journey.availableSeats})">
                Book Now
            </button>
        `;

        resultsContainer.appendChild(journeyCard);
    });
}

// Booking
function openBookingModal(journeyId, routeName, price, availableSeats) {
    if (!authToken) {
        showError('Please login to book');
        openLoginModal();
        return;
    }

    document.getElementById('bookingModal').classList.add('show');
    document.getElementById('bookingDetails').innerHTML = `
        <p><strong>Route:</strong> ${routeName}</p>
        <p><strong>Price per seat:</strong> ₹${price}</p>
        <p><strong>Available seats:</strong> ${availableSeats}</p>
    `;
    document.getElementById('bookingForm').dataset.journeyId = journeyId;
    document.getElementById('bookingForm').dataset.pricePerSeat = price;

    document.getElementById('seats').onchange = updateBookingPrice;
    document.getElementById('seats').max = availableSeats;
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('show');
}

function updateBookingPrice() {
    const seats = parseInt(document.getElementById('seats').value) || 0;
    const pricePerSeat = parseInt(document.getElementById('bookingForm').dataset.pricePerSeat);
    const total = seats * pricePerSeat;
    document.getElementById('totalPrice').textContent = '₹' + total;
}

async function handleBooking(e) {
    e.preventDefault();
    const journeyId = document.getElementById('bookingForm').dataset.journeyId;
    const numberOfSeats = parseInt(document.getElementById('seats').value);
    const paymentMethod = document.getElementById('paymentMethod').value;
    const pickupPoint = document.getElementById('pickupPoint').value;
    const specialRequests = document.getElementById('specialRequests').value;

    try {
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                journeyId,
                numberOfSeats,
                paymentMethod,
                pickupPoint,
                specialRequests,
                seatNumbers: Array.from({length: numberOfSeats}, (_, i) => `S${i+1}`)
            })
        });

        const data = await response.json();
        if (data.success) {
            showSuccess(`Booking confirmed! Booking ID: ${data.booking.bookingNumber}`);
            closeBookingModal();
            document.getElementById('bookingForm').reset();
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('Booking failed: ' + error.message);
    }
}

// Profile
function viewProfile() {
    alert(`Logged in as: ${currentUser.name}\nEmail: ${currentUser.email}\nType: ${currentUser.userType}`);
}

function viewBookings() {
    showSuccess('Redirecting to bookings page...');
}

// Utilities
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').min = today;
}

function showSuccess(message) {
    alert('✓ ' + message);
}

function showError(message) {
    alert('✗ ' + message);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const bookingModal = document.getElementById('bookingModal');

    if (event.target == loginModal) loginModal.classList.remove('show');
    if (event.target == signupModal) signupModal.classList.remove('show');
    if (event.target == bookingModal) bookingModal.classList.remove('show');
}
