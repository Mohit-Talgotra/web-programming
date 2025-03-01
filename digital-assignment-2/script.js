document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('booking-form');
    const eventSelect = document.getElementById('event-select');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const ticketsInput = document.getElementById('tickets');
    const paymentSelect = document.getElementById('payment');
    const creditCardDetails = document.getElementById('credit-card-details');
    const cardNumberInput = document.getElementById('card-number');
    const cardExpiryInput = document.getElementById('card-expiry');
    const cardCvvInput = document.getElementById('card-cvv');
    const seatContainer = document.getElementById('seat-container');
    
    const summaryEvent = document.getElementById('summary-event');
    const summaryTickets = document.getElementById('summary-tickets');
    const summarySeats = document.getElementById('summary-seats');
    const summaryPrice = document.getElementById('summary-price');
    const summaryTotal = document.getElementById('summary-total');
    
    function generateSeats() {
        seatContainer.innerHTML = '';
        
        const rows = ['A', 'B', 'C', 'D'];
        const seatsPerRow = 8;
        
        rows.forEach(row => {
            for (let i = 1; i <= seatsPerRow; i++) {
                const seat = document.createElement('div');
                const seatNumber = row + i;
                seat.className = 'seat';
                seat.dataset.seat = seatNumber;
                seat.textContent = seatNumber;
                
                const random = Math.random();
                if (random < 0.2) {
                    seat.className = 'seat unavailable';
                } else {
                    seat.className = 'seat available';
                    seat.addEventListener('click', toggleSeat);
                }
                
                seatContainer.appendChild(seat);
            }
        });
    }
    
    function toggleSeat(e) {
        const seat = e.target;
        if (seat.classList.contains('unavailable')) return;
        
        seat.classList.toggle('available');
        seat.classList.toggle('selected');
        
        updateSummary();
    }
    
    function updateSummary() {
        const selectedEvent = eventSelect.value;
        const numTickets = ticketsInput.value;
        const selectedOption = eventSelect.options[eventSelect.selectedIndex];
        const price = selectedOption ? selectedOption.getAttribute('data-price') : '';
        
        const selectedSeats = document.querySelectorAll('.seat.selected');
        const seatsList = Array.from(selectedSeats).map(seat => seat.dataset.seat).join(', ');
        
        summaryEvent.textContent = selectedEvent || '-';
        summaryTickets.textContent = numTickets || '-';
        summarySeats.textContent = seatsList || '-';
        summaryPrice.textContent = price ? `$${price}` : '-';
        
        const total = price ? (parseFloat(price) * parseInt(numTickets)).toFixed(2) : '0.00';
        summaryTotal.textContent = `₹${total}`;
    }
    
    function validateForm(e) {
        e.preventDefault();
        
        let isValid = true;
        
        const eventError = document.getElementById('event-error');
        const nameError = document.getElementById('name-error');
        const emailError = document.getElementById('email-error');
        const phoneError = document.getElementById('phone-error');
        const ticketsError = document.getElementById('tickets-error');
        const paymentError = document.getElementById('payment-error');
        
        eventError.textContent = '';
        nameError.textContent = '';
        emailError.textContent = '';
        phoneError.textContent = '';
        ticketsError.textContent = '';
        paymentError.textContent = '';
        
        if (!eventSelect.value) {
            eventError.textContent = 'Please select an event';
            isValid = false;
        }
        
        if (!nameInput.value.trim()) {
            nameError.textContent = 'Please enter your name';
            isValid = false;
        }
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value)) {
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(phoneInput.value.replace(/\D/g, ''))) {
            phoneError.textContent = 'Please enter a valid 10-digit phone number';
            isValid = false;
        }
        
        const ticketsValue = parseInt(ticketsInput.value);
        if (isNaN(ticketsValue) || ticketsValue < 1 || ticketsValue > 10) {
            ticketsError.textContent = 'Please select between 1 and 10 tickets';
            isValid = false;
        }
        
        const selectedSeats = document.querySelectorAll('.seat.selected');
        if (selectedSeats.length !== ticketsValue) {
            ticketsError.textContent = `Please select exactly ${ticketsValue} seats`;
            isValid = false;
        }
        
        if (!paymentSelect.value) {
            paymentError.textContent = 'Please select a payment method';
            isValid = false;
        }
        
        if (paymentSelect.value === 'credit') {
            const cardNumberError = document.getElementById('card-number-error');
            const cardExpiryError = document.getElementById('card-expiry-error');
            const cardCvvError = document.getElementById('card-cvv-error');
            
            cardNumberError.textContent = '';
            cardExpiryError.textContent = '';
            cardCvvError.textContent = '';
            
            const cardNumber = cardNumberInput.value.replace(/\s/g, '');
            if (!/^\d{16}$/.test(cardNumber)) {
                cardNumberError.textContent = 'Please enter a valid 16-digit card number';
                isValid = false;
            }
            
            if (!/^\d{2}\/\d{2}$/.test(cardExpiryInput.value)) {
                cardExpiryError.textContent = 'Please enter a valid expiry date (MM/YY)';
                isValid = false;
            }
            
            if (!/^\d{3}$/.test(cardCvvInput.value)) {
                cardCvvError.textContent = 'Please enter a valid 3-digit CVV';
                isValid = false;
            }
        }
        
        if (isValid) {
            alert('Booking successful! Your tickets have been booked.');
            bookingForm.reset();
            generateSeats();
            updateSummary();
        }
        
        return isValid;
    }
    
    paymentSelect.addEventListener('change', function() {
        if (this.value === 'credit') {
            creditCardDetails.style.display = 'block';
        } else {
            creditCardDetails.style.display = 'none';
        }
    });
    
    document.querySelectorAll('.book-btn').forEach(button => {
        button.addEventListener('click', function() {
            const eventName = this.getAttribute('data-event');
            const eventPrice = this.getAttribute('data-price');
            
            for (let i = 0; i < eventSelect.options.length; i++) {
                if (eventSelect.options[i].value === eventName) {
                    eventSelect.selectedIndex = i;
                    break;
                }
            }
            
            document.location.href = '#booking';
            updateSummary();
        });
    });
    
    eventSelect.addEventListener('change', updateSummary);
    ticketsInput.addEventListener('input', updateSummary);
    bookingForm.addEventListener('submit', validateForm);
    
    cardNumberInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        let formattedValue = '';
        
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        this.value = formattedValue.trim().slice(0, 19);
    });
    
    cardExpiryInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        
        if (value.length > 2) {
            this.value = value.slice(0, 2) + '/' + value.slice(2, 4);
        } else {
            this.value = value;
        }
    });
    
    cardCvvInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').slice(0, 3);
    });
    
    generateSeats();
    updateSummary();
});