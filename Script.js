// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = navMenu.contains(event.target) || menuToggle.contains(event.target);
            if (!isClickInsideMenu && navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
            }
        });
    }

    // Hotel Booking Modal
    const hotelBookingModal = document.getElementById('hotelBookingModal');
    const closeBtn = document.querySelector('.close-btn');
    const hotelBookingForm = document.getElementById('hotelBookingForm');
    
    if (hotelBookingModal) {
        function openBookingModal(hotelName, price, roomType) {
            document.getElementById('hotelName').value = hotelName;
            document.getElementById('roomType').value = roomType;
            document.getElementById('basePrice').value = price;
            
            // Update summary
            document.getElementById('summaryHotel').textContent = hotelName;
            document.getElementById('summaryRoomType').textContent = 
                roomType === 'ac' ? 'Air Conditioned' : 'Fan Room';
            document.getElementById('summaryPriceNight').textContent = price.toFixed(2);
            
            // Set minimum date for booking
            const today = new Date();
            const minDate = today.toISOString().split('T')[0];
            document.getElementById('checkInDate').min = minDate;
            document.getElementById('checkOutDate').min = minDate;
            
            // Reset dates and recalculate
            document.getElementById('checkInDate').value = '';
            document.getElementById('checkOutDate').value = '';
            updateBookingSummary();
            
            hotelBookingModal.style.display = 'flex';
        }
        
        function closeBookingModal() {
            hotelBookingModal.style.display = 'none';
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeBookingModal);
        }
        
        window.addEventListener('click', function(event) {
            if (event.target === hotelBookingModal) {
                closeBookingModal();
            }
        });
        
        // Update booking summary
        function updateBookingSummary() {
            const checkInDate = document.getElementById('checkInDate')?.value;
            const checkOutDate = document.getElementById('checkOutDate')?.value;
            const guests = document.getElementById('guests')?.value;
            const basePrice = parseFloat(document.getElementById('basePrice')?.value || 0);
            
            if (guests) {
                document.getElementById('summaryGuests').textContent = guests;
            }
            
            if (checkInDate && checkOutDate) {
                const oneDay = 24 * 60 * 60 * 1000;
                const start = new Date(checkInDate);
                const end = new Date(checkOutDate);
                
                const diffDays = Math.round(Math.abs((end - start) / oneDay));
                document.getElementById('summaryNights').textContent = diffDays;
                
                const totalPrice = basePrice * diffDays;
                document.getElementById('summaryTotalPrice').textContent = totalPrice.toFixed(2);
            }
        }
        
        if (document.getElementById('checkInDate')) {
            document.getElementById('checkInDate').addEventListener('change', updateBookingSummary);
            document.getElementById('checkOutDate').addEventListener('change', updateBookingSummary);
            document.getElementById('guests').addEventListener('change', updateBookingSummary);
        }
        
        if (hotelBookingForm) {
            hotelBookingForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = {
                    hotel: document.getElementById('hotelName').value,
                    roomType: document.getElementById('roomType').value,
                    checkIn: document.getElementById('checkInDate').value,
                    checkOut: document.getElementById('checkOutDate').value,
                    guests: document.getElementById('guests').value,
                    name: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    totalPrice: document.getElementById('summaryTotalPrice').textContent
                };
                
                const roomTypeText = formData.roomType === 'ac' ? 'Air Conditioned' : 'Fan Room';
                const confirmationMsg = `
                    Thank you for your booking at ${formData.hotel}!
                    Room Type: ${roomTypeText}
                    Check-in: ${formData.checkIn}
                    Check-out: ${formData.checkOut}
                    Guests: ${formData.guests}
                    Total Price: GHC ${formData.totalPrice}
                    We've sent a confirmation to ${formData.email}.
                `;
                
                alert(confirmationMsg);
                closeBookingModal();
                this.reset();
            });
        }
    }

    // Room selection functionality
    document.querySelectorAll('.room-option').forEach(option => {
        option.addEventListener('click', function() {
            const siblings = this.parentElement.children;
            for (let i = 0; i < siblings.length; i++) {
                siblings[i].classList.remove('selected');
            }
            
            this.classList.add('selected');
            
            const hotelCard = this.closest('.hotel-card');
            if (hotelCard) {
                const hotelName = hotelCard.querySelector('.hotel-name').textContent;
                const roomType = this.getAttribute('data-type');
                const roomPrice = this.getAttribute('data-price');
                
                const bookBtn = hotelCard.querySelector('.exhibit-btn');
                bookBtn.onclick = () => openBookingModal(hotelName, roomPrice, roomType);
            }
        });
    });

    // Form submission handlers
    if (document.getElementById('museumContactForm')) {
        document.getElementById('museumContactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }

    if (document.getElementById('transportForm')) {
        document.getElementById('transportForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const transportType = document.getElementById('transportType').value;
            alert(`Your ${transportType} booking has been confirmed!`);
            this.reset();
        });
    }

    // Set minimum date for transport booking
    const pickupDate = document.getElementById('pickupDate');
    if (pickupDate) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];
        pickupDate.min = minDate;
    }

    // Initialize Google Maps if needed
    if (document.getElementById('map') || document.getElementById('contactMap')) {
        function initMap() {
            const paga = { lat: 10.9932, lng: -1.0963 };
            
            if (document.getElementById("map")) {
                const map = new google.maps.Map(document.getElementById("map"), {
                    zoom: 12,
                    center: paga,
                    mapTypeId: "terrain"
                });
                
                new google.maps.Marker({
                    position: paga,
                    map: map,
                    title: "Paga Crocodile Pond"
                });
            }
            
            if (document.getElementById("contactMap")) {
                new google.maps.Map(document.getElementById("contactMap"), {
                    center: paga,
                    zoom: 15,
                    mapTypeId: "terrain"
                });
            }
        }
        window.initMap = initMap;
    }
});